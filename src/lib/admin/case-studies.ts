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
  caseStudySchema,
  caseStudyUpdateSchema,
  caseStudyListQuerySchema,
  paginationSchema,
} from "@/lib/validators";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Case studies.
 *
 * Slug-keyed, status-gated (ACTIVE | DRAFT | ARCHIVED). `challenge` and
 * `solution` are long-form rich-text (HTML / MDX) columns. Delete is soft —
 * status → ARCHIVED — so product/case references by slug never break.
 *
 * There is no dedicated `caseStudies:view` permission, so both read and write
 * are gated on `caseStudies:manage`.
 * ─────────────────────────────────────────────────────────────────────────
 */

const PUBLIC_RATE = { limit: 60, windowMs: 60_000 };
const updateSchema = caseStudyUpdateSchema;

type SlugCtx = { params: Promise<{ slug: string }> };

// ──────────────────────────────── Admin API ─────────────────────────────────

const list = withAuthHandler(async (req: Request) => {
  await requirePermission(PERMISSIONS.CASE_STUDIES_MANAGE);
  const q = parseQuery(req, caseStudyListQuerySchema);

  const where: Prisma.CaseStudyWhereInput = {};
  if (q.status) {
    where.status = q.status;
  } else if (!q.includeArchived) {
    where.status = { not: "ARCHIVED" };
  }
  if (q.search) {
    where.OR = [
      { title: { contains: q.search, mode: "insensitive" } },
      { slug: { contains: q.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.caseStudy.findMany({
      where,
      orderBy: { [q.sort]: q.order },
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
    }),
    prisma.caseStudy.count({ where }),
  ]);

  return paginated(items, pageMeta(q.page, q.pageSize, total));
});

const create = withAuthHandler(async (req: Request) => {
  const user = await requirePermission(PERMISSIONS.CASE_STUDIES_MANAGE);
  const data = await parseJson(req, caseStudySchema);

  if (await prisma.caseStudy.findUnique({ where: { slug: data.slug } })) {
    return fail("A case study with this slug already exists", 409);
  }

  const caseStudy = await prisma.caseStudy.create({
    data: data as unknown as Prisma.CaseStudyUncheckedCreateInput,
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "create",
    module: "caseStudies",
    entityId: caseStudy.id,
    entityName: caseStudy.title,
    ipAddress: getClientIp(req),
  });

  return ok(caseStudy, { status: 201 });
});

const getBySlug = withAuthHandler(async (_req: Request, ctx: SlugCtx) => {
  await requirePermission(PERMISSIONS.CASE_STUDIES_MANAGE);
  const { slug } = await ctx.params;

  const caseStudy = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!caseStudy) return fail("Case study not found", 404);
  return ok(caseStudy);
});

const update = withAuthHandler(async (req: Request, ctx: SlugCtx) => {
  const user = await requirePermission(PERMISSIONS.CASE_STUDIES_MANAGE);
  const { slug } = await ctx.params;

  const existing = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!existing) return fail("Case study not found", 404);

  const data = await parseJson(req, updateSchema);
  if (data.slug && data.slug !== slug) {
    if (await prisma.caseStudy.findUnique({ where: { slug: data.slug } })) {
      return fail("A case study with this slug already exists", 409);
    }
  }

  const caseStudy = await prisma.caseStudy.update({
    where: { slug },
    data: data as unknown as Prisma.CaseStudyUncheckedUpdateInput,
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "caseStudies",
    entityId: caseStudy.id,
    entityName: caseStudy.title,
    ipAddress: getClientIp(req),
  });

  return ok(caseStudy);
});

const remove = withAuthHandler(async (req: Request, ctx: SlugCtx) => {
  const user = await requirePermission(PERMISSIONS.CASE_STUDIES_MANAGE);
  const { slug } = await ctx.params;

  const existing = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!existing || existing.status === "ARCHIVED") {
    return fail("Case study not found", 404);
  }

  const caseStudy = await prisma.caseStudy.update({
    where: { slug },
    data: { status: "ARCHIVED" },
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "delete",
    module: "caseStudies",
    entityId: caseStudy.id,
    entityName: caseStudy.title,
    details: { softDelete: true },
    ipAddress: getClientIp(req),
  });

  return ok({ id: caseStudy.id, slug: caseStudy.slug, status: caseStudy.status });
});

export const caseStudiesAdminApi = {
  list,
  create,
  getBySlug,
  update,
  remove,
};

// ──────────────────────────────── Public API ────────────────────────────────

async function publicGuard(req: Request): Promise<Response | null> {
  const limit = await rateLimit(
    `public:case-studies:${getClientIp(req)}`,
    PUBLIC_RATE.limit,
    PUBLIC_RATE.windowMs,
  );
  return limit.success ? null : fail("Too many requests", 429);
}

const listPublic = withAuthHandler(async (req: Request) => {
  const blocked = await publicGuard(req);
  if (blocked) return blocked;

  const q = parseQuery(req, paginationSchema);

  const where: Prisma.CaseStudyWhereInput = { status: "ACTIVE" };
  if (q.search) {
    where.OR = [{ title: { contains: q.search, mode: "insensitive" } }];
  }

  const [items, total] = await Promise.all([
    prisma.caseStudy.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (q.page - 1) * q.pageSize,
      take: q.pageSize,
      select: {
        id: true,
        slug: true,
        title: true,
        client: true,
        results: true,
        featuredImage: true,
      },
    }),
    prisma.caseStudy.count({ where }),
  ]);

  return paginated(items, pageMeta(q.page, q.pageSize, total));
});

const getPublicBySlug = withAuthHandler(async (req: Request, ctx: SlugCtx) => {
  const blocked = await publicGuard(req);
  if (blocked) return blocked;

  const { slug } = await ctx.params;
  const caseStudy = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!caseStudy || caseStudy.status !== "ACTIVE") {
    return fail("Not found", 404);
  }
  return ok(caseStudy);
});

export const caseStudiesPublicApi = {
  list: listPublic,
  getBySlug: getPublicBySlug,
};
