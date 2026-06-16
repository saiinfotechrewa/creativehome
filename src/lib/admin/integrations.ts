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
import { encryptConfig, decryptConfig } from "@/lib/encryption";
import {
  integrationKeySchema,
  integrationUpdateSchema,
  integrationTestSchema,
} from "@/lib/validators";
import {
  getRazorpayCreds,
  getSendgridCreds,
  getEmailCreds,
  getTwilioCreds,
  getCloudinaryCreds,
  type IntegrationKey,
} from "@/lib/integrations";
import { ping as cloudinaryPing } from "@/lib/services/cloudinary.service";
import nodemailer from "nodemailer";

/**
 * Admin Integrations API.
 *
 * - GET (list / single): returns each integration with its config, but every
 *   *secret* field is masked (`••••1234`) so the panel can show a redacted
 *   preview without ever shipping plaintext keys to the browser.
 * - PUT: upserts the row. Secrets are encrypted at rest; a field the client
 *   sends back still masked is treated as "unchanged" and the stored value is
 *   preserved.
 * - POST /test: performs a live, read-only connectivity check per integration.
 */

type KeyCtx = { params: Promise<{ key: string }> };

/**
 * Per-integration field metadata. `clear` fields are stored & shown in plain
 * text (non-sensitive, e.g. a public key id); everything else is encrypted and
 * masked on read.
 */
const INTEGRATION_FIELDS: Record<IntegrationKey, { clear: string[] }> = {
  whatsapp: { clear: ["accountSid", "fromNumber", "messagingServiceSid"] },
  email: { clear: ["host", "port", "from", "fromEmail", "fromName", "user"] },
  razorpay: { clear: ["keyId"] },
  analytics: { clear: ["provider", "domain", "measurementId"] },
  sms: { clear: ["accountSid", "fromNumber"] },
  cloudinary: { clear: ["cloudName", "apiKey", "uploadFolder"] },
};

const MASK = "••••";

function clearKeys(key: IntegrationKey): string[] {
  return INTEGRATION_FIELDS[key]?.clear ?? [];
}

/** Mask a secret to its last 4 chars: `sk_live_…a1b2` → `••••a1b2`. */
function maskValue(value: unknown): unknown {
  if (typeof value !== "string" || value.length === 0) return value;
  return value.length <= 4 ? MASK : MASK + value.slice(-4);
}

/** A value is "still masked" (unchanged by the client) if it starts with •. */
function isMasked(value: unknown): boolean {
  return typeof value === "string" && value.startsWith("•");
}

/** Decrypt a stored config, then mask secret fields for safe display. */
function maskedView(
  key: IntegrationKey,
  storedConfig: Record<string, unknown>,
): Record<string, unknown> {
  const clear = clearKeys(key);
  const decrypted = decryptConfig(storedConfig, clear);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(decrypted)) {
    out[k] = clear.includes(k) ? v : maskValue(v);
  }
  return out;
}

function isIntegrationKey(value: string): value is IntegrationKey {
  return integrationKeySchema.safeParse(value).success;
}

// ───────────────────────────────── Reads ─────────────────────────────────────

const list = withAuthHandler(async () => {
  await requirePermission(PERMISSIONS.INTEGRATIONS_MANAGE);

  const rows = await prisma.integrationSetting.findMany();
  const byKey = new Map(rows.map((r) => [r.integrationKey, r]));

  // Always return the full, known set so the UI can render every card.
  const keys = integrationKeySchema.options as IntegrationKey[];
  const items = keys.map((key) => {
    const row = byKey.get(key);
    return {
      integrationKey: key,
      isActive: row?.isActive ?? false,
      configured: !!row && Object.keys((row.config as object) ?? {}).length > 0,
      config: row
        ? maskedView(key, (row.config ?? {}) as Record<string, unknown>)
        : {},
      updatedAt: row?.updatedAt ?? null,
    };
  });

  return ok(items);
});

const getByKey = withAuthHandler(async (_req: Request, ctx: KeyCtx) => {
  await requirePermission(PERMISSIONS.INTEGRATIONS_MANAGE);
  const { key } = await ctx.params;
  if (!isIntegrationKey(key)) return fail("Unknown integration", 404);

  const row = await prisma.integrationSetting.findUnique({
    where: { integrationKey: key },
  });

  return ok({
    integrationKey: key,
    isActive: row?.isActive ?? false,
    configured: !!row && Object.keys((row.config as object) ?? {}).length > 0,
    config: row
      ? maskedView(key, (row.config ?? {}) as Record<string, unknown>)
      : {},
    updatedAt: row?.updatedAt ?? null,
  });
});

// ──────────────────────────────── Update ─────────────────────────────────────

const update = withAuthHandler(async (req: Request, ctx: KeyCtx) => {
  const user = await requirePermission(PERMISSIONS.INTEGRATIONS_MANAGE);
  const { key } = await ctx.params;
  if (!isIntegrationKey(key)) return fail("Unknown integration", 404);

  const { isActive, config } = await parseJson(req, integrationUpdateSchema);
  const clear = clearKeys(key);

  // Merge against the existing *decrypted* config so masked fields the client
  // didn't change are preserved rather than overwritten with the mask.
  const existing = await prisma.integrationSetting.findUnique({
    where: { integrationKey: key },
  });
  const current = existing
    ? decryptConfig((existing.config ?? {}) as Record<string, unknown>, clear)
    : {};

  const merged: Record<string, unknown> = { ...current };
  for (const [k, v] of Object.entries(config)) {
    if (isMasked(v)) continue; // unchanged secret — keep stored value
    if (v === "" || v === null) {
      delete merged[k]; // explicit clear
    } else {
      merged[k] = v;
    }
  }

  const encrypted = encryptConfig(merged, clear) as Prisma.InputJsonValue;

  const row = await prisma.integrationSetting.upsert({
    where: { integrationKey: key },
    create: {
      integrationKey: key,
      isActive: isActive ?? false,
      config: encrypted,
    },
    update: {
      ...(isActive !== undefined ? { isActive } : {}),
      config: encrypted,
    },
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "integrations",
    entityId: row.id,
    entityName: key,
    details: { isActive: row.isActive, fields: Object.keys(merged) },
    ipAddress: getClientIp(req),
  });

  return ok({
    integrationKey: key,
    isActive: row.isActive,
    config: maskedView(key, merged),
    updatedAt: row.updatedAt,
  });
});

// ───────────────────────────── Test connection ───────────────────────────────

interface TestOutcome {
  success: boolean;
  message: string;
}

async function testRazorpay(): Promise<TestOutcome> {
  const creds = await getRazorpayCreds();
  if (!creds) return { success: false, message: "Razorpay is not configured" };
  const auth = Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString(
    "base64",
  );
  const res = await fetch("https://api.razorpay.com/v1/payments?count=1", {
    headers: { Authorization: `Basic ${auth}` },
  });
  return res.ok
    ? { success: true, message: "Authenticated with Razorpay" }
    : { success: false, message: `Razorpay rejected the keys (${res.status})` };
}

async function testEmail(): Promise<TestOutcome> {
  const sendgrid = await getSendgridCreds();
  if (sendgrid) {
    const res = await fetch("https://api.sendgrid.com/v3/scopes", {
      headers: { Authorization: `Bearer ${sendgrid.apiKey}` },
    });
    return res.ok
      ? { success: true, message: "Authenticated with SendGrid" }
      : { success: false, message: `SendGrid rejected the key (${res.status})` };
  }
  const smtp = await getEmailCreds();
  if (!smtp) return { success: false, message: "Email is not configured" };
  const transport = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
  });
  await transport.verify();
  return { success: true, message: "SMTP server reachable" };
}

async function testTwilio(
  key: Extract<IntegrationKey, "whatsapp" | "sms">,
): Promise<TestOutcome> {
  const creds = await getTwilioCreds(key);
  if (!creds) return { success: false, message: "Twilio is not configured" };
  const auth = Buffer.from(
    `${creds.accountSid}:${creds.authToken}`,
  ).toString("base64");
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${creds.accountSid}.json`,
    { headers: { Authorization: `Basic ${auth}` } },
  );
  return res.ok
    ? { success: true, message: "Authenticated with Twilio" }
    : { success: false, message: `Twilio rejected the keys (${res.status})` };
}

async function testCloudinary(): Promise<TestOutcome> {
  const creds = await getCloudinaryCreds();
  if (!creds) return { success: false, message: "Cloudinary is not configured" };
  const okPing = await cloudinaryPing(creds);
  return okPing
    ? { success: true, message: "Authenticated with Cloudinary" }
    : { success: false, message: "Cloudinary rejected the credentials" };
}

async function runTest(key: IntegrationKey): Promise<TestOutcome> {
  switch (key) {
    case "razorpay":
      return testRazorpay();
    case "email":
      return testEmail();
    case "whatsapp":
      return testTwilio("whatsapp");
    case "sms":
      return testTwilio("sms");
    case "cloudinary":
      return testCloudinary();
    case "analytics": {
      const row = await prisma.integrationSetting.findUnique({
        where: { integrationKey: "analytics" },
      });
      const configured =
        !!row && Object.keys((row.config as object) ?? {}).length > 0;
      return configured
        ? { success: true, message: "Analytics configuration present" }
        : { success: false, message: "Analytics is not configured" };
    }
  }
}

const test = withAuthHandler(async (req: Request, ctx: KeyCtx) => {
  const user = await requirePermission(PERMISSIONS.INTEGRATIONS_MANAGE);
  const { key } = await ctx.params;
  if (!isIntegrationKey(key)) return fail("Unknown integration", 404);

  // Body is optional (a probe recipient) — tolerate an empty request.
  await req
    .clone()
    .json()
    .then((b) => integrationTestSchema.parse(b))
    .catch(() => ({}));

  let outcome: TestOutcome;
  try {
    outcome = await runTest(key);
  } catch (err) {
    console.error(`[integrations] test ${key} threw:`, err);
    outcome = { success: false, message: "Connection test failed" };
  }

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "integrations",
    entityName: key,
    details: { test: true, success: outcome.success },
    ipAddress: getClientIp(req),
  });

  return outcome.success
    ? ok({ key, ...outcome })
    : fail(outcome.message, 400, { key, success: false });
});

export const integrationsAdminApi = { list, getByKey, update, test };
