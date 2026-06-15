import type { ContentStatus, Prisma } from "@prisma/client";
import type { AnyZodObject } from "zod";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  withAuthHandler,
  getClientIp,
} from "@/lib/auth-helpers";
import type { Permission } from "@/lib/permissions";
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
  catalogListQuerySchema,
  reorderSchema,
} from "@/lib/validators";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Generic catalog CRUD factory.
 *
 * Products, Services and Industries are structurally identical resources:
 * slug-keyed, `order`-sortable, `status`-gated (ACTIVE | DRAFT | ARCHIVED),
 * with JSON content blobs. Rather than hand-write three near-identical route
 * trees, this builds the handlers from a small config.
 *
 * Soft-delete = setting `status` to ARCHIVED. Records are never hard-deleted
 * through the API, so nothing referencing them by slug breaks.
 * ─────────────────────────────────────────────────────────────────────────
 */

/** Minimal shape every catalog record exposes (used for logging + responses). */
interface CatalogRecord {
  id: string;
  slug: string;
  name: string;
  status: ContentStatus;
}

/**
 * Structural subset of a Prisma model delegate that the factory uses. Concrete
 * delegates (`prisma.product`, …) are cast to this once per config — Prisma's
 * overloaded method signatures don't assign structurally otherwise.
 */
interface CatalogDelegate {
  findMany(args: {
    where?: unknown;
    orderBy?: unknown;
    skip?: number;
    take?: number;
    select?: unknown;
  }): Promise<CatalogRecord[]>;
  count(args: { where?: unknown }): Promise<number>;
  findUnique(args: {
    where: { slug: string };
    select?: unknown;
  }): Promise<CatalogRecord | null>;
  create(args: { data: unknown }): Promise<CatalogRecord>;
  update(args: {
    where: { slug: string };
    data: unknown;
  }): Promise<CatalogRecord>;
}

export interface CatalogConfig {
  /** Activity-log module name, e.g. "products". */
  module: string;
  /** Human label for log entries, e.g. "Product". */
  label: string;
  /** Prisma delegate, cast to {@link CatalogDelegate} by the caller. */
  delegate: CatalogDelegate;
  /** Full create/replace schema (slug required), e.g. `productSchema`. */
  schema: AnyZodObject;
  /** Permission required to read. */
  viewPermission: Permission;
  /** Permission required to mutate. */
  managePermission: Permission;
  /** Text columns searched by the `search` query param. */
  searchFields: string[];
  /** Optional Prisma `select` to trim the public list payload. */
  publicListSelect?: Record<string, boolean>;
}

const SINGLETON_RATE = { limit: 60, windowMs: 60_000 };

// ───────────────────────────── Admin handlers ───────────────────────────────

export function createCatalogAdminApi(config: CatalogConfig) {
  const updateSchema = config.schema.partial();

  /** GET — paginated, searchable, filterable list. */
  const list = withAuthHandler(async (req: Request) => {
    await requirePermission(config.viewPermission);
    const q = parseQuery(req, catalogListQuerySchema);

    const where: Record<string, unknown> = {};
    if (q.status) {
      where.status = q.status;
    } else if (!q.includeArchived) {
      // Hide soft-deleted records unless explicitly requested.
      where.status = { not: "ARCHIVED" };
    }
    if (q.search) {
      where.OR = config.searchFields.map((field) => ({
        [field]: { contains: q.search, mode: "insensitive" },
      }));
    }

    const [items, total] = await Promise.all([
      config.delegate.findMany({
        where,
        orderBy: { [q.sort]: q.order },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      config.delegate.count({ where }),
    ]);

    return paginated(items, pageMeta(q.page, q.pageSize, total));
  });

  /** POST — create a new record. */
  const create = withAuthHandler(async (req: Request) => {
    const user = await requirePermission(config.managePermission);
    const data = await parseJson(req, config.schema);

    const slug = String((data as { slug: string }).slug);
    const existing = await config.delegate.findUnique({ where: { slug } });
    if (existing) return fail(`A ${config.label} with this slug already exists`, 409);

    const record = await config.delegate.create({ data });

    await logActivity({
      userId: user.id,
      userName: user.name,
      action: "create",
      module: config.module,
      entityId: record.id,
      entityName: record.name,
      ipAddress: getClientIp(req),
    });

    return ok(record, { status: 201 });
  });

  /** PUT /reorder — body { order: slug[] }, index becomes the new `order`. */
  const reorder = withAuthHandler(async (req: Request) => {
    const user = await requirePermission(config.managePermission);
    const { order } = await parseJson(req, reorderSchema);

    const found = await config.delegate.findMany({
      where: { slug: { in: order } },
      select: { slug: true },
    });
    const known = new Set(found.map((r) => r.slug));
    const missing = order.filter((slug) => !known.has(slug));
    if (missing.length > 0) {
      return fail(`Some ${config.module} do not exist`, 400, { missing });
    }

    await prisma.$transaction(
      order.map((slug, index) =>
        config.delegate.update({ where: { slug }, data: { order: index } }),
      ) as unknown as Prisma.PrismaPromise<unknown>[],
    );

    await logActivity({
      userId: user.id,
      userName: user.name,
      action: "update",
      module: config.module,
      entityName: `${config.label} order`,
      details: { order },
      ipAddress: getClientIp(req),
    });

    const items = await config.delegate.findMany({
      orderBy: { order: "asc" },
    });
    return ok(items);
  });

  type SlugCtx = { params: Promise<{ slug: string }> };

  /** GET /[slug] — read a single record (any status, so archived is visible). */
  const getBySlug = withAuthHandler(async (_req: Request, ctx: SlugCtx) => {
    await requirePermission(config.viewPermission);
    const { slug } = await ctx.params;

    const record = await config.delegate.findUnique({ where: { slug } });
    if (!record) return fail(`${config.label} not found`, 404);
    return ok(record);
  });

  /** PUT /[slug] — update fields (partial). Handles slug renames. */
  const update = withAuthHandler(async (req: Request, ctx: SlugCtx) => {
    const user = await requirePermission(config.managePermission);
    const { slug } = await ctx.params;

    const existing = await config.delegate.findUnique({ where: { slug } });
    if (!existing) return fail(`${config.label} not found`, 404);

    const data = await parseJson(req, updateSchema);

    // If the slug is being changed, make sure the new one is free.
    const nextSlug = (data as { slug?: string }).slug;
    if (nextSlug && nextSlug !== slug) {
      const clash = await config.delegate.findUnique({ where: { slug: nextSlug } });
      if (clash) return fail(`A ${config.label} with this slug already exists`, 409);
    }

    const record = await config.delegate.update({ where: { slug }, data });

    await logActivity({
      userId: user.id,
      userName: user.name,
      action: "update",
      module: config.module,
      entityId: record.id,
      entityName: record.name,
      ipAddress: getClientIp(req),
    });

    return ok(record);
  });

  /** DELETE /[slug] — soft-delete (status → ARCHIVED). Already-archived = 404. */
  const remove = withAuthHandler(async (req: Request, ctx: SlugCtx) => {
    const user = await requirePermission(config.managePermission);
    const { slug } = await ctx.params;

    const existing = await config.delegate.findUnique({ where: { slug } });
    if (!existing || existing.status === "ARCHIVED") {
      return fail(`${config.label} not found`, 404);
    }

    const record = await config.delegate.update({
      where: { slug },
      data: { status: "ARCHIVED" },
    });

    await logActivity({
      userId: user.id,
      userName: user.name,
      action: "delete",
      module: config.module,
      entityId: record.id,
      entityName: record.name,
      details: { softDelete: true },
      ipAddress: getClientIp(req),
    });

    return ok({ id: record.id, slug: record.slug, status: record.status });
  });

  return { list, create, reorder, getBySlug, update, remove };
}

// ──────────────────────────── Public handlers ───────────────────────────────

export function createCatalogPublicApi(config: CatalogConfig) {
  /** GET — ACTIVE-only list, ordered, with search + pagination. */
  const list = withAuthHandler(async (req: Request) => {
    const limit = rateLimit(
      `public:${config.module}:${getClientIp(req)}`,
      SINGLETON_RATE.limit,
      SINGLETON_RATE.windowMs,
    );
    if (!limit.success) return fail("Too many requests", 429);

    const q = parseQuery(req, catalogListQuerySchema);

    const where: Record<string, unknown> = { status: "ACTIVE" };
    if (q.search) {
      where.OR = config.searchFields.map((field) => ({
        [field]: { contains: q.search, mode: "insensitive" },
      }));
    }

    const [items, total] = await Promise.all([
      config.delegate.findMany({
        where,
        orderBy: { order: "asc" },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        select: config.publicListSelect,
      }),
      config.delegate.count({ where }),
    ]);

    return paginated(items, pageMeta(q.page, q.pageSize, total));
  });

  type SlugCtx = { params: Promise<{ slug: string }> };

  /** GET /[slug] — a single ACTIVE record; anything else reads as 404. */
  const getBySlug = withAuthHandler(async (req: Request, ctx: SlugCtx) => {
    const limit = rateLimit(
      `public:${config.module}:${getClientIp(req)}`,
      SINGLETON_RATE.limit,
      SINGLETON_RATE.windowMs,
    );
    if (!limit.success) return fail("Too many requests", 429);

    const { slug } = await ctx.params;
    const record = await config.delegate.findUnique({ where: { slug } });
    if (!record || record.status !== "ACTIVE") {
      return fail("Not found", 404);
    }
    return ok(record);
  });

  return { list, getBySlug };
}
