import dynamic from "next/dynamic";
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
 * CreativeDox homepage. Section ids (for nav scroll + highlighting):
 * hero → trust → solutions → industries → process → products →
 * why-us → testimonials → stats → contact.
 */
export default function HomePage() {
  return (
    <>
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
