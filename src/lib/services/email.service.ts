import nodemailer from "nodemailer";

import {
  getSendgridCreds,
  getEmailCreds,
  type SendgridCreds,
  type EmailCreds,
} from "@/lib/integrations";

/**
 * Email transport with a SendGrid-first, SMTP-fallback strategy.
 *
 * `sendEmail` and `sendTemplate` try the SendGrid v3 REST API (reached with
 * plain `fetch`, no SDK). When SendGrid isn't configured, `sendEmail` falls
 * back to SMTP via nodemailer using the existing `email` integration creds.
 * Dynamic templates are SendGrid-only.
 *
 * All functions are best-effort and return a result object instead of throwing.
 */

const SENDGRID_SEND_URL = "https://api.sendgrid.com/v3/mail/send";

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  /** Which transport delivered the message. */
  via?: "sendgrid" | "smtp";
  error?: string;
}

function recipients(to: string | string[]): string[] {
  return (Array.isArray(to) ? to : [to]).map((t) => t.trim()).filter(Boolean);
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ──────────────────────────────── SendGrid ───────────────────────────────────

async function sendViaSendgrid(
  creds: SendgridCreds,
  payload: Record<string, unknown>,
): Promise<EmailResult> {
  try {
    const res = await fetch(SENDGRID_SEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: { email: creds.fromEmail, name: creds.fromName },
        ...payload,
      }),
    });
    // SendGrid returns 202 Accepted with an empty body on success.
    if (res.status === 202) return { success: true, via: "sendgrid" };
    const detail = await res.text().catch(() => "");
    console.error("[email.service] SendGrid error:", res.status, detail);
    return { success: false, via: "sendgrid", error: `SendGrid ${res.status}` };
  } catch (err) {
    console.error("[email.service] SendGrid threw:", err);
    return { success: false, via: "sendgrid", error: "Network error" };
  }
}

// ────────────────────────────────── SMTP ─────────────────────────────────────

async function sendViaSmtp(
  creds: EmailCreds,
  msg: EmailMessage,
): Promise<EmailResult> {
  try {
    const transport = nodemailer.createTransport({
      host: creds.host,
      port: creds.port,
      secure: creds.port === 465,
      auth: creds.user ? { user: creds.user, pass: creds.pass } : undefined,
    });
    await transport.sendMail({
      from: creds.from,
      to: recipients(msg.to).join(", "),
      subject: msg.subject,
      html: msg.html,
      text: msg.text ?? stripHtml(msg.html),
      replyTo: msg.replyTo,
    });
    return { success: true, via: "smtp" };
  } catch (err) {
    console.error("[email.service] SMTP send failed:", err);
    return { success: false, via: "smtp", error: "SMTP send failed" };
  }
}

// ─────────────────────────────── Public API ──────────────────────────────────

/** Send a transactional email (SendGrid → SMTP fallback). */
export async function sendEmail(msg: EmailMessage): Promise<EmailResult> {
  const to = recipients(msg.to);
  if (to.length === 0) return { success: false, error: "No recipients" };

  const sendgrid = await getSendgridCreds();
  if (sendgrid) {
    return sendViaSendgrid(sendgrid, {
      personalizations: [{ to: to.map((email) => ({ email })) }],
      subject: msg.subject,
      reply_to: msg.replyTo ? { email: msg.replyTo } : undefined,
      content: [
        { type: "text/plain", value: msg.text ?? stripHtml(msg.html) },
        { type: "text/html", value: msg.html },
      ],
    });
  }

  const smtp = await getEmailCreds();
  if (smtp) return sendViaSmtp(smtp, msg);

  console.warn("[email.service] email not configured; skipped:", msg.subject);
  return { success: false, error: "Email is not configured" };
}

/**
 * Send a SendGrid dynamic template. `dynamicData` is injected into the
 * template's handlebars placeholders. Requires SendGrid (no SMTP equivalent).
 */
export async function sendTemplate(params: {
  to: string | string[];
  templateId: string;
  dynamicData?: Record<string, unknown>;
  replyTo?: string;
}): Promise<EmailResult> {
  const to = recipients(params.to);
  if (to.length === 0) return { success: false, error: "No recipients" };

  const sendgrid = await getSendgridCreds();
  if (!sendgrid) {
    return {
      success: false,
      error: "SendGrid is required for templated emails and is not configured",
    };
  }

  return sendViaSendgrid(sendgrid, {
    personalizations: [
      {
        to: to.map((email) => ({ email })),
        dynamic_template_data: params.dynamicData ?? {},
      },
    ],
    reply_to: params.replyTo ? { email: params.replyTo } : undefined,
    template_id: params.templateId,
  });
}

export const emailService = { sendEmail, sendTemplate };
