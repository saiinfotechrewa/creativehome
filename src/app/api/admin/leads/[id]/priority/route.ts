import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  withAuthHandler,
  getClientIp,
} from "@/lib/auth-helpers";
import { PERMISSIONS } from "@/lib/permissions";
import { logActivity } from "@/lib/activity-logger";
import { ok, fail, parseJson } from "@/lib/api-response";
import { leadPriorityUpdateSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

/** PUT /api/admin/leads/[id]/priority — change a lead's queue priority. */
export const PUT = withAuthHandler(async (req: Request, ctx: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.LEADS_MANAGE);
  const { id } = await ctx.params;

  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) return fail("Lead not found", 404);

  const { priority } = await parseJson(req, leadPriorityUpdateSchema);
  if (priority === existing.priority) return ok(existing);

  const lead = await prisma.lead.update({ where: { id }, data: { priority } });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "leads",
    entityId: lead.id,
    entityName: lead.name,
    details: { from: existing.priority, to: priority },
    ipAddress: getClientIp(req),
  });

  return ok(lead);
});
