import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { sendEmail } from "@/lib/services/email.service";
import { sendMessage as sendWhatsapp } from "@/lib/services/whatsapp.service";

/**
 * Central notification dispatcher.
 *
 * Given an `event` (e.g. `new_lead`, `payment_success`), it looks up the
 * `NotificationSetting` row to decide which channels are enabled, resolves the
 * recipients, sends through the per-channel services (email / WhatsApp), records
 * an in-app entry when enabled, and logs every attempt to the activity log.
 *
 * Best-effort by design: a delivery failure is recorded but never thrown, so a
 * notification problem can't break the action that triggered it.
 */

interface ChannelConfig {
  email: boolean;
  whatsapp: boolean;
  inApp: boolean;
  recipients: string[];
}

export interface DispatchInput {
  /** NotificationSetting.event key. */
  event: string;
  /** Email payload — omit to skip the email channel for this dispatch. */
  email?: { subject: string; html: string; text?: string };
  /** WhatsApp payload — omit to skip the WhatsApp channel. */
  whatsapp?: { body: string };
  /** Explicit recipients (override the per-event defaults). */
  recipients?: { email?: string[]; whatsapp?: string[] };
  /** Entity the notification is about (for the activity log). */
  entity?: { id?: string; name?: string };
}

export interface ChannelOutcome {
  channel: "email" | "whatsapp" | "inApp";
  enabled: boolean;
  attempted: boolean;
  delivered: boolean;
  recipients: number;
  error?: string;
}

export interface DispatchResult {
  event: string;
  outcomes: ChannelOutcome[];
}

// ─────────────────────────── Settings resolution ─────────────────────────────

/** Per-event channel config with sensible defaults when the row is absent. */
async function getChannels(event: string): Promise<ChannelConfig> {
  const row = await prisma.notificationSetting
    .findUnique({ where: { event } })
    .catch(() => null);
  const ch = (row?.channels ?? {}) as Record<string, unknown>;
  return {
    email: ch.email !== false,
    whatsapp: ch.whatsapp === true,
    inApp: ch.inApp !== false,
    recipients: Array.isArray(ch.recipients)
      ? (ch.recipients as unknown[]).filter(
          (r): r is string => typeof r === "string",
        )
      : [],
  };
}

/** Email recipients: explicit → per-event setting → company → active admins. */
async function resolveEmailRecipients(
  explicit: string[] | undefined,
  fromSetting: string[],
): Promise<string[]> {
  if (explicit?.length) return explicit;
  if (fromSetting.length) return fromSetting;

  const company = await prisma.companySettings
    .findUnique({ where: { id: "singleton" }, select: { email: true } })
    .catch(() => null);
  if (company?.email) return [company.email];

  const admins = await prisma.adminUser.findMany({
    where: { isActive: true },
    select: { email: true },
  });
  return admins.map((a) => a.email);
}

/** WhatsApp recipients: explicit → the company's own WhatsApp number. */
async function resolveWhatsappRecipients(
  explicit: string[] | undefined,
): Promise<string[]> {
  if (explicit?.length) return explicit;
  const company = await prisma.companySettings
    .findUnique({ where: { id: "singleton" }, select: { whatsapp: true } })
    .catch(() => null);
  return company?.whatsapp ? [company.whatsapp] : [];
}

// ───────────────────────────────── Dispatch ──────────────────────────────────

export async function dispatchNotification(
  input: DispatchInput,
): Promise<DispatchResult> {
  const channels = await getChannels(input.event);
  const outcomes: ChannelOutcome[] = [];

  // ── Email ──
  {
    const enabled = channels.email && !!input.email;
    let delivered = false;
    let recipients: string[] = [];
    let error: string | undefined;
    if (enabled && input.email) {
      recipients = await resolveEmailRecipients(
        input.recipients?.email,
        channels.recipients,
      );
      if (recipients.length) {
        const result = await sendEmail({
          to: recipients,
          subject: input.email.subject,
          html: input.email.html,
          text: input.email.text,
        });
        delivered = result.success;
        error = result.error;
      } else {
        error = "No email recipients resolved";
      }
    }
    outcomes.push({
      channel: "email",
      enabled: channels.email,
      attempted: enabled && recipients.length > 0,
      delivered,
      recipients: recipients.length,
      error,
    });
  }

  // ── WhatsApp ──
  {
    const enabled = channels.whatsapp && !!input.whatsapp;
    let deliveredCount = 0;
    let recipients: string[] = [];
    let error: string | undefined;
    if (enabled && input.whatsapp) {
      recipients = await resolveWhatsappRecipients(input.recipients?.whatsapp);
      for (const to of recipients) {
        const result = await sendWhatsapp(to, input.whatsapp.body);
        if (result.success) deliveredCount += 1;
        else error = result.error;
      }
      if (!recipients.length) error = "No WhatsApp recipients resolved";
    }
    outcomes.push({
      channel: "whatsapp",
      enabled: channels.whatsapp,
      attempted: enabled && recipients.length > 0,
      delivered: deliveredCount > 0,
      recipients: recipients.length,
      error,
    });
  }

  // ── In-app (recorded as an activity entry) ──
  outcomes.push({
    channel: "inApp",
    enabled: channels.inApp,
    attempted: channels.inApp,
    delivered: channels.inApp,
    recipients: channels.inApp ? 1 : 0,
  });

  // Log the whole dispatch (one audit row, with per-channel detail).
  await logActivity({
    userName: "System",
    action: "notify",
    module: "notifications",
    entityId: input.entity?.id ?? null,
    entityName: input.entity?.name ?? input.event,
    details: {
      event: input.event,
      outcomes: outcomes.map((o) => ({
        channel: o.channel,
        delivered: o.delivered,
        recipients: o.recipients,
        ...(o.error ? { error: o.error } : {}),
      })),
    },
  });

  return { event: input.event, outcomes };
}

export const notificationService = { dispatch: dispatchNotification };
