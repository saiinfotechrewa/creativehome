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
import { leadCommunicationSchema } from "@/lib/validators";
import { sendEmail, sendWhatsApp } from "@/lib/notifications";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/leads/[id]/communications — send an outbound WhatsApp or
 * email to the lead and append the record to the lead's `communications`
 * timeline. The send is best-effort; the timeline entry records whether the
 * channel actually delivered.
 */
export const POST = withAuthHandler(async (req: Request, ctx: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.LEADS_MANAGE);
  const { id } = await ctx.params;

  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) return fail("Lead not found", 404);

  const { channel, subject, message } = await parseJson(
    req,
    leadCommunicationSchema,
  );

  let sent = false;
  if (channel === "email") {
    if (!existing.email) return fail("Lead has no email address", 422);
    sent = await sendEmail({
      to: existing.email,
      subject: subject || "A message from CreativeDox",
      html: `<div style="font-family:system-ui,Arial,sans-serif;white-space:pre-wrap">${message}</div>`,
    });
  } else {
    const to = existing.whatsapp ?? existing.phone;
    if (!to) return fail("Lead has no WhatsApp/phone number", 422);
    sent = await sendWhatsApp(to, message);
  }

  const entry = {
    id: crypto.randomUUID(),
    channel,
    subject: subject ?? null,
    summary: message.slice(0, 500),
    by: user.id,
    byName: user.name ?? null,
    at: new Date().toISOString(),
    status: sent ? "sent" : "not_delivered",
  };

  const current = Array.isArray(existing.communications)
    ? existing.communications
    : [];
  const communications = [...(current as Prisma.JsonArray), entry];

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      communications: communications as unknown as Prisma.InputJsonValue,
      status: existing.status === "NEW" ? "CONTACTED" : existing.status,
    },
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "leads",
    entityId: lead.id,
    entityName: lead.name,
    details: { communication: channel, delivered: sent },
    ipAddress: getClientIp(req),
  });

  return ok(
    { entry, communications, delivered: sent },
    { status: sent ? 201 : 202 },
  );
});
