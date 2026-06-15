import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  withAuthHandler,
  getClientIp,
} from "@/lib/auth-helpers";
import { PERMISSIONS } from "@/lib/permissions";
import { logActivity } from "@/lib/activity-logger";
import { ok, parseJson } from "@/lib/api-response";
import { companySettingsSchema } from "@/lib/validators";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const SINGLETON_ID = "singleton";

/** GET /api/admin/settings/company — read the (singleton) company settings. */
export const GET = withAuthHandler(async () => {
  await requirePermission(PERMISSIONS.SETTINGS_VIEW);

  // Lazily create the singleton so the editor always has a row to bind to.
  const settings = await prisma.companySettings.upsert({
    where: { id: SINGLETON_ID },
    update: {},
    create: { id: SINGLETON_ID },
  });

  return ok(settings);
});

/** PUT /api/admin/settings/company — update the company settings. */
export const PUT = withAuthHandler(async (req: Request) => {
  const user = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
  const data = await parseJson(req, companySettingsSchema);

  // JSON columns are validated as `Record<string, unknown>`; Prisma needs them
  // typed as `InputJsonValue`.
  const payload = {
    companyName: data.companyName,
    tagline: data.tagline,
    logo: data.logo,
    darkLogo: data.darkLogo,
    favicon: data.favicon,
    email: data.email,
    phone: data.phone,
    whatsapp: data.whatsapp,
    address: data.address as Prisma.InputJsonValue,
    businessHours: data.businessHours as Prisma.InputJsonValue,
    socialLinks: data.socialLinks as Prisma.InputJsonValue,
    seoDefaults: data.seoDefaults as Prisma.InputJsonValue,
  };

  const settings = await prisma.companySettings.upsert({
    where: { id: SINGLETON_ID },
    update: payload,
    create: { id: SINGLETON_ID, ...payload },
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "settings",
    entityId: settings.id,
    entityName: "Company settings",
    ipAddress: getClientIp(req),
  });

  return ok(settings);
});
