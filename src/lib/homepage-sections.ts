/**
 * Client-safe contracts for the Homepage CMS bridge.
 *
 * The public homepage sections (`src/components/sections/*`) historically read
 * hardcoded data from `src/data/*`. This module defines the normalized prop
 * shapes each section accepts so the *server* loader
 * (`src/lib/homepage-content.ts`) can feed DB-authored content into them, while
 * the components fall back to their `src/data` defaults whenever a prop is
 * absent.
 *
 * It also carries the colour-derivation helpers used to turn an editor-authored
 * Tailwind text class (e.g. `text-sky-400`) into the `hex` + `gradient` the
 * animated cards need — fields the CMS editor doesn't store directly.
 *
 * No server-only imports here: safe to import from "use client" components AND
 * from the server loader.
 */

// ──────────────────────────── Colour derivation ─────────────────────────────

/** Tailwind `text-<name>-400` → hex, covering every accent used on the site. */
const TEXT_HEX: Record<string, string> = {
  "text-sky-400": "#38bdf8",
  "text-blue-400": "#60a5fa",
  "text-violet-400": "#a78bfa",
  "text-purple-400": "#c084fc",
  "text-indigo-400": "#818cf8",
  "text-emerald-400": "#34d399",
  "text-green-400": "#4ade80",
  "text-teal-400": "#2dd4bf",
  "text-cyan-400": "#22d3ee",
  "text-orange-400": "#fb923c",
  "text-amber-400": "#fbbf24",
  "text-yellow-400": "#facc15",
  "text-rose-400": "#fb7185",
  "text-pink-400": "#f472b6",
  "text-red-400": "#f87171",
  "text-fuchsia-400": "#e879f9",
  "text-primary": "#3b82f6",
};

/** Tailwind `text-<name>-400` → a matching `from-… to-…` gradient pair. */
const TEXT_GRADIENT: Record<string, string> = {
  "text-sky-400": "from-sky-500 to-blue-600",
  "text-blue-400": "from-blue-500 to-indigo-600",
  "text-violet-400": "from-violet-500 to-purple-600",
  "text-purple-400": "from-purple-500 to-fuchsia-600",
  "text-indigo-400": "from-indigo-500 to-blue-600",
  "text-emerald-400": "from-emerald-500 to-teal-600",
  "text-green-400": "from-green-500 to-emerald-600",
  "text-teal-400": "from-teal-500 to-emerald-600",
  "text-cyan-400": "from-cyan-500 to-sky-600",
  "text-orange-400": "from-orange-500 to-amber-600",
  "text-amber-400": "from-amber-500 to-orange-600",
  "text-yellow-400": "from-yellow-500 to-amber-600",
  "text-rose-400": "from-rose-500 to-pink-600",
  "text-pink-400": "from-pink-500 to-rose-600",
  "text-red-400": "from-red-500 to-rose-600",
  "text-fuchsia-400": "from-fuchsia-500 to-purple-600",
  "text-primary": "from-primary to-secondary",
};

const DEFAULT_HEX = "#3b82f6";
const DEFAULT_GRADIENT = "from-primary to-secondary";

export function hexFromColor(color: string | undefined): string {
  if (!color) return DEFAULT_HEX;
  return TEXT_HEX[color] ?? DEFAULT_HEX;
}

export function gradientFromColor(color: string | undefined): string {
  if (!color) return DEFAULT_GRADIENT;
  return TEXT_GRADIENT[color] ?? DEFAULT_GRADIENT;
}

// ──────────────────────────── Normalized prop shapes ────────────────────────

/** A section's heading block (drives `SectionHeading`). */
export interface SectionHeadingContent {
  title: string;
  description: string;
}

export interface CtaContent {
  text: string;
  link: string;
}

/** A solution / industry / advantage card, fully resolved for rendering. */
export interface CardContent {
  icon: string;
  title: string;
  description: string;
  link: string;
  color: string;
  hex: string;
  gradient: string;
}

/** An animated counter (trust bar / stats). */
export interface CounterContent {
  icon: string;
  value: number;
  suffix: string;
  label: string;
  color: string;
  hex: string;
  gradient: string;
}

export interface HeroContentProps {
  badge: string;
  headline: string;
  highlight: string;
  subheadline: string;
  ctaPrimary: CtaContent;
  ctaSecondary: CtaContent;
  trustLine: string;
}

export interface FinalCtaContentProps {
  badge: string;
  headline: string;
  highlight: string;
  subheadline: string;
  ctaPrimary: CtaContent;
  ctaSecondary: CtaContent;
  whatsapp: string;
}

export interface CardSectionContent {
  heading: SectionHeadingContent;
  items: CardContent[];
}

export interface CounterSectionContent {
  heading?: SectionHeadingContent;
  items: CounterContent[];
}

export interface ProcessStepContent {
  number: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface ProcessSectionContent {
  heading: SectionHeadingContent;
  steps: ProcessStepContent[];
}

export interface LogoMarqueeContentProps {
  heading: string;
  logos: { name: string }[];
}

// ──────────────────────────── Tolerant field readers ────────────────────────

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Read one card from either the CMS-editor shape ({title, description, link})
 * or the legacy `src/data` shape ({title, shortDescription/name, href}).
 * Returns `null` when there's nothing renderable so callers can skip it.
 */
export function normalizeCard(raw: unknown): CardContent | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const title = str(r.title) || str(r.name);
  if (!title) return null;
  const color = str(r.color, "text-primary");
  return {
    icon: str(r.icon, "circle-help"),
    title,
    description: str(r.description) || str(r.shortDescription),
    link: str(r.link) || str(r.href) || "#",
    color,
    hex: str(r.hex) || hexFromColor(color),
    gradient: str(r.gradient) || gradientFromColor(color),
  };
}

export function normalizeCounter(raw: unknown): CounterContent | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const label = str(r.label);
  if (!label) return null;
  const color = str(r.color, "text-primary");
  return {
    icon: str(r.icon, "circle-help"),
    value: num(r.value),
    suffix: str(r.suffix),
    label,
    color,
    hex: str(r.hex) || hexFromColor(color),
    gradient: str(r.gradient) || gradientFromColor(color),
  };
}

export function normalizeStep(raw: unknown, index: number): ProcessStepContent | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const title = str(r.title);
  if (!title) return null;
  return {
    number: num(r.number ?? r.step, index + 1),
    icon: str(r.icon, "circle-help"),
    title,
    description: str(r.description),
    color: str(r.color, "text-primary"),
  };
}
