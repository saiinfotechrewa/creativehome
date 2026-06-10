import type { Stat } from "@/lib/types";

/** Company-wide constants and metadata. */
export const SITE_CONFIG = {
  name: "CreativeDox",
  shortName: "CreativeDox",
  description:
    "CreativeDox builds custom business software and automation that helps teams ship faster, cut busywork, and scale operations.",
  tagline: "Business software & automation, engineered to scale.",
  url: "https://creativedox.com",
  email: "hello@creativedox.com",
  phone: "+1 (555) 010-2400",
  address: "Remote-first · Worldwide",
  ogImage: "/og.png",
  keywords: [
    "business software",
    "automation",
    "SaaS development",
    "workflow automation",
    "custom software",
    "CreativeDox",
  ],
} as const;

/** Social profiles used in the footer. */
export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/creativedox",
  linkedin: "https://linkedin.com/company/creativedox",
  github: "https://github.com/creativedox",
  youtube: "https://youtube.com/@creativedox",
} as const;

/** Headline metrics used in the social-proof strip. */
export const COMPANY_STATS: Stat[] = [
  { label: "Workflows automated", value: "12M+", description: "Tasks run on autopilot every month" },
  { label: "Teams onboarded", value: "480+", description: "From startups to enterprises" },
  { label: "Avg. time saved", value: "32 hrs", description: "Per team, per week" },
  { label: "Uptime", value: "99.99%", description: "Across all managed services" },
];

/** Shared animation timing tokens for Framer Motion. */
export const MOTION = {
  ease: [0.16, 1, 0.3, 1] as const,
  duration: 0.6,
  stagger: 0.08,
} as const;
