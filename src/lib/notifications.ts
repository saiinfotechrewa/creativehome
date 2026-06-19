import nodemailer from "nodemailer";
import type { Lead, Order } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getEmailCreds, getWhatsappCreds } from "@/lib/integrations";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Notifications.
 *
 * Two transports (email via SMTP/nodemailer, WhatsApp via the Cloud API) plus
 * a set of high-level triggers used across the app: auto-replies to people who
 * fill in a form, and internal alerts to the team when something needs
 * attention.
 *
 * Routing per event (which channels fire, who receives admin alerts) is driven
 * by the `NotificationSetting` rows seeded for `new_lead`, `new_order`,
 * `payment_success`, … Everything here is best-effort: a failure to notify
 * must never break the underlying action, so all functions swallow errors and
 * log to the console.
 * ─────────────────────────────────────────────────────────────────────────
 */

// ───────────────────────────── Low-level send ───────────────────────────────

interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/** Send an email. Returns false (without throwing) if email isn't configured. */
export async function sendEmail(msg: EmailMessage): Promise<boolean> {
  try {
    const recipients = (Array.isArray(msg.to) ? msg.to : [msg.to]).filter(
      Boolean,
    );
    if (recipients.length === 0) return false;

    const creds = await getEmailCreds();
    if (!creds) {
      console.warn("[notifications] email not configured; skipped:", msg.subject);
      return false;
    }

    const transport = nodemailer.createTransport({
      host: creds.host,
      port: creds.port,
      secure: creds.port === 465,
      auth: creds.user ? { user: creds.user, pass: creds.pass } : undefined,
    });

    await transport.sendMail({
      from: creds.from,
      to: recipients.join(", "),
      subject: msg.subject,
      html: msg.html,
      text: msg.text ?? stripHtml(msg.html),
    });
    return true;
  } catch (err) {
    console.error("[notifications] sendEmail failed:", err);
    return false;
  }
}

/** Send a WhatsApp text. No-op (returns false) when WhatsApp isn't configured. */
export async function sendWhatsApp(
  to: string | null | undefined,
  message: string,
): Promise<boolean> {
  try {
    const phone = to?.replace(/[^\d]/g, "");
    if (!phone) return false;

    const creds = await getWhatsappCreds();
    if (!creds) {
      console.warn("[notifications] WhatsApp not configured; skipped");
      return false;
    }

    const res = await fetch(`${creds.apiUrl}/${creds.phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: message },
      }),
    });
    if (!res.ok) {
      console.error("[notifications] WhatsApp API error:", await res.text());
    }
    return res.ok;
  } catch (err) {
    console.error("[notifications] sendWhatsApp failed:", err);
    return false;
  }
}

// ─────────────────────────── Event routing ──────────────────────────────────

interface ChannelConfig {
  email: boolean;
  whatsapp: boolean;
  inApp: boolean;
  recipients: string[];
}

/** Resolve per-event channel config; sensible defaults when the row is absent. */
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
      ? (ch.recipients as string[]).filter((r) => typeof r === "string")
      : [],
  };
}

/**
 * Admin email recipients for an event: explicit recipients on the setting, else
 * the company contact email, else every active admin user.
 */
async function adminRecipients(explicit: string[]): Promise<string[]> {
  if (explicit.length > 0) return explicit;

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

/** WhatsApp number the business is reachable on (for internal alerts). */
async function companyWhatsApp(): Promise<string | null> {
  const company = await prisma.companySettings
    .findUnique({ where: { id: "singleton" }, select: { whatsapp: true } })
    .catch(() => null);
  return company?.whatsapp ?? null;
}

/** Fire an internal team alert for `event` across its configured channels. */
async function notifyTeam(
  event: string,
  payload: { subject: string; html: string; whatsapp?: string },
): Promise<void> {
  const channels = await getChannels(event);

  if (channels.email) {
    const to = await adminRecipients(channels.recipients);
    await sendEmail({ to, subject: payload.subject, html: payload.html });
  }
  if (channels.whatsapp && payload.whatsapp) {
    const number = await companyWhatsApp();
    if (number) await sendWhatsApp(number, payload.whatsapp);
  }
}

// ─────────────────────────────── Helpers ────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function shell(title: string, body: string): string {
  return `<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;color:#0f172a;line-height:1.6">
  <h2 style="margin:0 0 12px">${title}</h2>
  ${body}
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0" />
  <p style="color:#64748b;font-size:12px">CreativeDox — Business software &amp; automation</p>
</div>`;
}

// ─────────────────────────── Lead triggers ──────────────────────────────────

const SOURCE_LABEL: Record<string, string> = {
  CONTACT: "contact form",
  DEMO: "demo request",
  CONSULTATION: "consultation booking",
  WHATSAPP: "WhatsApp enquiry",
};

/** Auto-reply to the person who submitted a public lead form. */
export async function sendLeadAutoReply(lead: Lead): Promise<void> {
  const firstName = lead.name.split(/\s+/)[0] ?? lead.name;

  if (lead.email) {
    await sendEmail({
      to: lead.email,
      subject: "We've received your enquiry — CreativeDox",
      html: shell(
        `Thanks, ${firstName}!`,
        `<p>We've received your ${SOURCE_LABEL[lead.source] ?? "enquiry"} and a
        member of our team will reach out shortly — usually within one business
        day.</p>
        <p>If it's urgent, reply to this email or message us on WhatsApp.</p>`,
      ),
    });
  }

  const wa = lead.whatsapp ?? lead.phone;
  if (wa) {
    await sendWhatsApp(
      wa,
      `Hi ${firstName}, thanks for reaching out to CreativeDox! We've received your request and will get back to you shortly.`,
    );
  }
}

/** Alert the team that a new lead landed in the inbox. */
export async function notifyNewLead(lead: Lead): Promise<void> {
  const event = lead.source === "CONSULTATION" ? "consultation_booked" : "new_lead";
  await notifyTeam(event, {
    subject: `New ${lead.priority} lead: ${lead.name}`,
    html: shell(
      "New lead received",
      `<table cellpadding="4" style="font-size:14px">
        <tr><td><b>Name</b></td><td>${lead.name}</td></tr>
        <tr><td><b>Source</b></td><td>${lead.source}</td></tr>
        <tr><td><b>Priority</b></td><td>${lead.priority}</td></tr>
        <tr><td><b>Email</b></td><td>${lead.email ?? "—"}</td></tr>
        <tr><td><b>Phone</b></td><td>${lead.phone ?? "—"}</td></tr>
        <tr><td><b>Business</b></td><td>${lead.businessName ?? "—"}</td></tr>
        <tr><td><b>Message</b></td><td>${lead.description ?? "—"}</td></tr>
      </table>`,
    ),
    whatsapp: `🟢 New ${lead.priority} lead via ${lead.source}: ${lead.name} (${lead.email ?? lead.phone ?? "no contact"})`,
  });
}

/** Confirm a converted lead is now an active customer. */
export async function notifyLeadConverted(
  lead: Lead,
  customerEmail: string,
): Promise<void> {
  await sendEmail({
    to: customerEmail,
    subject: "Welcome to CreativeDox 🎉",
    html: shell(
      `Welcome aboard, ${lead.name.split(/\s+/)[0]}!`,
      `<p>Your account is set up and our team will be in touch to get you
      started. We're glad to have you with us.</p>`,
    ),
  });
}

// ─────────────────────────── Order triggers ─────────────────────────────────

function orderMeta(order: Order): { total: number; currency: string; name: string; email: string } {
  const pricing = (order.pricing ?? {}) as Record<string, unknown>;
  const info = (order.customerInfo ?? {}) as Record<string, unknown>;
  return {
    total: typeof pricing.total === "number" ? pricing.total : 0,
    currency: typeof pricing.currency === "string" ? pricing.currency : "INR",
    name: typeof info.name === "string" ? info.name : "Customer",
    email: typeof info.email === "string" ? info.email : "",
  };
}

/** Alert the team that a new (PENDING) order was placed. */
export async function notifyNewOrder(order: Order): Promise<void> {
  const m = orderMeta(order);
  await notifyTeam("new_order", {
    subject: `New order ${order.orderNumber} — ${inr(m.total)}`,
    html: shell(
      "New order placed",
      `<p><b>${order.orderNumber}</b> from ${m.name} for ${inr(m.total)} is
      awaiting payment.</p>`,
    ),
    whatsapp: `🧾 New order ${order.orderNumber} from ${m.name}: ${inr(m.total)} (pending payment)`,
  });
}

/** Email the customer a receipt and alert the team on successful payment. */
export async function notifyPaymentSuccess(order: Order): Promise<void> {
  const m = orderMeta(order);

  if (m.email) {
    await sendEmail({
      to: m.email,
      subject: `Payment received — order ${order.orderNumber}`,
      html: shell(
        "Payment successful 🎉",
        `<p>Thanks ${m.name}! We've received your payment of
        <b>${inr(m.total)}</b> for order <b>${order.orderNumber}</b>.</p>
        <p>Your invoice is attached in your account, and our team is already
        setting things up.</p>`,
      ),
    });
  }

  await notifyTeam("payment_success", {
    subject: `Payment captured: ${order.orderNumber} (${inr(m.total)})`,
    html: shell(
      "Payment captured",
      `<p>Order <b>${order.orderNumber}</b> from ${m.name} is now paid
      (${inr(m.total)}).</p>`,
    ),
    whatsapp: `✅ Payment captured for ${order.orderNumber}: ${inr(m.total)} from ${m.name}`,
  });
}

/** Notify the customer (and team) that payment failed. */
export async function notifyPaymentFailed(order: Order): Promise<void> {
  const m = orderMeta(order);
  if (m.email) {
    await sendEmail({
      to: m.email,
      subject: `Payment failed — order ${order.orderNumber}`,
      html: shell(
        "Payment didn't go through",
        `<p>We couldn't process your payment for order
        <b>${order.orderNumber}</b>. No money was deducted. Please try again or
        contact us for help.</p>`,
      ),
    });
  }
  await notifyTeam("new_order", {
    subject: `Payment failed: ${order.orderNumber}`,
    html: shell(
      "Payment failed",
      `<p>Payment for order <b>${order.orderNumber}</b> (${m.name}) failed.</p>`,
    ),
  });
}

/** Notify the customer that a refund was issued. */
export async function notifyRefundIssued(
  order: Order,
  amount: number,
): Promise<void> {
  const m = orderMeta(order);
  if (m.email) {
    await sendEmail({
      to: m.email,
      subject: `Refund processed — order ${order.orderNumber}`,
      html: shell(
        "Refund on its way",
        `<p>We've processed a refund of <b>${inr(amount)}</b> for order
        <b>${order.orderNumber}</b>. It should reflect in your account within
        5–7 business days.</p>`,
      ),
    });
  }
}
