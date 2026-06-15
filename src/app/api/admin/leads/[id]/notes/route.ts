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
import { leadNoteSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/leads/[id]/notes — append a note to the lead timeline.
 * Notes are stored newest-last in the `notes` JSON array.
 */
export const POST = withAuthHandler(async (req: Request, ctx: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.LEADS_MANAGE);
  const { id } = await ctx.params;

  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) return fail("Lead not found", 404);

  const { text } = await parseJson(req, leadNoteSchema);

  const note = {
    id: crypto.randomUUID(),
    by: user.id,
    byName: user.name ?? null,
    at: new Date().toISOString(),
    text,
  };

  const current = Array.isArray(existing.notes) ? existing.notes : [];
  const notes = [...(current as Prisma.JsonArray), note];

  const lead = await prisma.lead.update({
    where: { id },
    data: { notes: notes as unknown as Prisma.InputJsonValue },
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "create",
    module: "leads",
    entityId: lead.id,
    entityName: lead.name,
    details: { note: "added" },
    ipAddress: getClientIp(req),
  });

  return ok({ note, notes });
});
