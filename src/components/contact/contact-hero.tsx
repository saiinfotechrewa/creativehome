"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { staggerContainer, fadeInUp } from "@/lib/animations";

/** Contact page hero — heading + subheading. */
export function ContactHero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
      <div
        aria-hidden
        className="from-primary/35 to-secondary/25 pointer-events-none absolute -top-44 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-radial opacity-30 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,#09090b)]"
      />

      <Container className="relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="primary" featured>
              Contact Us
            </Badge>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="text-foreground mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Let&apos;s talk about your business
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed"
          >
            Tell us what you&apos;re trying to solve and we&apos;ll get back
            within one business day — usually much sooner.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
