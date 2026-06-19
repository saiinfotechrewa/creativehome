import { getTwilioCreds, type TwilioCreds } from "@/lib/integrations";

/**
 * WhatsApp transport over the Twilio REST API.
 *
 * Twilio is reached with plain `fetch` + Basic auth (no SDK dependency, matching
 * the rest of the codebase). Every function is best-effort: a missing/invalid
 * configuration returns `{ success: false, … }` instead of throwing, so callers
 * (notifications, lead replies) can degrade gracefully.
 *
 * Numbers are normalised to E.164 and prefixed with `whatsapp:` as Twilio
 * requires for the WhatsApp channel.
 */

const TWILIO_BASE = "https://api.twilio.com/2010-04-01";

export interface SendResult {
  success: boolean;
  /** Twilio message SID when accepted. */
  sid?: string;
  error?: string;
}

export interface BulkSendResult {
  total: number;
  sent: number;
  failed: number;
  results: Array<{ to: string } & SendResult>;
}

/** `+91 98765-43210` → `whatsapp:+919876543210`. Returns null if unusable. */
function toWhatsappAddress(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.startsWith("whatsapp:")) return trimmed;
  const digits = trimmed.replace(/[^\d+]/g, "");
  const e164 = digits.startsWith("+") ? digits : `+${digits}`;
  // E.164 is 8–15 digits after the +.
  if (!/^\+\d{8,15}$/.test(e164)) return null;
  return `whatsapp:${e164}`;
}

function senderAddress(creds: TwilioCreds): string {
  return creds.fromNumber.startsWith("whatsapp:")
    ? creds.fromNumber
    : `whatsapp:${creds.fromNumber}`;
}

function authHeader(creds: TwilioCreds): string {
  const token = Buffer.from(
    `${creds.accountSid}:${creds.authToken}`,
  ).toString("base64");
  return `Basic ${token}`;
}

/** POST a form-encoded message to Twilio's Messages resource. */
async function postMessage(
  creds: TwilioCreds,
  params: Record<string, string>,
): Promise<SendResult> {
  try {
    const body = new URLSearchParams(params);
    const res = await fetch(
      `${TWILIO_BASE}/Accounts/${creds.accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader(creds),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      },
    );
    const json = (await res.json().catch(() => ({}))) as {
      sid?: string;
      message?: string;
    };
    if (!res.ok) {
      const error = json.message ?? `Twilio responded ${res.status}`;
      console.error("[whatsapp.service] send failed:", error);
      return { success: false, error };
    }
    return { success: true, sid: json.sid };
  } catch (err) {
    console.error("[whatsapp.service] send threw:", err);
    return { success: false, error: "Network error contacting Twilio" };
  }
}

/** Attach either the Messaging Service SID or the From number to the payload. */
function withSender(
  creds: TwilioCreds,
  to: string,
  rest: Record<string, string>,
): Record<string, string> {
  const base: Record<string, string> = { To: to, ...rest };
  if (creds.messagingServiceSid) {
    base.MessagingServiceSid = creds.messagingServiceSid;
  } else {
    base.From = senderAddress(creds);
  }
  return base;
}

/** Send a free-form WhatsApp text message (only valid inside the 24h window). */
export async function sendMessage(
  to: string,
  body: string,
): Promise<SendResult> {
  const creds = await getTwilioCreds();
  if (!creds) {
    return { success: false, error: "WhatsApp (Twilio) is not configured" };
  }
  const address = toWhatsappAddress(to);
  if (!address) return { success: false, error: "Invalid recipient number" };

  return postMessage(creds, withSender(creds, address, { Body: body }));
}

/**
 * Send a pre-approved WhatsApp template via the Twilio Content API.
 *
 * @param contentSid  Twilio Content template SID (HX…).
 * @param variables   Positional variables, e.g. `{ "1": "Asha", "2": "CD-2026-0001" }`.
 */
export async function sendTemplate(
  to: string,
  contentSid: string,
  variables: Record<string, string> = {},
): Promise<SendResult> {
  const creds = await getTwilioCreds();
  if (!creds) {
    return { success: false, error: "WhatsApp (Twilio) is not configured" };
  }
  const address = toWhatsappAddress(to);
  if (!address) return { success: false, error: "Invalid recipient number" };

  const params: Record<string, string> = { ContentSid: contentSid };
  if (Object.keys(variables).length > 0) {
    params.ContentVariables = JSON.stringify(variables);
  }
  return postMessage(creds, withSender(creds, address, params));
}

/**
 * Fan out a single message to many recipients. Sends are sequential (Twilio
 * rate-limits aggressively) and never reject — each recipient gets its own
 * result entry so partial failures are visible to the caller.
 */
export async function sendBulk(
  recipients: string[],
  body: string,
): Promise<BulkSendResult> {
  const unique = [...new Set(recipients.map((r) => r.trim()).filter(Boolean))];
  const results: Array<{ to: string } & SendResult> = [];

  for (const to of unique) {
    const result = await sendMessage(to, body);
    results.push({ to, ...result });
  }

  const sent = results.filter((r) => r.success).length;
  return {
    total: unique.length,
    sent,
    failed: unique.length - sent,
    results,
  };
}

export const whatsappService = { sendMessage, sendTemplate, sendBulk };
