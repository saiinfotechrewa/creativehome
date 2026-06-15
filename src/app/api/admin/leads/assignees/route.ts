import { prisma } from "@/lib/prisma";
import { requirePermission, withAuthHandler } from "@/lib/auth-helpers";
import { PERMISSIONS } from "@/lib/permissions";
import { ok } from "@/lib/api-response";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/leads/assignees — active admin users for the assignment
 * dropdown. Anyone who can view leads can see who they might be assigned to.
 */
export const GET = withAuthHandler(async () => {
  await requirePermission(PERMISSIONS.LEADS_VIEW);

  const users = await prisma.adminUser.findMany({
    where: { isActive: true },
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });

  return ok(users);
});
