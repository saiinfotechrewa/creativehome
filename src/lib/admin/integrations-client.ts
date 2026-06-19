/**
 * Client-safe types, query keys and fetchers for the Integration Hub. No
 * server-only imports, so this is safe inside "use client" components.
 *
 * Secrets arrive masked from the API (`••••1234`). The forms keep the masked
 * placeholder for untouched secret fields and send it back unchanged — the
 * server treats a still-masked value as "keep the stored secret".
 */

// ───────────────────────────── Types ────────────────────────────────────────

export type IntegrationKey =
  | "whatsapp"
  | "email"
  | "razorpay"
  | "analytics"
  | "sms"
  | "cloudinary";

export interface IntegrationSummary {
  integrationKey: IntegrationKey;
  isActive: boolean;
  configured: boolean;
  config: Record<string, unknown>;
  updatedAt: string | null;
}

export interface IntegrationUpdate {
  isActive?: boolean;
  config: Record<string, unknown>;
}

export interface TestResult {
  success: boolean;
  message: string;
}

/** True when a value is still the server's masked placeholder. */
export function isMasked(value: unknown): boolean {
  return typeof value === "string" && value.startsWith("•");
}

/** Read a string field from a config blob (empty string when absent). */
export function cfgStr(
  config: Record<string, unknown>,
  key: string,
): string {
  const v = config[key];
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

export function cfgBool(
  config: Record<string, unknown>,
  key: string,
  fallback = false,
): boolean {
  const v = config[key];
  return typeof v === "boolean" ? v : fallback;
}

export function cfgArr(
  config: Record<string, unknown>,
  key: string,
): string[] {
  const v = config[key];
  return Array.isArray(v) ? v.map(String) : [];
}

// ─────────────────────────── Query keys ─────────────────────────────────────

export const integrationKeys = {
  all: ["admin", "integrations"] as const,
  list: ["admin", "integrations", "list"] as const,
  detail: (key: IntegrationKey) =>
    ["admin", "integrations", "detail", key] as const,
  notifications: ["admin", "notifications"] as const,
};

// ─────────────────────────── Fetchers ───────────────────────────────────────

async function unwrap<T>(res: Response, fallback: string): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? fallback);
  }
  return (json as { data: T }).data;
}

export async function fetchIntegrations(): Promise<IntegrationSummary[]> {
  const res = await fetch("/api/admin/integrations");
  return unwrap<IntegrationSummary[]>(res, "Failed to load integrations");
}

export async function fetchIntegration(
  key: IntegrationKey,
): Promise<IntegrationSummary> {
  const res = await fetch(`/api/admin/integrations/${key}`);
  return unwrap<IntegrationSummary>(res, "Failed to load integration");
}

export async function updateIntegration(
  key: IntegrationKey,
  body: IntegrationUpdate,
): Promise<IntegrationSummary> {
  const res = await fetch(`/api/admin/integrations/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return unwrap<IntegrationSummary>(res, "Failed to save integration");
}

/** POST /test — never throws; always resolves to a pass/fail outcome. */
export async function testIntegration(
  key: IntegrationKey,
  to?: string,
): Promise<TestResult> {
  const res = await fetch(`/api/admin/integrations/${key}/test`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(to ? { to } : {}),
  });
  const json = await res.json().catch(() => ({}));
  if (res.ok) {
    return {
      success: true,
      message:
        (json as { data?: { message?: string } }).data?.message ??
        "Connection OK",
    };
  }
  return {
    success: false,
    message: (json as { error?: string }).error ?? "Connection failed",
  };
}

// ──────────────────────── Notification settings ─────────────────────────────

export type NotificationEvent =
  | "new_lead"
  | "new_order"
  | "payment_failed"
  | "consultation_booked";

export interface NotificationChannels {
  email: { enabled: boolean; recipients: string[] };
  whatsapp: { enabled: boolean; numbers: string[] };
  sms: { enabled: boolean; numbers: string[] };
}

export interface NotificationSettingItem {
  event: NotificationEvent;
  channels: NotificationChannels;
  updatedAt: string | null;
}

export const NOTIFICATION_EVENT_META: {
  event: NotificationEvent;
  label: string;
  description: string;
}[] = [
  {
    event: "new_lead",
    label: "New Lead",
    description: "A new enquiry lands from the website.",
  },
  {
    event: "new_order",
    label: "New Order",
    description: "A customer completes a purchase.",
  },
  {
    event: "payment_failed",
    label: "Payment Failed",
    description: "A payment attempt is declined.",
  },
  {
    event: "consultation_booked",
    label: "Consultation Booked",
    description: "A prospect schedules a consultation.",
  },
];

export function emptyChannels(): NotificationChannels {
  return {
    email: { enabled: false, recipients: [] },
    whatsapp: { enabled: false, numbers: [] },
    sms: { enabled: false, numbers: [] },
  };
}

export async function fetchNotificationSettings(): Promise<
  NotificationSettingItem[]
> {
  const res = await fetch("/api/admin/notifications");
  return unwrap<NotificationSettingItem[]>(
    res,
    "Failed to load notification settings",
  );
}

export async function updateNotificationSetting(
  event: NotificationEvent,
  channels: NotificationChannels,
): Promise<NotificationSettingItem> {
  const res = await fetch(`/api/admin/notifications/${event}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channels }),
  });
  return unwrap<NotificationSettingItem>(res, "Failed to save notification");
}
