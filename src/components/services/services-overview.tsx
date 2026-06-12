"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { GradientText } from "@/components/ui/gradient-text";
import { ButtonLink } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/motion";
import { fadeInUp } from "@/lib/animations";
import { getIcon } from "@/lib/icons";
import type { ServiceCard } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Hero + 6-card grid for the /services overview page. */
export function ServicesOverview({ cards }: { cards: ServiceCard[] }) {
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
                Services
              </Badge>
            </motion.div>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.05 }}
              className="text-foreground mt-5 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              Engineering that turns ideas into{" "}
              <GradientText>shipped software</GradientText>
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mx-auto mt-5 max-w-2xl text-lg leading-relaxed"
            >
              From custom web apps to AI and automation, we design, build, and
              maintain software that fits your business. Pick a practice to see
              how we deliver.
            </motion.p>
          </div>
        </Container>
      </section>

      <section className="pb-24 sm:pb-28">
        <Container>
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => {
              const Icon = getIcon(card.icon);
              return (
                <StaggerItem key={card.id}>
                  <Link href={card.href} className="group block h-full">
                    <SpotlightCard
                      color={`${card.hex}1f`}
                      className="h-full transition-colors duration-300 group-hover:border-muted"
                    >
                      <div
                        aria-hidden
                        className={cn(
                          "absolute -right-12 -top-12 h-32 w-32 rounded-full bg-linear-to-br opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20",
                          card.gradient
                        )}
                      />
                      <span
                        className={cn(
                          "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-lg",
                          card.gradient
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <h2 className="text-foreground mt-5 text-lg font-semibold">
                        {card.title}
                      </h2>
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        {card.description}
                      </p>
                      <span
                        className={cn(
                          "mt-5 inline-flex items-center gap-1.5 text-sm font-medium",
                          card.color
                        )}
                      >
                        {card.cta}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
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
                  Free consultation & estimate
                </span>
                <h2 className="text-foreground mx-auto mt-5 max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                  Have a project in mind?
                </h2>
                <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-relaxed sm:text-lg">
                  Tell us what you&apos;re building. We&apos;ll come back with a
                  clear plan, timeline, and price — no obligation.
                </p>
                <div className="mt-8 flex justify-center">
                  <ButtonLink
                    href="/book-consultation"
                    variant="accent"
                    size="lg"
                    iconRight={<ArrowRight className="h-4 w-4" />}
                  >
                    Start Your Project
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
