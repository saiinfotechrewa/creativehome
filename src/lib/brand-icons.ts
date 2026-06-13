import {
  siClaude,
  siDocker,
  siFastapi,
  siGraphql,
  siLangchain,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siPython,
  siRazorpay,
  siReact,
  siRedis,
  siStripe,
  siTailwindcss,
  siTypescript,
  siWhatsapp,
} from "simple-icons";

/** A brand glyph resolved from Simple Icons. */
export interface BrandIcon {
  /** SVG path data drawn in a 24×24 viewBox. */
  path: string;
  /** Official brand hex, without the leading `#`. */
  hex: string;
}

/**
 * Maps a technology name (exactly as written in the services data layer)
 * to its official Simple Icons glyph. Names that are absent — e.g. "AWS",
 * "OpenAI", "Tally", "REST", "Webhooks", "Vector DB" — have no trademarked
 * brand mark in the set and fall back to a monogram chip in `BrandGlyph`.
 */
export const BRAND_ICONS: Record<string, BrandIcon> = {
  "Next.js": siNextdotjs,
  React: siReact,
  TypeScript: siTypescript,
  "Node.js": siNodedotjs,
  PostgreSQL: siPostgresql,
  Prisma: siPrisma,
  "Tailwind CSS": siTailwindcss,
  Redis: siRedis,
  Stripe: siStripe,
  Razorpay: siRazorpay,
  Docker: siDocker,
  Python: siPython,
  n8n: siN8n,
  "WhatsApp API": siWhatsapp,
  GraphQL: siGraphql,
  LangChain: siLangchain,
  FastAPI: siFastapi,
  Claude: siClaude,
};

/** Resolve a technology name to its brand glyph, or `undefined`. */
export function getBrandIcon(name: string): BrandIcon | undefined {
  return BRAND_ICONS[name];
}
