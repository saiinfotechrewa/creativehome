import { prisma } from "@/lib/prisma";
import { withAuthHandler, getClientIp } from "@/lib/auth-helpers";
import { rateLimit } from "@/lib/rate-limit";
import { ok, fail } from "@/lib/api-response";
import { legalTypeSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ type: string }> };

/**
 * GET /api/public/legal/[type] — a single published legal document
 * (terms | privacy | refund | cookies | shipping | disclaimer).
 */
export const GET = withAuthHandler(
  async (req: Request, ctx: RouteContext) => {
    const limit = rateLimit(`public:legal:${getClientIp(req)}`, 60, 60_000);
    if (!limit.success) return fail("Too many requests", 429);

    const { type } = await ctx.params;
    const parsedType = legalTypeSchema.safeParse(type);
    if (!parsedType.success) return fail("Document not found", 404);

    const doc = await prisma.legalDocument.findUnique({
      where: { type: parsedType.data },
      select: {
        type: true,
        title: true,
        content: true,
        version: true,
        isPublished: true,
        effectiveAt: true,
        seo: true,
        updatedAt: true,
      },
    });

    // Unpublished or non-existent documents are treated as not found publicly.
    if (!doc || !doc.isPublished) return fail("Document not found", 404);

    return ok(doc);
  },
);
