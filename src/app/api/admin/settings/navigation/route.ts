import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  withAuthHandler,
  getClientIp,
} from "@/lib/auth-helpers";
import { PERMISSIONS } from "@/lib/permissions";
import { logActivity } from "@/lib/activity-logger";
import { ok, parseJson } from "@/lib/api-response";
import { navigationSchema } from "@/lib/validators";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const SINGLETON_ID = "singleton";

/** GET /api/admin/settings/navigation — read the header navigation menu. */
export const GET = withAuthHandler(async () => {
  await requirePermission(PERMISSIONS.SETTINGS_VIEW);

  const nav = await prisma.navigationMenu.upsert({
    where: { id: SINGLETON_ID },
    update: {},
    create: { id: SINGLETON_ID },
  });

  return ok(nav);
});

/** PUT /api/admin/settings/navigation — update the header navigation menu. */
export const PUT = withAuthHandler(async (req: Request) => {
  const user = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
  const data = await parseJson(req, navigationSchema);

  const payload = {
    items: data.items as unknown as Prisma.InputJsonValue,
    ctaButton: data.ctaButton as unknown as Prisma.InputJsonValue,
  };

  const nav = await prisma.navigationMenu.upsert({
    where: { id: SINGLETON_ID },
    update: payload,
    create: { id: SINGLETON_ID, ...payload },
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "settings",
    entityId: nav.id,
    entityName: "Navigation menu",
    ipAddress: getClientIp(req),
  });

  return ok(nav);
});
