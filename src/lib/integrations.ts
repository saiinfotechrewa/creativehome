import { prisma } from "@/lib/prisma";
import { decryptConfig } from "@/lib/encryption";

/**
 * Resolve runtime credentials for third-party integrations.
 *
 * Secrets live encrypted in `IntegrationSetting.config` (managed from the admin
 * Integrations screen). Each resolver falls back to an environment variable so
 * the platform still works in environments configured purely through env
 * (Docker/Coolify) before anything is saved in the database.
 *
 * Every resolver returns `null` when the integration isn't usable, so callers
 * can degrade gracefully (e.g. skip sending a WhatsApp message) instead of
 * throwing.
 */

export type IntegrationKey =
  | "whatsapp"
  | "email"
  | "razorpay"
  | "analytics"
  | "sms"
  | "cloudinary";

interface IntegrationState {
  isActive: boolean;
  config: Record<string, unknown>;
}

/** Load + decrypt a single integration row. `clearKeys` are left un-decrypted. */
export async function getIntegration(
  key: IntegrationKey,
  clearKeys: string[] = [],
): Promise<IntegrationState | null> {
  const row = await prisma.integrationSetting.findUnique({
    where: { integrationKey: key },
  });
  if (!row) return null;
  const config = decryptConfig(
    (row.config ?? {}) as Record<string, unknown>,
    clearKeys,
  );
  return { isActive: row.isActive, config };
}

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

// ──────────────────────────────── Razorpay ──────────────────────────────────

export interface RazorpayCreds {
  keyId: string;
  keySecret: string;
  webhookSecret?: string;
}

export async function getRazorpayCreds(): Promise<RazorpayCreds | null> {
  const integ = await getIntegration("razorpay", ["keyId"]);
  const keyId = str(integ?.config.keyId) ?? str(process.env.RAZORPAY_KEY_ID);
  const keySecret =
    str(integ?.config.keySecret) ?? str(process.env.RAZORPAY_KEY_SECRET);
  const webhookSecret =
    str(integ?.config.webhookSecret) ??
    str(process.env.RAZORPAY_WEBHOOK_SECRET);

  if (!keyId || !keySecret) return null;
  return { keyId, keySecret, webhookSecret };
}

// ───────────────────────────────── Email ────────────────────────────────────

export interface EmailCreds {
  host: string;
  port: number;
  user?: string;
  pass?: string;
  from: string;
}

export async function getEmailCreds(): Promise<EmailCreds | null> {
  const integ = await getIntegration("email", ["host", "port", "from", "user"]);
  const host = str(integ?.config.host) ?? str(process.env.SMTP_HOST);
  if (!host) return null;

  const portRaw =
    str(integ?.config.port) ?? str(process.env.SMTP_PORT) ?? "587";
  return {
    host,
    port: Number.parseInt(portRaw, 10) || 587,
    user: str(integ?.config.user) ?? str(process.env.SMTP_USER),
    pass: str(integ?.config.pass) ?? str(process.env.SMTP_PASS),
    from:
      str(integ?.config.from) ??
      str(process.env.SMTP_FROM) ??
      "CreativeDox <no-reply@creativedox.com>",
  };
}

// ──────────────────────────────── WhatsApp ───────────────────────────────────

export interface WhatsappCreds {
  /** Graph API base, e.g. https://graph.facebook.com/v21.0 */
  apiUrl: string;
  phoneNumberId: string;
  token: string;
}

export async function getWhatsappCreds(): Promise<WhatsappCreds | null> {
  const integ = await getIntegration("whatsapp", ["apiUrl", "phoneNumberId"]);
  const apiUrl =
    str(integ?.config.apiUrl) ??
    str(process.env.WHATSAPP_API_URL) ??
    "https://graph.facebook.com/v21.0";
  const phoneNumberId =
    str(integ?.config.phoneNumberId) ?? str(process.env.WHATSAPP_PHONE_ID);
  const token = str(integ?.config.token) ?? str(process.env.WHATSAPP_TOKEN);

  if (!phoneNumberId || !token) return null;
  return { apiUrl, phoneNumberId, token };
}

// ───────────────────────── Twilio (WhatsApp / SMS) ───────────────────────────

export interface TwilioCreds {
  accountSid: string;
  authToken: string;
  /** Sender in E.164, e.g. +14155238886 (the `whatsapp:` prefix is added later). */
  fromNumber: string;
  /** Optional Messaging Service SID — takes precedence over `fromNumber`. */
  messagingServiceSid?: string;
}

/**
 * Twilio credentials, shared by the WhatsApp and SMS services. Stored under the
 * `whatsapp` integration key (Twilio is the WhatsApp transport); the `sms` key
 * is consulted as a fallback so SMS can use a separate sub-account if desired.
 */
export async function getTwilioCreds(
  key: Extract<IntegrationKey, "whatsapp" | "sms"> = "whatsapp",
): Promise<TwilioCreds | null> {
  const integ = await getIntegration(key, [
    "accountSid",
    "fromNumber",
    "messagingServiceSid",
  ]);
  const accountSid =
    str(integ?.config.accountSid) ?? str(process.env.TWILIO_ACCOUNT_SID);
  const authToken =
    str(integ?.config.authToken) ?? str(process.env.TWILIO_AUTH_TOKEN);
  const fromNumber =
    str(integ?.config.fromNumber) ??
    str(process.env.TWILIO_WHATSAPP_FROM) ??
    str(process.env.TWILIO_FROM);

  if (!accountSid || !authToken || !fromNumber) return null;
  return {
    accountSid,
    authToken,
    fromNumber,
    messagingServiceSid: str(integ?.config.messagingServiceSid),
  };
}

// ──────────────────────────────── SendGrid ───────────────────────────────────

export interface SendgridCreds {
  apiKey: string;
  fromEmail: string;
  fromName?: string;
}

/**
 * SendGrid credentials (stored under the `email` integration key). When absent,
 * the email service falls back to SMTP via {@link getEmailCreds}.
 */
export async function getSendgridCreds(): Promise<SendgridCreds | null> {
  const integ = await getIntegration("email", ["fromEmail", "fromName"]);
  const apiKey =
    str(integ?.config.apiKey) ?? str(process.env.SENDGRID_API_KEY);
  const fromEmail =
    str(integ?.config.fromEmail) ?? str(process.env.SENDGRID_FROM_EMAIL);

  if (!apiKey || !fromEmail) return null;
  return {
    apiKey,
    fromEmail,
    fromName:
      str(integ?.config.fromName) ??
      str(process.env.SENDGRID_FROM_NAME) ??
      "CreativeDox",
  };
}

// ─────────────────────────────── Cloudinary ──────────────────────────────────

export interface CloudinaryCreds {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  /** Default upload folder for the media library. */
  uploadFolder: string;
}

export async function getCloudinaryCreds(): Promise<CloudinaryCreds | null> {
  const integ = await getIntegration("cloudinary", [
    "cloudName",
    "apiKey",
    "uploadFolder",
  ]);
  const cloudName =
    str(integ?.config.cloudName) ?? str(process.env.CLOUDINARY_CLOUD_NAME);
  const apiKey =
    str(integ?.config.apiKey) ?? str(process.env.CLOUDINARY_API_KEY);
  const apiSecret =
    str(integ?.config.apiSecret) ?? str(process.env.CLOUDINARY_API_SECRET);

  if (!cloudName || !apiKey || !apiSecret) return null;
  return {
    cloudName,
    apiKey,
    apiSecret,
    uploadFolder:
      str(integ?.config.uploadFolder) ??
      str(process.env.CLOUDINARY_FOLDER) ??
      "creativedox",
  };
}

// ──────────────────────────────── Analytics ──────────────────────────────────

export interface AnalyticsConfig {
  provider?: string; // ga4 | plausible | umami
  domain?: string;
  measurementId?: string;
  apiKey?: string;
  apiSecret?: string;
}

/** Raw analytics integration state (provider id + keys), or null if unset. */
export async function getAnalyticsConfig(): Promise<{
  isActive: boolean;
  config: AnalyticsConfig;
} | null> {
  const integ = await getIntegration("analytics", [
    "provider",
    "domain",
    "measurementId",
  ]);
  if (!integ) return null;
  return { isActive: integ.isActive, config: integ.config as AnalyticsConfig };
}
