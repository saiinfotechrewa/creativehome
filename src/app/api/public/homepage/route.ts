import { prisma } from "@/lib/prisma";
import { withAuthHandler, getClientIp } from "@/lib/auth-helpers";
import { rateLimit } from "@/lib/rate-limit";
import { ok, fail } from "@/lib/api-response";

export const dynamic = "force-dynamic";

/**
 * GET /api/public/homepage — active homepage sections in display order.
 * Public: no auth, but rate limited per IP. Only `isActive` sections are
 * exposed and internal timestamps are stripped.
 */
export const GET = withAuthHandler(async (req: Request) => {
  const limit = await rateLimit(`public:homepage:${getClientIp(req)}`, 60, 60_000);
  if (!limit.success) return fail("Too many requests", 429);

  const sections = await prisma.homepageSection.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { sectionKey: true, order: true, content: true },
  });

  return ok(sections);
});
