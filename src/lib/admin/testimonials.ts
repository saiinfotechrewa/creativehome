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
  testimonialSchema,
  testimonialUpdateSchema,
  testimonialListQuerySchema,
  testimonialStatusSchema_update,
  testimonialDisplaySchema,
  testimonialReorderSchema,
} from "@/lib/validators";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Testimonials.
 *
 * Keyed by id (no slug). Moderation flow: submissions land as PENDING, an
 * admin APPROVEs or REJECTs them, then toggles `isDisplayed` to control what
 * actually appears on the site. Displayed testimonials are ordered by
 * `displayOrder`, set via the reorder endpoint. Only APPROVED + displayed rows
 * are exposed publicly.
 * ─────────────────────────────────────────────────────────────────────────
 */

const PUBLIC_RATE = { limit: 60, windowMs: 60_000 };

type IdCtx = { params: Promise<{ id: string }> };

// ──────────────────────────────── Admin API ─────────────────────────────────

const list = withAuthHandler(async (req: Request) => {
  await requirePermission(PERMISSIONS.TESTIMONIALS_VIEW);
  const q = parseQuery(req, testimonialListQuerySchema);

  const where: Prisma.TestimonialWhereInput = {};
  if (q.status) where.status = q.status;
  if (q.isDisplayed !== undefined) where.isDisplayed = q.isDisplayed;
  if (q.search) {
    where.OR = [
      { name: { contains: q.search, mode: "insensitive" } },
      { company: { contains: q.search, mode: "insensitive" } },
      { quote: { contains: q.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.testimonial.findMany({
      where,
      orderBy: { [q.sort]: q.order },
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
    }),
    prisma.testimonial.count({ where }),
  ]);

  return paginated(items, pageMeta(q.page, q.pageSize, total));
});

const create = withAuthHandler(async (req: Request) => {
  const user = await requirePermission(PERMISSIONS.TESTIMONIALS_MANAGE);
  const data = await parseJson(req, testimonialSchema);

  const testimonial = await prisma.testimonial.create({ data });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "create",
    module: "testimonials",
    entityId: testimonial.id,
    entityName: testimonial.name,
    ipAddress: getClientIp(req),
  });

  return ok(testimonial, { status: 201 });
});

const getById = withAuthHandler(async (_req: Request, ctx: IdCtx) => {
  await requirePermission(PERMISSIONS.TESTIMONIALS_VIEW);
  const { id } = await ctx.params;

  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) return fail("Testimonial not found", 404);
  return ok(testimonial);
});

const update = withAuthHandler(async (req: Request, ctx: IdCtx) => {
  const user = await requirePermission(PERMISSIONS.TESTIMONIALS_MANAGE);
  const { id } = await ctx.params;

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) return fail("Testimonial not found", 404);

  const data = await parseJson(req, testimonialUpdateSchema);
  const testimonial = await prisma.testimonial.update({ where: { id }, data });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "testimonials",
    entityId: testimonial.id,
    entityName: testimonial.name,
    ipAddress: getClientIp(req),
  });

  return ok(testimonial);
});

const remove = withAuthHandler(async (req: Request, ctx: IdCtx) => {
  const user = await requirePermission(PERMISSIONS.TESTIMONIALS_MANAGE);
  const { id } = await ctx.params;

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) return fail("Testimonial not found", 404);

  await prisma.testimonial.delete({ where: { id } });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "delete",
    module: "testimonials",
    entityId: existing.id,
    entityName: existing.name,
    ipAddress: getClientIp(req),
  });

  return ok({ id: existing.id });
});

/** PUT /[id]/status — approve / reject / re-queue. */
const setStatus = withAuthHandler(async (req: Request, ctx: IdCtx) => {
  const user = await requirePermission(PERMISSIONS.TESTIMONIALS_MANAGE);
  const { id } = await ctx.params;

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) return fail("Testimonial not found", 404);

  const { status } = await parseJson(req, testimonialStatusSchema_update);

  // Rejecting a live testimonial also pulls it from the site.
  const data: Prisma.TestimonialUpdateInput = { status };
  if (status === "REJECTED") data.isDisplayed = false;

  const testimonial = await prisma.testimonial.update({ where: { id }, data });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: status === "APPROVED" ? "approve" : status === "REJECTED" ? "reject" : "status_change",
    module: "testimonials",
    entityId: testimonial.id,
    entityName: testimonial.name,
    details: { status },
    ipAddress: getClientIp(req),
  });

  return ok(testimonial);
});

/** PUT /[id]/display — show or hide on the public site. */
const setDisplay = withAuthHandler(async (req: Request, ctx: IdCtx) => {
  const user = await requirePermission(PERMISSIONS.TESTIMONIALS_MANAGE);
  const { id } = await ctx.params;

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) return fail("Testimonial not found", 404);

  const { isDisplayed } = await parseJson(req, testimonialDisplaySchema);
  if (isDisplayed && existing.status !== "APPROVED") {
    return fail("Only approved testimonials can be displayed", 409);
  }

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: { isDisplayed },
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "testimonials",
    entityId: testimonial.id,
    entityName: testimonial.name,
    details: { isDisplayed },
    ipAddress: getClientIp(req),
  });

  return ok(testimonial);
});

/** PUT /reorder — body { order: id[] }, index becomes the new displayOrder. */
const reorder = withAuthHandler(async (req: Request) => {
  const user = await requirePermission(PERMISSIONS.TESTIMONIALS_MANAGE);
  const { order } = await parseJson(req, testimonialReorderSchema);

  const found = await prisma.testimonial.findMany({
    where: { id: { in: order } },
    select: { id: true },
  });
  const known = new Set(found.map((r) => r.id));
  const missing = order.filter((id) => !known.has(id));
  if (missing.length > 0) {
    return fail("Some testimonials do not exist", 400, { missing });
  }

  await prisma.$transaction(
    order.map((id, index) =>
      prisma.testimonial.update({
        where: { id },
        data: { displayOrder: index },
      }),
    ),
  );

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "testimonials",
    entityName: "Testimonial order",
    details: { order },
    ipAddress: getClientIp(req),
  });

  const items = await prisma.testimonial.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return ok(items);
});

export const testimonialsAdminApi = {
  list,
  create,
  getById,
  update,
  remove,
  setStatus,
  setDisplay,
  reorder,
};

// ──────────────────────────────── Public API ────────────────────────────────

const listPublic = withAuthHandler(async (req: Request) => {
  const limit = rateLimit(
    `public:testimonials:${getClientIp(req)}`,
    PUBLIC_RATE.limit,
    PUBLIC_RATE.windowMs,
  );
  if (!limit.success) return fail("Too many requests", 429);

  const testimonials = await prisma.testimonial.findMany({
    where: { status: "APPROVED", isDisplayed: true },
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      quote: true,
      name: true,
      role: true,
      company: true,
      industry: true,
      rating: true,
      avatar: true,
    },
  });
  return ok(testimonials);
});

export const testimonialsPublicApi = { list: listPublic };
