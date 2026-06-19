import type { Order, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { getRazorpayCreds } from "@/lib/integrations";
import {
  notifyPaymentSuccess,
  notifyPaymentFailed,
  notifyRefundIssued,
} from "@/lib/notifications";

/**
 * Order lifecycle helpers shared by the public checkout, the admin actions, and
 * the Razorpay webhook. The webhook is the source of truth for payment state,
 * so the state transitions here are written to be idempotent — Razorpay retries
 * webhooks, and the browser callback may race the webhook.
 */

// ─────────────────────────────── Small utils ────────────────────────────────

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}
function str(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}
function num(value: unknown): number {
  return typeof value === "number" ? value : 0;
}
function mergeJson(
  existing: unknown,
  patch: Record<string, unknown>,
): Prisma.InputJsonValue {
  const out = { ...asRecord(existing) };
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) out[k] = v;
  }
  return out as Prisma.InputJsonValue;
}

// ─────────────────────────── Numbering & lookups ────────────────────────────

/** Sequential, human-readable order number: CD-YYYY-000123. */
export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.order.count({
    where: { createdAt: { gte: new Date(year, 0, 1) } },
  });
  return `CD-${year}-${String(count + 1).padStart(6, "0")}`;
}

export function findOrderByRazorpayOrderId(rpOrderId: string) {
  return prisma.order.findFirst({
    where: { payment: { path: ["razorpayOrderId"], equals: rpOrderId } },
  });
}

export function findOrderByPaymentId(paymentId: string) {
  return prisma.order.findFirst({
    where: { payment: { path: ["paymentId"], equals: paymentId } },
  });
}

// ────────────────────────────── Creation ────────────────────────────────────

export interface CreatePendingOrderInput {
  product: Record<string, unknown>;
  pricing: Record<string, unknown>;
  subscription?: Record<string, unknown>;
  customer: Record<string, unknown>;
}

/** Persist a PENDING order tied to a freshly-created Razorpay order id. */
export async function createPendingOrder(
  input: CreatePendingOrderInput,
  razorpayOrderId: string,
): Promise<Order> {
  const orderNumber = await generateOrderNumber();
  return prisma.order.create({
    data: {
      orderNumber,
      product: input.product as Prisma.InputJsonValue,
      pricing: input.pricing as Prisma.InputJsonValue,
      subscription: (input.subscription ?? {}) as Prisma.InputJsonValue,
      customerInfo: input.customer as Prisma.InputJsonValue,
      payment: {
        razorpayOrderId,
        status: "created",
      } as Prisma.InputJsonValue,
      status: "PENDING",
    },
  });
}

// ───────────────────────── Customer reconciliation ──────────────────────────

/**
 * Upsert the buyer into Customers and roll up their spend on a paid order.
 * Called once per successful payment (idempotency is enforced by the caller,
 * which only transitions PENDING → PAID a single time).
 */
export async function applyPaidOrderToCustomer(order: Order): Promise<string | null> {
  const info = asRecord(order.customerInfo);
  const email = str(info.email);
  if (!email) return null;

  const pricing = asRecord(order.pricing);
  const total = num(pricing.total);
  const product = asRecord(order.product);
  const entry = {
    slug: str(product.slug) ?? "",
    name: str(product.name) ?? "",
    plan: str(product.plan) ?? null,
    since: new Date().toISOString(),
  };

  const existing = await prisma.customer.findUnique({ where: { email } });

  let customerId: string;
  if (existing) {
    const active = Array.isArray(existing.activeProducts)
      ? (existing.activeProducts as unknown[])
      : [];
    const updated = await prisma.customer.update({
      where: { email },
      data: {
        totalSpent: { increment: total },
        ordersCount: { increment: 1 },
        phone: existing.phone ?? str(info.phone) ?? null,
        gstNumber: existing.gstNumber ?? str(info.gstNumber) ?? null,
        activeProducts: [...active, entry] as unknown as Prisma.InputJsonValue,
      },
    });
    customerId = updated.id;
  } else {
    const created = await prisma.customer.create({
      data: {
        name: str(info.name) ?? "Customer",
        email,
        phone: str(info.phone) ?? null,
        businessName: str(info.businessName) ?? null,
        gstNumber: str(info.gstNumber) ?? null,
        address: asRecord(info.address) as Prisma.InputJsonValue,
        totalSpent: total,
        ordersCount: 1,
        activeProducts: [entry] as unknown as Prisma.InputJsonValue,
      },
    });
    customerId = created.id;
  }

  if (order.customerId !== customerId) {
    await prisma.order.update({
      where: { id: order.id },
      data: { customerId },
    });
  }
  return customerId;
}

// ───────────────────────── State transitions ────────────────────────────────

/** PENDING → PAID. Idempotent: a no-op if the order is already paid/active. */
export async function markOrderPaid(
  order: Order,
  payment: { paymentId: string; signature?: string },
): Promise<Order> {
  if (order.status === "PAID" || order.status === "ACTIVE") return order;

  const sub = asRecord(order.subscription);
  // Recurring plans go straight to ACTIVE; one-time purchases are PAID.
  const nextStatus =
    str(sub.interval) && str(sub.interval) !== "one_time" ? "ACTIVE" : "PAID";

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: nextStatus,
      payment: mergeJson(order.payment, {
        paymentId: payment.paymentId,
        signature: payment.signature,
        status: "captured",
        capturedAt: new Date().toISOString(),
      }),
    },
  });

  await applyPaidOrderToCustomer(updated);
  await notifyPaymentSuccess(updated);
  await logActivity({
    userName: "Razorpay",
    action: "status_change",
    module: "orders",
    entityId: updated.id,
    entityName: updated.orderNumber,
    details: { to: nextStatus, paymentId: payment.paymentId },
  });
  return updated;
}

/** Record a failed payment attempt. Order stays PENDING (retryable). */
export async function markOrderPaymentFailed(
  order: Order,
  paymentId?: string,
): Promise<Order> {
  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      payment: mergeJson(order.payment, { paymentId, status: "failed" }),
    },
  });
  await notifyPaymentFailed(updated);
  await logActivity({
    userName: "Razorpay",
    action: "status_change",
    module: "orders",
    entityId: updated.id,
    entityName: updated.orderNumber,
    details: { paymentStatus: "failed", paymentId },
  });
  return updated;
}

/** Mark an order refunded (full). Idempotent. */
export async function markOrderRefunded(
  order: Order,
  refund: { refundId: string; amount: number },
): Promise<Order> {
  if (order.status === "REFUNDED") return order;

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "REFUNDED",
      payment: mergeJson(order.payment, {
        refundId: refund.refundId,
        refundStatus: "processed",
        refundedAmount: refund.amount,
        refundedAt: new Date().toISOString(),
      }),
    },
  });
  await notifyRefundIssued(updated, refund.amount);
  await logActivity({
    userName: "Razorpay",
    action: "status_change",
    module: "orders",
    entityId: updated.id,
    entityName: updated.orderNumber,
    details: { to: "REFUNDED", refundId: refund.refundId },
  });
  return updated;
}

// ─────────────────────────── Webhook dispatch ───────────────────────────────

export interface WebhookResult {
  status: number;
  body: Record<string, unknown>;
}

/**
 * Verify and process a Razorpay webhook. Handles the events we care about and
 * acknowledges (200) everything else so Razorpay stops retrying. Always returns
 * a JSON body — never throws — so a handler bug can't wedge the webhook.
 */
export async function handleRazorpayWebhook(
  rawBody: string,
  signature: string | null,
): Promise<WebhookResult> {
  const creds = await getRazorpayCreds();
  if (!creds?.webhookSecret) {
    return { status: 503, body: { error: "Webhook secret not configured" } };
  }
  if (!verifyWebhookSignature(rawBody, signature, creds.webhookSecret)) {
    return { status: 401, body: { error: "Invalid signature" } };
  }

  let event: {
    event?: string;
    payload?: Record<string, { entity?: Record<string, unknown> }>;
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return { status: 400, body: { error: "Malformed JSON" } };
  }

  const type = event.event ?? "";
  const payment = asRecord(event.payload?.payment?.entity);
  const refund = asRecord(event.payload?.refund?.entity);

  try {
    switch (type) {
      case "payment.captured": {
        const rpOrderId = str(payment.order_id);
        const order = rpOrderId
          ? await findOrderByRazorpayOrderId(rpOrderId)
          : null;
        if (order) {
          await markOrderPaid(order, { paymentId: str(payment.id) ?? "" });
        }
        break;
      }
      case "payment.failed": {
        const rpOrderId = str(payment.order_id);
        const order = rpOrderId
          ? await findOrderByRazorpayOrderId(rpOrderId)
          : null;
        if (order) await markOrderPaymentFailed(order, str(payment.id));
        break;
      }
      case "refund.created":
      case "refund.processed": {
        const paymentId = str(refund.payment_id);
        const order = paymentId
          ? await findOrderByPaymentId(paymentId)
          : null;
        if (order) {
          await markOrderRefunded(order, {
            refundId: str(refund.id) ?? "",
            amount: num(refund.amount) / 100,
          });
        }
        break;
      }
      case "subscription.activated":
      case "subscription.charged":
      case "subscription.cancelled": {
        // Subscriptions are matched by the razorpay order id in notes when set.
        await logActivity({
          userName: "Razorpay",
          action: "status_change",
          module: "orders",
          entityName: type,
          details: { subscription: asRecord(event.payload?.subscription?.entity) },
        });
        break;
      }
      default:
        // Acknowledge unhandled events so Razorpay stops retrying them.
        break;
    }
  } catch (err) {
    console.error("[razorpay-webhook] handler error:", err);
    // Still 200 so Razorpay doesn't hammer us; we've logged for follow-up.
  }

  return { status: 200, body: { received: true, event: type } };
}
