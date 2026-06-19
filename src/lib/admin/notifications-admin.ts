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
import {
  NOTIFICATION_EVENTS,
  notificationEventSchema,
  notificationUpdateSchema,
} from "@/lib/validators";

/**
 * Notification settings: which channels (email / WhatsApp / SMS) fire for each
 * system event, and who receives them. Backed by the existing
 * `NotificationSetting` table (event-keyed, `channels` is a free-form JSON blob).
 *
 * Gated on `integrations:manage` since it lives inside the Integration Hub.
 */

type EventCtx = { params: Promise<{ event: string }> };

function defaultChannels() {
  return {
    email: { enabled: false, recipients: [] as string[] },
    whatsapp: { enabled: false, numbers: [] as string[] },
    sms: { enabled: false, numbers: [] as string[] },
  };
}

const list = withAuthHandler(async () => {
  await requirePermission(PERMISSIONS.INTEGRATIONS_MANAGE);

  const rows = await prisma.notificationSetting.findMany();
  const byEvent = new Map(rows.map((r) => [r.event, r]));

  const items = NOTIFICATION_EVENTS.map((event) => {
    const row = byEvent.get(event);
    return {
      event,
      channels:
        (row?.channels as Record<string, unknown>) ?? defaultChannels(),
      updatedAt: row?.updatedAt ?? null,
    };
  });

  return ok(items);
});

const update = withAuthHandler(async (req: Request, ctx: EventCtx) => {
  const user = await requirePermission(PERMISSIONS.INTEGRATIONS_MANAGE);
  const { event } = await ctx.params;
  if (!notificationEventSchema.safeParse(event).success) {
    return fail("Unknown notification event", 404);
  }

  const { channels } = await parseJson(req, notificationUpdateSchema);

  const row = await prisma.notificationSetting.upsert({
    where: { event },
    create: { event, channels: channels as Prisma.InputJsonValue },
    update: { channels: channels as Prisma.InputJsonValue },
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "notifications",
    entityId: row.id,
    entityName: event,
    details: {
      email: channels.email.enabled,
      whatsapp: channels.whatsapp.enabled,
      sms: channels.sms.enabled,
    },
    ipAddress: getClientIp(req),
  });

  return ok({ event, channels: row.channels, updatedAt: row.updatedAt });
});

export const notificationsAdminApi = { list, update };
