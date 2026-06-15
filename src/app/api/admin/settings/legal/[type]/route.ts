import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  withAuthHandler,
  getClientIp,
} from "@/lib/auth-helpers";
import { PERMISSIONS } from "@/lib/permissions";
import { logActivity } from "@/lib/activity-logger";
import { ok, fail, parseJson } from "@/lib/api-response";
import { legalDocumentSchema, legalTypeSchema } from "@/lib/validators";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ type: string }> };

/** Default title shown when a legal document doesn't exist yet. */
const DEFAULT_TITLES: Record<string, string> = {
  terms: "Terms & Conditions",
  privacy: "Privacy Policy",
  refund: "Refund Policy",
  cookies: "Cookie Policy",
  shipping: "Shipping Policy",
  disclaimer: "Disclaimer",
};

/** GET /api/admin/settings/legal/[type] — read one legal document. */
export const GET = withAuthHandler(
  async (_req: Request, ctx: RouteContext) => {
    await requirePermission(PERMISSIONS.SETTINGS_VIEW);

    const { type } = await ctx.params;
    const parsedType = legalTypeSchema.safeParse(type);
    if (!parsedType.success) return fail("Unknown legal document type", 404);

    const doc = await prisma.legalDocument.findUnique({
      where: { type: parsedType.data },
    });

    // Return an unsaved shell so the admin editor can render a blank form.
    if (!doc) {
      return ok({
        type: parsedType.data,
        title: DEFAULT_TITLES[parsedType.data] ?? parsedType.data,
        content: "",
        version: null,
        isPublished: true,
        effectiveAt: null,
        seo: {},
        exists: false,
      });
    }

    return ok(doc);
  },
);

/** PUT /api/admin/settings/legal/[type] — create or update a legal document. */
export const PUT = withAuthHandler(async (req: Request, ctx: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);

  const { type } = await ctx.params;
  const parsedType = legalTypeSchema.safeParse(type);
  if (!parsedType.success) return fail("Unknown legal document type", 404);

  const data = await parseJson(req, legalDocumentSchema);

  const payload = {
    title: data.title,
    content: data.content,
    version: data.version || null,
    isPublished: data.isPublished,
    effectiveAt: data.effectiveAt ?? null,
    seo: data.seo as Prisma.InputJsonValue,
  };

  const doc = await prisma.legalDocument.upsert({
    where: { type: parsedType.data },
    update: payload,
    create: { type: parsedType.data, ...payload },
  });

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "update",
    module: "settings",
    entityId: doc.id,
    entityName: `Legal: ${doc.title}`,
    details: { type: parsedType.data },
    ipAddress: getClientIp(req),
  });

  return ok(doc);
});
