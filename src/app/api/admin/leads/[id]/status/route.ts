import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  withAuthHandler,
  getClientIp,
} from "@/lib/auth-helpers";
import { PERMISSIONS } from "@/lib/permissions";
import { logActivity } from "@/lib/activity-logger";
import { ok, fail, parseJson } from "@/lib/api-response";
import { leadStatusUpdateSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PUT /api/admin/leads/[id]/status — move a lead along the pipeline.
 * Records the transition in the activity log; an optional note is appended to
 * the lead's notes timeline.
 */
export const PUT = withAuthHandler(async (req: Request, ctx: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.LEADS_MANAGE);
  const { id } = await ctx.params;

  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) return fail("Lead not found", 404);

  const { status, note } = await parseJson(req, leadStatusUpdateSchema);

  if (status === existing.status) {
    return ok(existing); // no-op, keep the timeline clean
  }

  const data: Prisma.LeadUpdateInput = { status };

  if (note) {
    const current = Array.isArray(existing.notes) ? existing.notes : [];
    data.notes = [
      ...(current as Prisma.JsonArray),
      {
        id: crypto.randomUUID(),
        by: user.id,
        byName: user.name ?? null,
        at: new Date().toISOString(),
        text: note,
      },
    ] as unknown as Prisma.InputJsonValue;
  }

  const lead = await prisma.lead.update({ where: { id }, data });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "status_change",
    module: "leads",
    entityId: lead.id,
    entityName: lead.name,
    details: { from: existing.status, to: status },
    ipAddress: getClientIp(req),
  });

  return ok(lead);
});
