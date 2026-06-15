import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  withAuthHandler,
  getClientIp,
} from "@/lib/auth-helpers";
import { PERMISSIONS } from "@/lib/permissions";
import { logActivity } from "@/lib/activity-logger";
import { ok, fail, parseJson } from "@/lib/api-response";
import { homepageSectionUpdateSchema } from "@/lib/validators";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ section: string }> };

/** GET /api/admin/content/homepage/[section] — read one section by its key. */
export const GET = withAuthHandler(
  async (_req: Request, ctx: RouteContext) => {
    await requirePermission(PERMISSIONS.HOMEPAGE_MANAGE);

    const { section } = await ctx.params;
    const found = await prisma.homepageSection.findUnique({
      where: { sectionKey: section },
    });
    if (!found) return fail("Section not found", 404);

    return ok(found);
  },
);

/**
 * PUT /api/admin/content/homepage/[section] — create or update a section.
 * Upserts by sectionKey so new sections can be authored without a separate POST.
 */
export const PUT = withAuthHandler(async (req: Request, ctx: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.HOMEPAGE_MANAGE);

  const { section } = await ctx.params;
  const data = await parseJson(req, homepageSectionUpdateSchema);

  const update: Prisma.HomepageSectionUpdateInput = {};
  if (data.isActive !== undefined) update.isActive = data.isActive;
  if (data.order !== undefined) update.order = data.order;
  if (data.content !== undefined)
    update.content = data.content as Prisma.InputJsonValue;

  const saved = await prisma.homepageSection.upsert({
    where: { sectionKey: section },
    update,
    create: {
      sectionKey: section,
      isActive: data.isActive ?? true,
      order: data.order ?? 0,
      content: (data.content ?? {}) as Prisma.InputJsonValue,
    },
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "homepage",
    entityId: saved.id,
    entityName: saved.sectionKey,
    ipAddress: getClientIp(req),
  });

  return ok(saved);
});
