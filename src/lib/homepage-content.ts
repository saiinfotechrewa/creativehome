import { prisma } from "@/lib/prisma";
import {
  type HeroContentProps,
  type FinalCtaContentProps,
  type CardContent,
  type CounterContent,
  type ProcessStepContent,
  type SectionHeadingContent,
  normalizeCard,
  normalizeCounter,
  normalizeStep,
} from "@/lib/homepage-sections";

/**
 * Server-side Homepage CMS bridge.
 *
 * Reads the active `HomepageSection` rows and resolves each into the normalized
 * prop shape the public section components accept. Three historical content
 * shapes exist for these rows (the original seed, the CMS editor, and the rich
 * `src/data` exports), so every reader here is deliberately tolerant and
 * returns `null` for any section it can't render — the component then falls
 * back to its built-in `src/data` defaults. A DB outage degrades to the same
 * fallback (all sections visible, all static), so the marketing site never
 * hard-fails on a content problem.
 */

export interface HomepageContent {
  /** True when the section should render (defaults to true when no row). */
  isActive(key: string): boolean;
  hero: HeroContentProps | null;
  finalCta: FinalCtaContentProps | null;
  solutions: CardSection | null;
  industries: CardSection | null;
  whyChooseUs: CardSection | null;
  process: ProcessSection | null;
  trustBar: CounterContent[] | null;
  stats: CounterSection | null;
  logoMarquee: { heading: string; logos: { name: string }[] } | null;
}

interface CardSection {
  heading: SectionHeadingContent | null;
  items: CardContent[];
}
interface CounterSection {
  heading: SectionHeadingContent | null;
  items: CounterContent[];
}
interface ProcessSection {
  heading: SectionHeadingContent | null;
  steps: ProcessStepContent[];
}

type Json = Record<string, unknown>;

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

/** Read a heading block, tolerating editor (`heading`) and seed (`title`). */
function readHeading(c: Json): SectionHeadingContent | null {
  const title = str(c.heading) || str(c.title);
  const description = str(c.subheading) || str(c.subtitle) || str(c.description);
  if (!title && !description) return null;
  return { title, description };
}

/** A CTA from either {text,link} (editor) or {label,href} (seed). */
function readCta(v: unknown, fallback: { text: string; link: string }) {
  if (!v || typeof v !== "object") return fallback;
  const r = v as Json;
  return {
    text: str(r.text) || str(r.label) || fallback.text,
    link: str(r.link) || str(r.href) || fallback.link,
  };
}

/**
 * Resolve a card list. Returns `null` (→ static fallback) unless every item
 * carries an `icon`, which distinguishes a fully-authored list from a partial
 * legacy blob that would render without accent colours.
 */
function readCards(items: unknown): CardContent[] | null {
  if (!Array.isArray(items) || items.length === 0) return null;
  if (!items.every((i) => i && typeof i === "object" && str((i as Json).icon)))
    return null;
  const cards = items.map(normalizeCard).filter((c): c is CardContent => c !== null);
  return cards.length > 0 ? cards : null;
}

function readCounters(items: unknown): CounterContent[] | null {
  if (!Array.isArray(items) || items.length === 0) return null;
  if (!items.every((i) => i && typeof i === "object" && str((i as Json).icon)))
    return null;
  const counters = items
    .map(normalizeCounter)
    .filter((c): c is CounterContent => c !== null);
  return counters.length > 0 ? counters : null;
}

function readSteps(steps: unknown): ProcessStepContent[] | null {
  if (!Array.isArray(steps) || steps.length === 0) return null;
  if (!steps.every((s) => s && typeof s === "object" && str((s as Json).icon)))
    return null;
  const out = steps
    .map((s, i) => normalizeStep(s, i))
    .filter((s): s is ProcessStepContent => s !== null);
  return out.length > 0 ? out : null;
}

const EMPTY: HomepageContent = {
  isActive: () => true,
  hero: null,
  finalCta: null,
  solutions: null,
  industries: null,
  whyChooseUs: null,
  process: null,
  trustBar: null,
  stats: null,
  logoMarquee: null,
};

export async function getHomepageContent(): Promise<HomepageContent> {
  let rows: { sectionKey: string; isActive: boolean; content: unknown }[];
  try {
    rows = await prisma.homepageSection.findMany({
      select: { sectionKey: true, isActive: true, content: true },
    });
  } catch {
    // DB unavailable at build/runtime — degrade to the fully-static homepage.
    return EMPTY;
  }

  const byKey = new Map<string, Json>();
  const active = new Map<string, boolean>();
  for (const row of rows) {
    active.set(row.sectionKey, row.isActive);
    byKey.set(
      row.sectionKey,
      row.content && typeof row.content === "object"
        ? (row.content as Json)
        : {},
    );
  }

  const get = (key: string): Json | undefined => byKey.get(key);

  const heroRaw = get("hero");
  const hero: HeroContentProps | null = heroRaw
    ? {
        badge: str(heroRaw.badge) || str(heroRaw.eyebrow),
        headline: str(heroRaw.headline) || str(heroRaw.title),
        highlight: str(heroRaw.highlight),
        subheadline: str(heroRaw.subheadline) || str(heroRaw.subtitle),
        ctaPrimary: readCta(heroRaw.ctaPrimary, {
          text: "Explore Solutions",
          link: "/#solutions",
        }),
        ctaSecondary: readCta(heroRaw.ctaSecondary, {
          text: "Book Free Consultation",
          link: "/#contact",
        }),
        trustLine: str(heroRaw.trustLine),
      }
    : null;
  // Require at least a headline to take over the animated hero.
  const heroOut = hero && hero.headline ? hero : null;

  const finalRaw = get("finalCta");
  const finalCta: FinalCtaContentProps | null =
    finalRaw && (str(finalRaw.headline) || str(finalRaw.title))
      ? {
          badge: str(finalRaw.badge, "Get Started"),
          headline: str(finalRaw.headline) || str(finalRaw.title),
          highlight: str(finalRaw.highlight),
          subheadline: str(finalRaw.subheadline) || str(finalRaw.subtitle),
          ctaPrimary: readCta(finalRaw.ctaPrimary ?? finalRaw.cta, {
            text: "Schedule Free Consultation",
            link: "/book-consultation",
          }),
          ctaSecondary: readCta(finalRaw.ctaSecondary, {
            text: "Explore All Products",
            link: "/#products",
          }),
          whatsapp: str(finalRaw.whatsapp),
        }
      : null;

  const cardSection = (key: string): CardSection | null => {
    const c = get(key);
    if (!c) return null;
    const items = readCards(c.items);
    if (!items) return null;
    return { heading: readHeading(c), items };
  };

  const processRaw = get("process");
  const processSection: ProcessSection | null = (() => {
    if (!processRaw) return null;
    const steps = readSteps(processRaw.steps ?? processRaw.items);
    if (!steps) return null;
    return { heading: readHeading(processRaw), steps };
  })();

  const trustRaw = get("trustBar");
  const trustBar = trustRaw ? readCounters(trustRaw.counters ?? trustRaw.items) : null;

  const statsRaw = get("stats");
  const statsSection: CounterSection | null = (() => {
    if (!statsRaw) return null;
    const items = readCounters(statsRaw.items ?? statsRaw.counters);
    if (!items) return null;
    return { heading: readHeading(statsRaw), items };
  })();

  const logoRaw = get("logoMarquee");
  const logoMarquee = (() => {
    if (!logoRaw || !Array.isArray(logoRaw.logos)) return null;
    const logos = (logoRaw.logos as unknown[])
      .map((l) => (l && typeof l === "object" ? str((l as Json).name) : ""))
      .filter((n) => n.length > 0)
      .map((name) => ({ name }));
    if (logos.length === 0) return null;
    return { heading: str(logoRaw.heading), logos };
  })();

  return {
    isActive: (key: string) => active.get(key) ?? true,
    hero: heroOut,
    finalCta,
    solutions: cardSection("solutions"),
    industries: cardSection("industries"),
    whyChooseUs: cardSection("whyChooseUs"),
    process: processSection,
    trustBar,
    stats: statsSection,
    logoMarquee,
  };
}
