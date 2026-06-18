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
import { leadUpdateSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

/** GET /api/admin/leads/[id] — full lead + assignee + recent activity timeline. */
export const GET = withAuthHandler(async (_req: Request, ctx: RouteContext) => {
  await requirePermission(PERMISSIONS.LEADS_VIEW);
  const { id } = await ctx.params;

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return fail("Lead not found", 404);

  const [assignee, activities] = await Promise.all([
    lead.assignedTo
      ? prisma.adminUser.findUnique({
          where: { id: lead.assignedTo },
          select: { id: true, name: true, email: true },
        })
      : Promise.resolve(null),
    prisma.activityLog.findMany({
      where: { module: "leads", entityId: id },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return ok({
    ...lead,
    assignedToName: assignee?.name ?? null,
    assignee,
    activities,
  });
});

/** PUT /api/admin/leads/[id] — update core lead fields (partial). */
export const PUT = withAuthHandler(async (req: Request, ctx: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.LEADS_MANAGE);
  const { id } = await ctx.params;

  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) return fail("Lead not found", 404);

  const data = await parseJson(req, leadUpdateSchema);

  // Cast JSON-typed columns for Prisma; only set keys that were provided.
  const update: Prisma.LeadUpdateInput = {};
  if (data.source !== undefined) update.source = data.source;
  if (data.status !== undefined) update.status = data.status;
  if (data.priority !== undefined) update.priority = data.priority;
  if (data.name !== undefined) update.name = data.name;
  if (data.email !== undefined) update.email = data.email || null;
  if (data.phone !== undefined) update.phone = data.phone || null;
  if (data.whatsapp !== undefined) update.whatsapp = data.whatsapp || null;
  if (data.businessName !== undefined)
    update.businessName = data.businessName || null;
  if (data.businessType !== undefined)
    update.businessType = data.businessType || null;
  if (data.teamSize !== undefined) update.teamSize = data.teamSize || null;
  if (data.description !== undefined)
    update.description = data.description || null;
  if (data.interestedProducts !== undefined)
    update.interestedProducts =
      data.interestedProducts as unknown as Prisma.InputJsonValue;
  if (data.consultation !== undefined)
    update.consultation = data.consultation as Prisma.InputJsonValue;
  if (data.utm !== undefined) update.utm = data.utm as Prisma.InputJsonValue;

  const lead = await prisma.lead.update({ where: { id }, data: update });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "leads",
    entityId: lead.id,
    entityName: lead.name,
    ipAddress: getClientIp(req),
  });

  return ok(lead);
});

/**
 * DELETE /api/admin/leads/[id] — permanently remove a lead. Any linked customer
 * is preserved (the FK is `onDelete: SetNull`), so conversions aren't lost.
 */
export const DELETE = withAuthHandler(
  async (req: Request, ctx: RouteContext) => {
    const user = await requirePermission(PERMISSIONS.LEADS_MANAGE);
    const { id } = await ctx.params;

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) return fail("Lead not found", 404);

    await prisma.lead.delete({ where: { id } });

    await logActivity({
      userId: user.id,
      userName: user.name,
      action: "delete",
      module: "leads",
      entityId: id,
      entityName: existing.name,
      ipAddress: getClientIp(req),
    });

    return ok({ id });
  },
);
