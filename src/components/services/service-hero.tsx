"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getIcon } from "@/lib/icons";
import {
  fadeInUp,
  textReveal,
  textRevealContainer,
} from "@/lib/animations";
import type { ServiceDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Hero with a word-by-word animated headline and a service-tinted orb. */
export function ServiceHero({ service }: { service: ServiceDetail }) {
  const Icon = getIcon(service.icon);

  // Scroll-linked parallax on the gradient orb — it drifts down and swells
  // slightly as the hero scrolls away. Disabled under reduced-motion.
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-24"
    >
      {/* Service-tinted gradient orb */}
      <motion.div
        aria-hidden
        style={reducedMotion ? undefined : { y: orbY, scale: orbScale }}
        className={cn(
          "pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-linear-to-br opacity-25 blur-[120px]",
          service.gradient
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,#09090b)]"
      />

      <Container className="relative">
        {/* Breadcrumb */}
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-muted-foreground mb-6 flex items-center justify-center gap-1.5 text-sm"
          aria-label="Breadcrumb"
        >
          <Link href="/services" className="hover:text-foreground transition-colors">
            Services
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{service.title}</span>
        </motion.nav>

        <div className="flex flex-col items-center text-center">
          <motion.span
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className={cn(
              "inline-flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur",
              service.color
            )}
          >
            <Icon className="h-7 w-7" />
          </motion.span>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.05 }}
            className="mt-6"
          >
            <Badge variant="primary" featured>
              {service.eyebrow}
            </Badge>
          </motion.div>

          {/* Animated word-by-word headline */}
          <motion.h1
            className="text-foreground mt-5 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            aria-label={service.headline}
            initial="hidden"
            animate="visible"
            variants={textRevealContainer}
          >
            {service.headline.split(" ").map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                aria-hidden
                variants={textReveal}
                className="inline-block whitespace-pre"
              >
                {word}{" "}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed"
          >
            {service.heroDescription}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <ButtonLink
              href="/book-consultation"
              variant="accent"
              size="lg"
              iconRight={<ArrowRight className="h-4 w-4" />}
            >
              Start Your Project
            </ButtonLink>
            <ButtonLink href="#process" variant="secondary" size="lg">
              See how we work
            </ButtonLink>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
