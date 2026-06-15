import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  withAuthHandler,
  getClientIp,
} from "@/lib/auth-helpers";
import { PERMISSIONS } from "@/lib/permissions";
import { logActivity } from "@/lib/activity-logger";
import { ok, fail, parseJson } from "@/lib/api-response";
import { homepageReorderSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

/**
 * PUT /api/admin/content/homepage/reorder
 * Body: { order: string[] } — section keys in their new display order.
 * The array index becomes each section's `order` value.
 */
export const PUT = withAuthHandler(async (req: Request) => {
  const user = await requirePermission(PERMISSIONS.HOMEPAGE_MANAGE);
  const { order } = await parseJson(req, homepageReorderSchema);

  // Reject unknown keys up front so we don't silently no-op part of the list.
  const existing = await prisma.homepageSection.findMany({
    where: { sectionKey: { in: order } },
    select: { sectionKey: true },
  });
  const known = new Set(existing.map((s) => s.sectionKey));
  const missing = order.filter((key) => !known.has(key));
  if (missing.length > 0) {
    return fail("Some sections do not exist", 400, { missing });
  }

  // Persist all positions atomically.
  await prisma.$transaction(
    order.map((sectionKey, index) =>
      prisma.homepageSection.update({
        where: { sectionKey },
        data: { order: index },
      }),
    ),
  );

  const sections = await prisma.homepageSection.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "homepage",
    entityName: "Section order",
    details: { order },
    ipAddress: getClientIp(req),
  });

  return ok(sections);
});
