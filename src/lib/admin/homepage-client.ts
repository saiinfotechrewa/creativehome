import { z } from "zod";

import type { IconName } from "@/lib/icons";

/**
 * Client-safe schemas, types, defaults, query keys and fetchers for the
 * Homepage Content Editor (`/admin/content/homepage`).
 *
 * The backend stores each section as a `HomepageSection` row with a freeform
 * JSON `content` blob (see /api/admin/content/homepage). This module defines a
 * typed contract for that blob per section so react-hook-form gets real field
 * paths and Zod validation, plus rich defaults mirrored from the public site so
 * a freshly-seeded section already renders meaningful copy.
 *
 * No server-only imports here — safe to use from "use client" components.
 */

// ───────────────────────────── Shared field schemas ─────────────────────────

/** A Lucide icon name from the central registry (`@/lib/icons`). */
const iconSchema = z.string().min(1, "Pick an icon");

/** A call-to-action button: visible text + destination. */
const ctaSchema = z.object({
  text: z.string().min(1, "Button text is required").max(60),
  link: z.string().min(1, "Link is required").max(200),
});

/** A Tailwind text-colour class (e.g. `text-sky-400`). */
const colorSchema = z.string().min(1, "Pick a colour").max(40);

/** An animated counter: icon + numeric value + suffix + label. */
const counterSchema = z.object({
  icon: iconSchema,
  value: z.coerce.number({ invalid_type_error: "Enter a number" }).min(0),
  suffix: z.string().max(8),
  label: z.string().min(1, "Label is required").max(60),
});

/** A solution / industry card. */
const cardSchema = z.object({
  icon: iconSchema,
  title: z.string().min(1, "Title is required").max(80),
  description: z.string().min(1, "Description is required").max(320),
  link: z.string().max(200),
  color: colorSchema,
});

// ─────────────────────────────── Section schemas ────────────────────────────

export const heroSchema = z.object({
  badge: z.string().max(120),
  headline: z.string().min(1, "Headline is required").max(160),
  highlight: z.string().max(120),
  subheadline: z.string().max(400),
  ctaPrimary: ctaSchema,
  ctaSecondary: ctaSchema,
  trustLine: z.string().max(160),
  nodes: z
    .array(z.object({ label: z.string().min(1, "Label required").max(40), icon: iconSchema }))
    .max(12, "Up to 12 nodes"),
});

export const trustBarSchema = z.object({
  counters: z.array(counterSchema).min(1, "Add at least one counter").max(8),
});

export const solutionsSchema = z.object({
  heading: z.string().min(1, "Heading is required").max(120),
  subheading: z.string().max(300),
  items: z.array(cardSchema).min(1, "Add at least one card"),
});

/** Industries use the same shape as solutions. */
export const industriesSchema = solutionsSchema;

export const processSchema = z.object({
  heading: z.string().min(1, "Heading is required").max(120),
  subheading: z.string().max(300),
  steps: z
    .array(
      z.object({
        number: z.coerce.number().int().min(1).max(99),
        icon: iconSchema,
        title: z.string().min(1, "Title is required").max(80),
        description: z.string().min(1, "Description is required").max(320),
      }),
    )
    .min(1, "Add at least one step"),
});

export const whyChooseUsSchema = z.object({
  heading: z.string().min(1, "Heading is required").max(120),
  subheading: z.string().max(300),
  items: z
    .array(
      z.object({
        icon: iconSchema,
        title: z.string().min(1, "Title is required").max(80),
        description: z.string().min(1, "Description is required").max(320),
        color: colorSchema,
      }),
    )
    .min(1, "Add at least one advantage"),
});

export const statsSchema = z.object({
  heading: z.string().max(120),
  subheading: z.string().max(300),
  items: z.array(counterSchema).min(1, "Add at least one stat"),
});

export const finalCtaSchema = z.object({
  headline: z.string().min(1, "Headline is required").max(160),
  highlight: z.string().max(120),
  subheadline: z.string().max(400),
  ctaPrimary: ctaSchema,
  ctaSecondary: ctaSchema,
  whatsapp: z.string().max(160),
});

export const logoMarqueeSchema = z.object({
  heading: z.string().max(120),
  logos: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required").max(60),
        image: z.string().max(400),
      }),
    )
    .min(1, "Add at least one logo"),
});

// ─────────────────────────────── Inferred types ─────────────────────────────

export type HeroContent = z.infer<typeof heroSchema>;
export type TrustBarContent = z.infer<typeof trustBarSchema>;
export type SolutionsContent = z.infer<typeof solutionsSchema>;
export type IndustriesContent = z.infer<typeof industriesSchema>;
export type ProcessContent = z.infer<typeof processSchema>;
export type WhyChooseUsContent = z.infer<typeof whyChooseUsSchema>;
export type StatsContent = z.infer<typeof statsSchema>;
export type FinalCtaContent = z.infer<typeof finalCtaSchema>;
export type LogoMarqueeContent = z.infer<typeof logoMarqueeSchema>;

// ─────────────────────────────── Defaults ───────────────────────────────────
// Mirrors the public site so a freshly-seeded section renders real copy.

const i = (name: IconName) => name; // tiny helper for type-checked icon names

export const HERO_DEFAULT: HeroContent = {
  badge: "Business Software & Automation Platform",
  headline: "Transform Your Business With",
  highlight: "Smart Software & Automation",
  subheadline:
    "CRM, Accounting, Attendance, WhatsApp Automation, Marketing Tools — ready-to-use cloud software and custom development for growing businesses.",
  ctaPrimary: { text: "Explore Solutions", link: "/#solutions" },
  ctaSecondary: { text: "Book Free Consultation", link: "/#contact" },
  trustLine: "Trusted by 500+ businesses across India",
  nodes: [
    { label: "CRM", icon: i("users") },
    { label: "Accounting", icon: i("calculator") },
    { label: "Attendance", icon: i("calendar-clock") },
    { label: "WhatsApp", icon: i("message-circle") },
    { label: "Marketing", icon: i("megaphone") },
    { label: "ERP", icon: i("network") },
  ],
};

export const TRUST_BAR_DEFAULT: TrustBarContent = {
  counters: [
    { icon: i("building"), value: 500, suffix: "+", label: "Businesses Served" },
    { icon: i("package"), value: 10, suffix: "+", label: "Software Products" },
    { icon: i("users"), value: 50000, suffix: "+", label: "Active Users" },
    { icon: i("shield"), value: 99.9, suffix: "%", label: "Uptime Guarantee" },
    { icon: i("headphones"), value: 24, suffix: "/7", label: "Support Available" },
  ],
};

export const SOLUTIONS_DEFAULT: SolutionsContent = {
  heading: "Software for Every Business Need",
  subheading:
    "Ready-to-use products plus custom development — pick what you need today and add more as you grow.",
  items: [
    {
      icon: i("calendar-clock"),
      title: "Attendance Management",
      description:
        "Biometric and mobile attendance with leave and payroll built in.",
      link: "/solutions/attendance-management",
      color: "text-sky-400",
    },
    {
      icon: i("users"),
      title: "CRM Software",
      description: "Every lead, customer, and deal in one organized pipeline.",
      link: "/solutions/crm-software",
      color: "text-violet-400",
    },
    {
      icon: i("calculator"),
      title: "Accounting & Inventory",
      description:
        "GST billing, stock control, and financial reports in one place.",
      link: "/solutions/accounting-inventory",
      color: "text-emerald-400",
    },
    {
      icon: i("message-circle"),
      title: "WhatsApp Automation",
      description:
        "Bulk campaigns, auto-replies, and customer engagement on WhatsApp.",
      link: "/solutions/whatsapp-automation",
      color: "text-green-400",
    },
  ],
};

export const INDUSTRIES_DEFAULT: IndustriesContent = {
  heading: "Built for Your Industry",
  subheading:
    "From retail counters to factory floors — software shaped around how your business actually runs.",
  items: [
    {
      icon: i("store"),
      title: "Retail & Shops",
      description:
        "GST invoicing, barcode POS, stock alerts, and WhatsApp offers that bring customers back.",
      link: "/industries/retail",
      color: "text-orange-400",
    },
    {
      icon: i("graduation-cap"),
      title: "Schools & Education",
      description:
        "Fees, attendance, exams, and a parent portal that keeps families in the loop.",
      link: "/industries/schools-education",
      color: "text-indigo-400",
    },
    {
      icon: i("tv"),
      title: "Cable TV Operators",
      description:
        "Subscriber packages, monthly billing, and agent-wise collection tracking.",
      link: "/industries/cable-tv-operators",
      color: "text-rose-400",
    },
    {
      icon: i("factory"),
      title: "Manufacturing",
      description:
        "Purchase to production to dispatch on one system — BOM, godown stock, and MIS.",
      link: "/industries/manufacturing",
      color: "text-cyan-400",
    },
  ],
};

export const PROCESS_DEFAULT: ProcessContent = {
  heading: "How It Works",
  subheading: "A simple, proven path from first call to measurable growth.",
  steps: [
    {
      number: 1,
      icon: i("search"),
      title: "Understand Your Business",
      description:
        "We study your current processes, pain points, and goals through a free consultation.",
    },
    {
      number: 2,
      icon: i("pen-tool"),
      title: "Design the Right Solution",
      description:
        "We recommend the perfect combination of products and customizations for your needs.",
    },
    {
      number: 3,
      icon: i("zap"),
      title: "Automate Operations",
      description:
        "We deploy, configure, and train your team so you're productive from day one.",
    },
    {
      number: 4,
      icon: i("trending-up"),
      title: "Scale Your Growth",
      description:
        "With data-driven insights and automation, watch your business grow faster.",
    },
  ],
};

export const WHY_CHOOSE_US_DEFAULT: WhyChooseUsContent = {
  heading: "Why Businesses Choose CreativeDox",
  subheading: "Enterprise capability with the care and pricing of a partner.",
  items: [
    {
      icon: i("target"),
      title: "Business-Focused Design",
      description:
        "Every feature solves a real business problem, not just demo fluff.",
      color: "text-sky-400",
    },
    {
      icon: i("indian-rupee"),
      title: "Affordable Pricing",
      description:
        "Enterprise features at startup-friendly prices. No hidden costs.",
      color: "text-emerald-400",
    },
    {
      icon: i("headphones"),
      title: "Dedicated Support",
      description:
        "Real humans on WhatsApp, phone, email. Avg response: under 2 hours.",
      color: "text-violet-400",
    },
    {
      icon: i("palette"),
      title: "Fully Customizable",
      description:
        "Start with a ready product. Customize as your business grows.",
      color: "text-fuchsia-400",
    },
    {
      icon: i("cloud"),
      title: "Cloud-First Platform",
      description:
        "Access from anywhere. Auto backups. 99.9% uptime guaranteed.",
      color: "text-cyan-400",
    },
    {
      icon: i("shield"),
      title: "Secure Infrastructure",
      description:
        "Bank-grade encryption, security audits, complete data privacy.",
      color: "text-orange-400",
    },
  ],
};

export const STATS_DEFAULT: StatsContent = {
  heading: "Numbers That Speak",
  subheading: "Real impact for real businesses across India.",
  items: [
    { icon: i("building"), value: 500, suffix: "+", label: "Businesses Served" },
    { icon: i("users"), value: 50000, suffix: "+", label: "Active Users" },
    { icon: i("package"), value: 200, suffix: "+", label: "Projects Delivered" },
    { icon: i("zap"), value: 1000000, suffix: "+", label: "Automations Running" },
  ],
};

export const FINAL_CTA_DEFAULT: FinalCtaContent = {
  headline: "Ready to automate your business?",
  highlight: "automate",
  subheadline: "Talk to our team and get a tailored recommendation — free.",
  ctaPrimary: { text: "Book a free consultation", link: "/book-consultation" },
  ctaSecondary: { text: "Explore products", link: "/#products" },
  whatsapp: "Prefer WhatsApp? Message us at +91 90000 00000",
};

export const LOGO_MARQUEE_DEFAULT: LogoMarqueeContent = {
  heading: "Powering businesses with trusted technology",
  logos: [
    { name: "Google Cloud", image: "" },
    { name: "AWS", image: "" },
    { name: "WhatsApp Business", image: "" },
    { name: "Razorpay", image: "" },
    { name: "Meta", image: "" },
    { name: "Tally", image: "" },
    { name: "Twilio", image: "" },
    { name: "Vercel", image: "" },
  ],
};

// ─────────────────────────────── Section registry ───────────────────────────

export type SectionKey =
  | "hero"
  | "trustBar"
  | "solutions"
  | "industries"
  | "process"
  | "whyChooseUs"
  | "stats"
  | "finalCta"
  | "logoMarquee"
  | "testimonials";

export interface SectionMeta {
  key: SectionKey;
  label: string;
  description: string;
}

/** Canonical order + metadata for every editable homepage section. */
export const SECTIONS: SectionMeta[] = [
  { key: "hero", label: "Hero", description: "Headline, CTAs and network nodes" },
  { key: "trustBar", label: "Trust Bar", description: "Animated metric counters under the hero" },
  { key: "solutions", label: "Solutions", description: "Software solution cards" },
  { key: "industries", label: "Industries", description: "Industry vertical cards" },
  { key: "process", label: "Process", description: "How-it-works steps" },
  { key: "whyChooseUs", label: "Why Choose Us", description: "Advantage cards" },
  { key: "stats", label: "Stats", description: "Headline metric counters" },
  { key: "finalCta", label: "Final CTA", description: "Closing call-to-action band" },
  { key: "logoMarquee", label: "Logo Marquee", description: "Partner / tech logos" },
  { key: "testimonials", label: "Testimonials", description: "Managed in the Testimonials manager" },
];

// ─────────────────────────────── Types & helpers ────────────────────────────

export interface HomepageSection {
  id: string;
  sectionKey: string;
  isActive: boolean;
  order: number;
  content: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SectionSavePayload {
  content?: Record<string, unknown>;
  isActive?: boolean;
  order?: number;
}

/**
 * Deep-merge a stored content blob over a defaults object so missing keys never
 * break a form. Plain objects merge recursively; arrays and primitives from the
 * stored value win outright (we never merge array elements).
 */
export function mergeContent<T extends Record<string, unknown>>(
  defaults: T,
  stored: unknown,
): T {
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
    return defaults;
  }
  const out: Record<string, unknown> = { ...defaults };
  for (const [key, dValue] of Object.entries(defaults)) {
    const sValue = (stored as Record<string, unknown>)[key];
    if (sValue === undefined) continue;
    if (
      dValue &&
      typeof dValue === "object" &&
      !Array.isArray(dValue) &&
      sValue &&
      typeof sValue === "object" &&
      !Array.isArray(sValue)
    ) {
      out[key] = mergeContent(
        dValue as Record<string, unknown>,
        sValue,
      );
    } else {
      out[key] = sValue;
    }
  }
  return out as T;
}

// ─────────────────────────────── Query keys ─────────────────────────────────

export const homepageKeys = {
  all: ["admin", "homepage"] as const,
  section: (key: string) => ["admin", "homepage", key] as const,
};

// ─────────────────────────────── Fetchers ───────────────────────────────────

async function unwrap<T>(res: Response, fallback: string): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? fallback);
  }
  return (json as { data: T }).data;
}

/** GET all sections in display order. */
export async function fetchSections(): Promise<HomepageSection[]> {
  const res = await fetch("/api/admin/content/homepage");
  return unwrap<HomepageSection[]>(res, "Failed to load homepage sections");
}

/** Upsert one section by key (content / isActive / order). */
export async function saveSection(
  key: string,
  payload: SectionSavePayload,
): Promise<HomepageSection> {
  const res = await fetch(`/api/admin/content/homepage/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return unwrap<HomepageSection>(res, "Failed to save section");
}

/** Persist a new section order (array of section keys). */
export async function reorderSections(
  order: string[],
): Promise<HomepageSection[]> {
  const res = await fetch("/api/admin/content/homepage/reorder", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order }),
  });
  return unwrap<HomepageSection[]>(res, "Failed to reorder sections");
}
