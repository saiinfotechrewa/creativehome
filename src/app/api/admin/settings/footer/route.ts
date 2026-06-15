import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  withAuthHandler,
  getClientIp,
} from "@/lib/auth-helpers";
import { PERMISSIONS } from "@/lib/permissions";
import { logActivity } from "@/lib/activity-logger";
import { ok, parseJson } from "@/lib/api-response";
import { footerSchema } from "@/lib/validators";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const SINGLETON_ID = "singleton";

/** GET /api/admin/settings/footer — read the footer configuration. */
export const GET = withAuthHandler(async () => {
  await requirePermission(PERMISSIONS.SETTINGS_VIEW);

  const footer = await prisma.footerSettings.upsert({
    where: { id: SINGLETON_ID },
    update: {},
    create: { id: SINGLETON_ID },
  });

  return ok(footer);
});

/** PUT /api/admin/settings/footer — update the footer configuration. */
export const PUT = withAuthHandler(async (req: Request) => {
  const user = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
  const data = await parseJson(req, footerSchema);

  const payload = {
    tagline: data.tagline,
    copyright: data.copyright,
    columns: data.columns as unknown as Prisma.InputJsonValue,
    legalLinks: data.legalLinks as unknown as Prisma.InputJsonValue,
    socialLinks: data.socialLinks as Prisma.InputJsonValue,
    newsletter: data.newsletter as unknown as Prisma.InputJsonValue,
  };

  const footer = await prisma.footerSettings.upsert({
    where: { id: SINGLETON_ID },
    update: payload,
    create: { id: SINGLETON_ID, ...payload },
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "settings",
    entityId: footer.id,
    entityName: "Footer settings",
    ipAddress: getClientIp(req),
  });

  return ok(footer);
});
