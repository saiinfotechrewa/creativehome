import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { JsonLd } from "@/components/shared/json-ld";
import { buildSiteJsonLd } from "@/lib/structured-data";
import { SITE_CONFIG } from "@/lib/constants";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { Solutions } from "@/components/sections/solutions";
import { Industries } from "@/components/sections/industries";
import { Process } from "@/components/sections/process";
import { PreFooterStrip } from "@/components/sections/pre-footer-strip";

/**
 * Below-the-fold sections are code-split into their own chunks so the
 * initial bundle stays lean. They still server-render (no ssr:false),
 * so there's no layout shift or hydration mismatch.
 */
const ProductShowcase = dynamic(() =>
  import("@/components/sections/product-showcase").then(
    (m) => m.ProductShowcase
  )
);
const WhyChooseUs = dynamic(() =>
  import("@/components/sections/why-choose-us").then((m) => m.WhyChooseUs)
);
const Testimonials = dynamic(() =>
  import("@/components/sections/testimonials").then((m) => m.Testimonials)
);
const Stats = dynamic(() =>
  import("@/components/sections/stats").then((m) => m.Stats)
);
const FinalCTA = dynamic(() =>
  import("@/components/sections/final-cta").then((m) => m.FinalCTA)
);

/**
 * The homepage owns the site-wide canonical and is the single place the
 * Organization + WebSite graph is emitted; inner pages reference the
 * Organization by @id rather than repeating it. Title/description are
 * inherited from the root layout's defaults.
 */
export const metadata: Metadata = {
  alternates: { canonical: SITE_CONFIG.url },
  openGraph: { url: SITE_CONFIG.url },
};

/**
 * CreativeDox homepage. Section ids (for nav scroll + highlighting):
 * hero → trust → solutions → industries → process → products →
 * why-us → testimonials → stats → contact.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={buildSiteJsonLd()} />
      <Hero />
      <TrustBar />
      <LogoMarquee />
      <Solutions />
      <Industries />
      <Process />
      <ProductShowcase />
      <WhyChooseUs />
      <Testimonials />
      <Stats />
      <FinalCTA />
      <PreFooterStrip />
    </>
  );
}
