import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  withAuthHandler,
  getClientIp,
} from "@/lib/auth-helpers";
import { PERMISSIONS } from "@/lib/permissions";
import { logActivity } from "@/lib/activity-logger";
import { ok, fail, parseJson } from "@/lib/api-response";
import { leadAssignSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PUT /api/admin/leads/[id]/assign — assign (or unassign with null) a lead.
 * Validates the target is an active admin user before saving.
 */
export const PUT = withAuthHandler(async (req: Request, ctx: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.LEADS_MANAGE);
  const { id } = await ctx.params;

  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) return fail("Lead not found", 404);

  const { assignedTo } = await parseJson(req, leadAssignSchema);

  let assigneeName: string | null = null;
  if (assignedTo) {
    const assignee = await prisma.adminUser.findFirst({
      where: { id: assignedTo, isActive: true },
      select: { id: true, name: true },
    });
    if (!assignee) return fail("Assignee is not a valid active user", 400);
    assigneeName = assignee.name;
  }

  const lead = await prisma.lead.update({
    where: { id },
    data: { assignedTo },
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "leads",
    entityId: lead.id,
    entityName: lead.name,
    details: assignedTo
      ? { assignedTo, assigneeName }
      : { assignedTo: null, unassigned: true },
    ipAddress: getClientIp(req),
  });

  return ok({ ...lead, assignedToName: assigneeName });
});
