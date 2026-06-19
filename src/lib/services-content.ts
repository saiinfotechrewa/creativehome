import { prisma } from "@/lib/prisma";
import type { IconName, ServiceCard, ServiceDetail } from "@/lib/types";
import {
  SERVICE_CARDS,
  getServiceDetail as getStaticServiceDetail,
  getServiceSlugs as getStaticServiceSlugs,
} from "@/data/services";

/**
 * Server-side Services CMS bridge.
 *
 * The public services pages historically read the hardcoded `src/data/services`
 * arrays, so editing a Service in the admin had no effect on the site. These
 * readers resolve the `Service` table into the exact `ServiceCard`/`ServiceDetail`
 * shapes the public components already accept, and fall back to the static data
 * when the table is empty or the DB is unreachable — so the site never hard-fails.
 *
 * Field packing (mirrored by `prisma/seed-services.ts`):
 *   row.hero          → { eyebrow, headline, heroDescription, hex, gradient, cta, href }
 *   row.pricingModel  → { tiers: ServicePricingModel[], caseStudy: ServiceCaseStudy }
 *   row.seo           → { title, description }
 */

type Json = Record<string, unknown>;

function obj(v: unknown): Json {
  return v && typeof v === "object" ? (v as Json) : {};
}
function str(v: unknown, fallback = ""): string {
  return typeof v === "string" && v.length > 0 ? v : fallback;
}
function list<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

const DEFAULT_HEX = "#38bdf8";
const DEFAULT_GRADIENT = "from-sky-500 to-blue-600";

/** Service overview cards (/services), DB-driven with static fallback. */
export async function getServiceCards(): Promise<ServiceCard[]> {
  try {
    const rows = await prisma.service.findMany({
      where: { status: "ACTIVE" },
      orderBy: { order: "asc" },
    });
    if (rows.length === 0) return SERVICE_CARDS;
    return rows.map((r) => {
      const hero = obj(r.hero);
      return {
        id: r.slug,
        title: r.name,
        description: r.description ?? "",
        icon: (r.icon ?? "code") as IconName,
        color: r.color ?? "text-sky-400",
        hex: str(hero.hex, DEFAULT_HEX),
        gradient: str(hero.gradient, DEFAULT_GRADIENT),
        href: str(hero.href, `/services/${r.slug}`),
        cta: str(hero.cta, "Explore service"),
      };
    });
  } catch {
    return SERVICE_CARDS;
  }
}

/** A single service detail (/services/[slug]), DB-driven with static fallback. */
export async function getServiceDetail(
  slug: string,
): Promise<ServiceDetail | undefined> {
  try {
    const r = await prisma.service.findUnique({ where: { slug } });
    if (!r || r.status === "ARCHIVED") return getStaticServiceDetail(slug);
    const hero = obj(r.hero);
    const pm = obj(r.pricingModel);
    const seo = obj(r.seo);
    return {
      slug: r.slug,
      title: r.name,
      eyebrow: str(hero.eyebrow, r.name),
      headline: str(hero.headline),
      heroDescription: str(hero.heroDescription, r.description ?? ""),
      metaTitle: str(seo.title, r.name),
      metaDescription: str(seo.description),
      icon: (r.icon ?? "code") as IconName,
      color: r.color ?? "text-sky-400",
      hex: str(hero.hex, DEFAULT_HEX),
      gradient: str(hero.gradient, DEFAULT_GRADIENT),
      deliverables: list(r.deliverables) as ServiceDetail["deliverables"],
      process: list(r.process) as ServiceDetail["process"],
      technologies: list<string>(r.technologies),
      caseStudy: (pm.caseStudy ?? {
        client: "",
        industry: "",
        challenge: "",
        outcome: "",
        metrics: [],
      }) as ServiceDetail["caseStudy"],
      pricing: list(pm.tiers) as ServiceDetail["pricing"],
    };
  } catch {
    return getStaticServiceDetail(slug);
  }
}

/** Every service slug — DB-driven with static fallback. */
export async function getServiceSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.service.findMany({
      where: { status: { not: "ARCHIVED" } },
      select: { slug: true },
    });
    if (rows.length > 0) return rows.map((r) => r.slug);
    return getStaticServiceSlugs();
  } catch {
    return getStaticServiceSlugs();
  }
}
