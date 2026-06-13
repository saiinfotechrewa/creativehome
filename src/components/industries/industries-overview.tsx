"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { GradientText } from "@/components/ui/gradient-text";
import { ButtonLink } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/motion";
import { fadeInUp } from "@/lib/animations";
import { getIcon } from "@/lib/icons";
import type { IndustryDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Bento spans per tile position (lg, 4-column grid). The first tile is a
 * 2×2 feature; the last spans the full width. Tweak alongside the data
 * order in INDUSTRY_DETAILS if the count changes.
 */
const BENTO_SPANS = [
  "md:col-span-2 lg:col-span-2 lg:row-span-2",
  "lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-2",
  "lg:col-span-2",
  "md:col-span-2 lg:col-span-4",
];

/** Hero + bento grid for the /industries overview page. */
export function IndustriesOverview({
  industries,
}: {
  industries: IndustryDetail[];
}) {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
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
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Badge variant="primary" featured>
                Industries
              </Badge>
            </motion.div>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.05 }}
              className="text-foreground mt-5 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              Software built for <GradientText>your industry</GradientText>
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mx-auto mt-5 max-w-2xl text-lg leading-relaxed"
            >
              We&apos;ve solved the same problems you face. Pick your industry to
              see the exact tools, workflows, and results CreativeDox delivers
              for businesses like yours.
            </motion.p>
          </div>
        </Container>
      </section>

      <section className="pb-24 sm:pb-28">
        <Container>
          <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-[200px] lg:grid-cols-4">
            {industries.map((industry, index) => {
              const Icon = getIcon(industry.icon);
              const featured = index === 0;
              return (
                <StaggerItem
                  key={industry.slug}
                  className={cn(BENTO_SPANS[index], "h-full")}
                >
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="group block h-full"
                  >
                    <SpotlightCard
                      color={`${industry.hex}1f`}
                      className="group-hover:border-muted flex h-full flex-col justify-between transition-colors duration-300"
                    >
                      <div
                        aria-hidden
                        className={cn(
                          "absolute -top-12 -right-12 h-32 w-32 rounded-full bg-linear-to-br opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20",
                          industry.gradient
                        )}
                      />
                      <div>
                        <span
                          className={cn(
                            "inline-flex items-center justify-center rounded-xl bg-linear-to-br text-white shadow-lg",
                            featured ? "h-14 w-14" : "h-12 w-12",
                            industry.gradient
                          )}
                        >
                          <Icon className={featured ? "h-7 w-7" : "h-6 w-6"} />
                        </span>
                        <h2
                          className={cn(
                            "text-foreground mt-5 font-semibold",
                            featured ? "text-2xl" : "text-lg"
                          )}
                        >
                          {industry.name}
                        </h2>
                        <p
                          className={cn(
                            "text-muted-foreground mt-2 leading-relaxed",
                            featured ? "max-w-md text-base" : "text-sm"
                          )}
                        >
                          {industry.cardDescription}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-medium",
                            industry.color
                          )}
                        >
                          <TrendingUp className="h-3.5 w-3.5" />
                          {industry.highlight}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-sm font-medium",
                            industry.color
                          )}
                        >
                          Explore
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </SpotlightCard>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>

          <Reveal className="mt-20" delay={0.1}>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 px-6 py-14 text-center sm:px-16">
              <div
                aria-hidden
                className="from-primary to-secondary absolute inset-0 bg-linear-to-br opacity-15"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]"
              />
              <div className="relative">
                <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur">
                  <Sparkles className="text-primary h-3.5 w-3.5" />
                  Don&apos;t see your industry?
                </span>
                <h2 className="text-foreground mx-auto mt-5 max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                  We&apos;ve probably solved it before
                </h2>
                <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-relaxed sm:text-lg">
                  Tell us about your business. We&apos;ll map the right software
                  and automation to your workflow — no jargon, no obligation.
                </p>
                <div className="mt-8 flex justify-center">
                  <ButtonLink
                    href="/book-consultation"
                    variant="accent"
                    size="lg"
                    iconRight={<ArrowRight className="h-4 w-4" />}
                  >
                    Get Started
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
