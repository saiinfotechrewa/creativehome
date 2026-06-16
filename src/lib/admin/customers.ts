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
import {
  customerListQuerySchema,
  customerUpdateSchema,
} from "@/lib/validators";

/**
 * Customers: searchable list and a detail view that stitches together the
 * customer's orders and their communication history (sourced from the linked
 * lead's timeline plus the activity log).
 */

type IdCtx = { params: Promise<{ id: string }> };

const list = withAuthHandler(async (req: Request) => {
  await requirePermission(PERMISSIONS.CUSTOMERS_VIEW);
  const q = parseQuery(req, customerListQuerySchema);

  const where: Prisma.CustomerWhereInput = {};
  if (q.search) {
    where.OR = [
      { name: { contains: q.search, mode: "insensitive" } },
      { email: { contains: q.search, mode: "insensitive" } },
      { phone: { contains: q.search, mode: "insensitive" } },
      { businessName: { contains: q.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { [q.sort]: q.order },
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
      include: { _count: { select: { orders: true } } },
    }),
    prisma.customer.count({ where }),
  ]);

  return paginated(items, pageMeta(q.page, q.pageSize, total));
});

const getById = withAuthHandler(async (_req: Request, ctx: IdCtx) => {
  await requirePermission(PERMISSIONS.CUSTOMERS_VIEW);
  const { id } = await ctx.params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      orders: { orderBy: { createdAt: "desc" } },
      lead: { select: { id: true, communications: true, notes: true } },
    },
  });
  if (!customer) return fail("Customer not found", 404);

  // Communications come from the originating lead's timeline.
  const communications = Array.isArray(customer.lead?.communications)
    ? customer.lead!.communications
    : [];

  return ok({ ...customer, communications });
});

const update = withAuthHandler(async (req: Request, ctx: IdCtx) => {
  const user = await requirePermission(PERMISSIONS.CUSTOMERS_MANAGE);
  const { id } = await ctx.params;

  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing) return fail("Customer not found", 404);

  const data = await parseJson(req, customerUpdateSchema);

  // Guard the unique email if it's being changed.
  if (data.email && data.email !== existing.email) {
    const clash = await prisma.customer.findUnique({
      where: { email: data.email },
    });
    if (clash) return fail("Another customer already uses this email", 409);
  }

  const patch: Prisma.CustomerUpdateInput = {};
  if (data.name !== undefined) patch.name = data.name;
  if (data.email !== undefined) patch.email = data.email;
  if (data.phone !== undefined) patch.phone = data.phone || null;
  if (data.whatsapp !== undefined) patch.whatsapp = data.whatsapp || null;
  if (data.businessName !== undefined)
    patch.businessName = data.businessName || null;
  if (data.businessType !== undefined)
    patch.businessType = data.businessType || null;
  if (data.gstNumber !== undefined) patch.gstNumber = data.gstNumber || null;
  if (data.address !== undefined)
    patch.address = data.address as Prisma.InputJsonValue;

  const customer = await prisma.customer.update({ where: { id }, data: patch });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "customers",
    entityId: customer.id,
    entityName: customer.name,
    ipAddress: getClientIp(req),
  });

  return ok(customer);
});

export const customersAdminApi = { list, getById, update };
