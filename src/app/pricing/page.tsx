import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { GradientText } from "@/components/ui/gradient-text";
import { Reveal } from "@/components/shared/motion";
import { PricingExplorer } from "@/components/pricing/pricing-explorer";
import { CustomPlanCTA } from "@/components/pricing/custom-plan-cta";
import { PricingFAQ } from "@/components/pricing/pricing-faq";
import { SITE_CONFIG } from "@/lib/constants";

const TITLE = "Pricing";
const DESCRIPTION =
  "Simple, transparent pricing for every CreativeDox product. Choose the plan that fits your business and upgrade anytime — free onboarding, no long contracts.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_CONFIG.url}/pricing` },
  openGraph: {
    title: `${TITLE} | ${SITE_CONFIG.name}`,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/pricing`,
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
 * Pricing page — hero, interactive product × billing × tier explorer,
 * custom-plan band, and a billing FAQ accordion.
 */
export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
        {/* Gradient orb */}
        <div
          aria-hidden
          className="from-primary/40 to-secondary/30 pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-radial opacity-25 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,#09090b)]"
        />

        <Container className="relative">
          <div className="flex flex-col items-center text-center">
            <Reveal>
              <Badge variant="primary" featured>
                Pricing
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="text-foreground mt-5 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Simple, <GradientText>Transparent</GradientText> Pricing
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-lg leading-relaxed">
                Choose the plan that fits your business. Upgrade anytime.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-24">
        <PricingExplorer />
      </section>

      <CustomPlanCTA />
      <PricingFAQ />
    </>
  );
}
