"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";
import { MOTION } from "@/lib/constants";

const partners = ["Northwind", "Lumen", "Brightline", "Cadence", "Vault"];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute right-1/4 top-40 -z-0 h-[320px] w-[320px] rounded-full bg-secondary/20 blur-[120px]" />

      <Container className="relative z-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: MOTION.duration, ease: MOTION.ease }}
          >
            <Badge variant="primary">
              <Sparkles className="h-3.5 w-3.5" />
              Now with AI-powered automation agents
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: MOTION.duration,
              ease: MOTION.ease,
              delay: 0.08,
            }}
            className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl"
          >
            Business software &{" "}
            <span className="text-gradient">automation</span>, engineered to
            scale.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: MOTION.duration,
              ease: MOTION.ease,
              delay: 0.16,
            }}
            className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            {SITE_CONFIG.name} designs, builds, and runs the custom software and
            automations that help modern teams ship faster, cut busywork, and
            scale operations with confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: MOTION.duration,
              ease: MOTION.ease,
              delay: 0.24,
            }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <ButtonLink href="/#contact" size="lg" variant="primary">
              Start your project
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/#products" size="lg" variant="outline">
              <Play className="h-4 w-4" />
              See it in action
            </ButtonLink>
          </motion.div>
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 flex flex-col items-center gap-5"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Trusted by fast-moving teams worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {partners.map((p) => (
              <span
                key={p}
                className="text-lg font-semibold text-muted-foreground/60"
              >
                {p}
              </span>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
