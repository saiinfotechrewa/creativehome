import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  withAuthHandler,
  getClientIp,
} from "@/lib/auth-helpers";
import { PERMISSIONS } from "@/lib/permissions";
import { logActivity } from "@/lib/activity-logger";
import {
  ok,
  fail,
  paginated,
  pageMeta,
  parseJson,
  parseQuery,
} from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";
import {
  orderListQuerySchema,
  orderStatusUpdateSchema,
  refundSchema,
  publicOrderCreateSchema,
  paymentVerifySchema,
} from "@/lib/validators";
import {
  createRazorpayOrder,
  refundPayment,
  verifyPaymentSignature,
  RazorpayNotConfigured,
} from "@/lib/razorpay";
import {
  createPendingOrder,
  findOrderByRazorpayOrderId,
  markOrderPaid,
  markOrderRefunded,
} from "@/lib/orders";
import { notifyNewOrder } from "@/lib/notifications";
import { generateInvoicePdf, type InvoiceCompany } from "@/lib/invoice";

/**
 * Orders: admin management (list / detail / status / refund / invoice) and the
 * public checkout that creates a Razorpay order. Payment state itself is driven
 * by the webhook (`@/lib/orders`), not by these handlers.
 */

type IdCtx = { params: Promise<{ id: string }> };

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

// ──────────────────────────────── Admin API ─────────────────────────────────

const list = withAuthHandler(async (req: Request) => {
  await requirePermission(PERMISSIONS.ORDERS_VIEW);
  const q = parseQuery(req, orderListQuerySchema);

  const where: Prisma.OrderWhereInput = {};
  if (q.status) where.status = q.status;
  if (q.customerId) where.customerId = q.customerId;
  if (q.dateFrom || q.dateTo) {
    where.createdAt = {};
    if (q.dateFrom) where.createdAt.gte = q.dateFrom;
    if (q.dateTo) where.createdAt.lte = q.dateTo;
  }
  if (q.search) {
    where.OR = [
      { orderNumber: { contains: q.search, mode: "insensitive" } },
      // customerInfo is JSON — match the stored name/email substring.
      { customerInfo: { path: ["email"], string_contains: q.search } },
      { customerInfo: { path: ["name"], string_contains: q.search } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { [q.sort]: q.order },
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
      include: { customer: { select: { id: true, name: true, email: true } } },
    }),
    prisma.order.count({ where }),
  ]);

  return paginated(items, pageMeta(q.page, q.pageSize, total));
});

const getById = withAuthHandler(async (_req: Request, ctx: IdCtx) => {
  await requirePermission(PERMISSIONS.ORDERS_VIEW);
  const { id } = await ctx.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { customer: true },
  });
  if (!order) return fail("Order not found", 404);

  const activities = await prisma.activityLog.findMany({
    where: { module: "orders", entityId: id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return ok({ ...order, activities });
});

const setStatus = withAuthHandler(async (req: Request, ctx: IdCtx) => {
  const user = await requirePermission(PERMISSIONS.ORDERS_MANAGE);
  const { id } = await ctx.params;

  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return fail("Order not found", 404);

  const { status, note } = await parseJson(req, orderStatusUpdateSchema);
  if (status === existing.status) return ok(existing);

  const order = await prisma.order.update({ where: { id }, data: { status } });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "status_change",
    module: "orders",
    entityId: order.id,
    entityName: order.orderNumber,
    details: { from: existing.status, to: status, note },
    ipAddress: getClientIp(req),
  });

  return ok(order);
});

const refund = withAuthHandler(async (req: Request, ctx: IdCtx) => {
  const user = await requirePermission(PERMISSIONS.ORDERS_MANAGE);
  const { id } = await ctx.params;

  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return fail("Order not found", 404);
  if (existing.status === "REFUNDED") {
    return fail("Order is already refunded", 409);
  }

  const payment = asRecord(existing.payment);
  const paymentId =
    typeof payment.paymentId === "string" ? payment.paymentId : null;
  if (!paymentId) {
    return fail("Order has no captured payment to refund", 422);
  }

  const { amount, reason, speed } = await parseJson(req, refundSchema);

  try {
    const result = await refundPayment({
      paymentId,
      amount,
      speed,
      notes: reason ? { reason } : undefined,
    });

    const order = await markOrderRefunded(existing, {
      refundId: result.id,
      amount: result.amount,
    });

    await logActivity({
      userId: user.id,
      userName: user.name,
      action: "status_change",
      module: "orders",
      entityId: order.id,
      entityName: order.orderNumber,
      details: { refundId: result.id, amount: result.amount, reason },
      ipAddress: getClientIp(req),
    });

    return ok({ order, refund: result });
  } catch (err) {
    if (err instanceof RazorpayNotConfigured) {
      return fail("Razorpay is not configured", 503);
    }
    console.error("[orders] refund failed:", err);
    return fail("Refund failed at the payment gateway", 502);
  }
});

/** GET /[id]/invoice — stream a generated PDF invoice. */
const invoice = withAuthHandler(async (req: Request, ctx: IdCtx) => {
  await requirePermission(PERMISSIONS.ORDERS_VIEW);
  const { id } = await ctx.params;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return fail("Order not found", 404);

  const settings = await prisma.companySettings.findUnique({
    where: { id: "singleton" },
  });
  const company: InvoiceCompany = {
    name: settings?.companyName ?? "CreativeDox",
    email: settings?.email,
    phone: settings?.phone,
    address: asRecord(settings?.address),
  };

  // Persist invoice metadata the first time it's generated.
  const meta = asRecord(order.invoice);
  if (!meta.number) {
    await prisma.order.update({
      where: { id },
      data: {
        invoice: {
          ...meta,
          number: order.orderNumber,
          issuedAt: new Date().toISOString(),
        } as Prisma.InputJsonValue,
      },
    });
  }

  const pdf = generateInvoicePdf(order, company);

  await logActivity({
    action: "export",
    module: "orders",
    entityId: order.id,
    entityName: order.orderNumber,
    details: { invoice: true },
    request: req,
  });

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${order.orderNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
});

export const ordersAdminApi = { list, getById, setStatus, refund, invoice };

// ─────────────────────────── Public checkout ────────────────────────────────

const createPublic = withAuthHandler(async (req: Request) => {
  const ip = getClientIp(req);
  if (!(await rateLimit(`public:orders:${ip}`, 10, 60_000)).success) {
    return fail("Too many requests. Please try again in a minute.", 429);
  }

  const data = await parseJson(req, publicOrderCreateSchema);

  // Server-side sanity check: total must equal subtotal + tax − discount.
  const expected =
    data.pricing.subtotal + data.pricing.tax - data.pricing.discount;
  if (Math.abs(expected - data.pricing.total) > 0.5) {
    return fail("Pricing totals do not add up", 422);
  }

  try {
    const orderNumber = `tmp-${Date.now()}`;
    const rp = await createRazorpayOrder({
      amount: data.pricing.total,
      currency: data.pricing.currency,
      receipt: orderNumber,
      notes: {
        product: data.product.slug,
        email: data.customer.email,
      },
    });

    const order = await createPendingOrder(
      {
        product: data.product,
        pricing: data.pricing,
        subscription: data.subscription,
        customer: data.customer,
      },
      rp.id,
    );

    await notifyNewOrder(order);
    await logActivity({
      userName: "Public website",
      action: "create",
      module: "orders",
      entityId: order.id,
      entityName: order.orderNumber,
      details: { via: "checkout", razorpayOrderId: rp.id },
      ipAddress: ip,
    });

    return ok(
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        razorpay: {
          orderId: rp.id,
          amount: rp.amount,
          currency: rp.currency,
          keyId: rp.keyId,
        },
        customer: {
          name: data.customer.name,
          email: data.customer.email,
          phone: data.customer.phone,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof RazorpayNotConfigured) {
      return fail("Payments are not available right now", 503);
    }
    console.error("[orders] public create failed:", err);
    return fail("Could not start checkout. Please try again.", 502);
  }
});

/**
 * POST /api/public/orders/verify — confirm a checkout from the browser success
 * handler. Verifies the Razorpay signature, then marks the order paid. Safe to
 * race with the webhook: `markOrderPaid` is idempotent.
 */
const verifyPublic = withAuthHandler(async (req: Request) => {
  const ip = getClientIp(req);
  if (!(await rateLimit(`public:orders-verify:${ip}`, 20, 60_000)).success) {
    return fail("Too many requests. Please try again in a minute.", 429);
  }

  const data = await parseJson(req, paymentVerifySchema);

  const valid = await verifyPaymentSignature({
    orderId: data.razorpayOrderId,
    paymentId: data.razorpayPaymentId,
    signature: data.razorpaySignature,
  });
  if (!valid) return fail("Payment could not be verified", 400);

  const order = await findOrderByRazorpayOrderId(data.razorpayOrderId);
  if (!order) return fail("Order not found", 404);

  const updated = await markOrderPaid(order, {
    paymentId: data.razorpayPaymentId,
    signature: data.razorpaySignature,
  });

  return ok({
    orderId: updated.id,
    orderNumber: updated.orderNumber,
    status: updated.status,
  });
});

export const ordersPublicApi = { create: createPublic, verify: verifyPublic };
