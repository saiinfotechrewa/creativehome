"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { GradientText } from "@/components/ui/gradient-text";
import { staggerContainer, fadeInUp } from "@/lib/animations";

/** Compact hero above the booking form — sets context and intent. */
export function BookingHero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-12 sm:pt-44 sm:pb-16">
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
              Book a Free Consultation
            </Badge>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="text-foreground mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Let&apos;s build the right{" "}
            <GradientText>software for your business</GradientText>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed"
          >
            Tell us a little about your business and pick a time. In two minutes
            you&apos;ll have a free, no-pressure consultation booked with our
            team.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
