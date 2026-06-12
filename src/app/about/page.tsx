import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { OurStory } from "@/components/about/our-story";
import { MissionVisionValues } from "@/components/about/mission-vision-values";
import { WhatWeDo } from "@/components/about/what-we-do";
import { Stats } from "@/components/sections/stats";
import { AboutCTA } from "@/components/about/about-cta";
import { SITE_CONFIG } from "@/lib/constants";

const TITLE = "About Us";
const DESCRIPTION =
  "CreativeDox is an India-based product studio building ready-to-use business software and automation — CRM, GST accounting, attendance, WhatsApp marketing, and custom development. Meet the team and the mission behind it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_CONFIG.url}/about` },
  openGraph: {
    title: `${TITLE} | ${SITE_CONFIG.name}`,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/about`,
    siteName: SITE_CONFIG.name,
    type: "website",
    images: [{ url: SITE_CONFIG.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ${SITE_CONFIG.name}`,
    description: DESCRIPTION,
  },
};

/**
 * About page — hero, scroll-driven story timeline, mission/vision/values,
 * the three things we do, the impact stats strip, and a closing CTA.
 */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <MissionVisionValues />
      <WhatWeDo />
      <Stats />
      <AboutCTA />
    </>
  );
}
