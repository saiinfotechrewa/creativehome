import { prisma } from "@/lib/prisma";
import { requirePermission, withAuthHandler } from "@/lib/auth-helpers";
import { PERMISSIONS } from "@/lib/permissions";
import { ok } from "@/lib/api-response";

export const dynamic = "force-dynamic";

/** GET /api/admin/content/homepage — all homepage sections, in display order. */
export const GET = withAuthHandler(async () => {
  await requirePermission(PERMISSIONS.HOMEPAGE_MANAGE);

  const sections = await prisma.homepageSection.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return ok(sections);
});
