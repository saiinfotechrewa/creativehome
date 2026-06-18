import { revalidatePath, revalidateTag } from "next/cache";
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
import { isRedisRateLimitEnabled } from "@/lib/rate-limit";
import { maintenanceSchema, cacheClearSchema } from "@/lib/validators";
import {
  getRazorpayCreds,
  getSendgridCreds,
  getEmailCreds,
  getTwilioCreds,
  getCloudinaryCreds,
} from "@/lib/integrations";

/**
 * System / ops endpoints: a health check, ISR cache invalidation, and the
 * maintenance-mode toggle (stored in the `SystemSetting` singleton).
 */

const SINGLETON = "singleton";

/** Read (and lazily create) the system settings singleton. */
async function getSystemSettings() {
  return prisma.systemSetting.upsert({
    where: { id: SINGLETON },
    create: { id: SINGLETON },
    update: {},
  });
}

// ───────────────────────────── Health check ──────────────────────────────────

const health = withAuthHandler(async () => {
  await requirePermission(PERMISSIONS.SETTINGS_VIEW);

  // Database connectivity (and latency).
  let database: { ok: boolean; latencyMs: number | null; error?: string };
  const startedAt = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    database = { ok: true, latencyMs: Date.now() - startedAt };
  } catch (err) {
    database = {
      ok: false,
      latencyMs: null,
      error: err instanceof Error ? err.message : "Database unreachable",
    };
  }

  // Which integrations are usable (creds resolve).
  const [razorpay, sendgrid, smtp, twilio, cloudinary] = await Promise.all([
    getRazorpayCreds().then(Boolean).catch(() => false),
    getSendgridCreds().then(Boolean).catch(() => false),
    getEmailCreds().then(Boolean).catch(() => false),
    getTwilioCreds().then(Boolean).catch(() => false),
    getCloudinaryCreds().then(Boolean).catch(() => false),
  ]);

  const settings = await getSystemSettings().catch(() => null);
  const mem = process.memoryUsage();

  const healthy = database.ok;
  const body = {
    status: healthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    version: process.env.npm_package_version ?? "0.1.0",
    environment: process.env.NODE_ENV ?? "development",
    maintenanceMode: settings?.maintenanceMode ?? false,
    checks: {
      database,
      integrations: {
        razorpay,
        email: sendgrid || smtp,
        whatsapp: twilio,
        cloudinary,
      },
      memory: {
        rssMb: Math.round(mem.rss / 1024 / 1024),
        heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
      },
      rateLimit: {
        backend: isRedisRateLimitEnabled() ? "redis" : "memory",
      },
    },
  };

  return healthy ? ok(body) : fail("System degraded", 503, { data: body });
});

// ─────────────────────────────── Cache clear ─────────────────────────────────

const clearCache = withAuthHandler(async (req: Request) => {
  const user = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
  const { paths, tags, all } = await parseJson(req, cacheClearSchema);

  const revalidatedPaths: string[] = [];
  const revalidatedTags: string[] = [];

  if (all) {
    // Revalidate the root layout → cascades to every page.
    revalidatePath("/", "layout");
    revalidatedPaths.push("/ (layout)");
  }
  for (const path of paths ?? []) {
    revalidatePath(path);
    revalidatedPaths.push(path);
  }
  for (const tag of tags ?? []) {
    revalidateTag(tag);
    revalidatedTags.push(tag);
  }

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "system",
    entityName: "cache",
    details: { paths: revalidatedPaths, tags: revalidatedTags },
    ipAddress: getClientIp(req),
  });

  return ok({ revalidated: true, paths: revalidatedPaths, tags: revalidatedTags });
});

// ──────────────────────────── Maintenance mode ───────────────────────────────

const getMaintenance = withAuthHandler(async () => {
  await requirePermission(PERMISSIONS.SETTINGS_VIEW);
  const settings = await getSystemSettings();
  return ok({
    maintenanceMode: settings.maintenanceMode,
    maintenanceMessage: settings.maintenanceMessage,
    maintenanceUntil: settings.maintenanceUntil,
    updatedAt: settings.updatedAt,
  });
});

const setMaintenance = withAuthHandler(async (req: Request) => {
  const user = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
  const { enabled, message, until } = await parseJson(req, maintenanceSchema);

  const data: Prisma.SystemSettingUpdateInput = {
    maintenanceMode: enabled,
    maintenanceMessage: message ?? null,
    maintenanceUntil: until ?? null,
  };

  const settings = await prisma.systemSetting.upsert({
    where: { id: SINGLETON },
    create: {
      id: SINGLETON,
      maintenanceMode: enabled,
      maintenanceMessage: message ?? null,
      maintenanceUntil: until ?? null,
    },
    update: data,
  });

  // Drop the cached homepage so the maintenance banner takes effect immediately.
  revalidatePath("/", "layout");

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "system",
    entityName: "maintenance",
    details: { enabled, message },
    ipAddress: getClientIp(req),
  });

  return ok({
    maintenanceMode: settings.maintenanceMode,
    maintenanceMessage: settings.maintenanceMessage,
    maintenanceUntil: settings.maintenanceUntil,
  });
});

export const systemAdminApi = {
  health,
  clearCache,
  getMaintenance,
  setMaintenance,
};
