import { prisma } from "@/lib/prisma";
import { withAuthHandler, getClientIp } from "@/lib/auth-helpers";
import { rateLimit } from "@/lib/rate-limit";
import { ok, fail } from "@/lib/api-response";

export const dynamic = "force-dynamic";

/**
 * GET /api/public/company — public company profile used across the marketing
 * site (header, footer, contact page). Returns only display-safe fields.
 */
export const GET = withAuthHandler(async (req: Request) => {
  const limit = await rateLimit(`public:company:${getClientIp(req)}`, 60, 60_000);
  if (!limit.success) return fail("Too many requests", 429);

  const settings = await prisma.companySettings.findUnique({
    where: { id: "singleton" },
    select: {
      companyName: true,
      tagline: true,
      logo: true,
      darkLogo: true,
      favicon: true,
      email: true,
      phone: true,
      whatsapp: true,
      address: true,
      businessHours: true,
      socialLinks: true,
      seoDefaults: true,
    },
  });

  // Sensible defaults if settings haven't been initialised yet.
  return ok(
    settings ?? {
      companyName: "CreativeDox",
      tagline: null,
      logo: null,
      darkLogo: null,
      favicon: null,
      email: null,
      phone: null,
      whatsapp: null,
      address: {},
      businessHours: {},
      socialLinks: {},
      seoDefaults: {},
    },
  );
});
