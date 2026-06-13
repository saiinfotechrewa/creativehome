"use client";

import { motion } from "framer-motion";
import { ArrowRight, Boxes, Compass, Home } from "lucide-react";
import { Container } from "@/components/ui/container";
import { GradientText } from "@/components/ui/gradient-text";
import { ButtonLink } from "@/components/ui/button";
import { fadeInUp } from "@/lib/animations";

/** Floating decorative orb with a gentle, looping drift. */
function FloatingOrb({
  className,
  delay = 0,
  duration = 6,
}: {
  className: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.span
      aria-hidden
      className={className}
      animate={{ y: [0, -18, 0] }}
      transition={{ duration, delay, ease: "easeInOut", repeat: Infinity }}
    />
  );
}

/** Creative animated 404 — gradient numerals, floating accents, two CTAs. */
export default function NotFound() {
  return (
    <section className="relative grid min-h-[100svh] place-items-center overflow-hidden py-32">
      {/* Ambient gradient + grid backdrop */}
      <div
        aria-hidden
        className="from-primary/30 to-secondary/20 pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-radial opacity-25 blur-[120px]"
      />
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />

      {/* Floating accent shapes */}
      <FloatingOrb
        className="from-primary to-secondary absolute top-[22%] left-[16%] hidden h-16 w-16 rounded-2xl bg-linear-to-br opacity-20 blur-md sm:block"
        duration={7}
      />
      <FloatingOrb
        className="from-secondary to-primary absolute right-[14%] bottom-[24%] hidden h-24 w-24 rounded-full bg-linear-to-br opacity-15 blur-md sm:block"
        delay={1}
        duration={8}
      />
      <FloatingOrb
        className="border-border bg-card/60 absolute top-[30%] right-[22%] hidden h-10 w-10 rounded-xl border backdrop-blur md:block"
        delay={0.5}
        duration={6}
      />

      <Container className="relative">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[7rem] leading-none font-extrabold tracking-tighter sm:text-[11rem]">
              <GradientText>404</GradientText>
            </h1>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.15 }}
            className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur"
          >
            <Compass className="text-primary h-3.5 w-3.5" />
            Page not found
          </motion.div>

          <motion.h2
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-foreground mt-5 max-w-xl text-2xl font-bold tracking-tight text-balance sm:text-3xl"
          >
            This page wandered off the grid
          </motion.h2>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.25 }}
            className="text-muted-foreground mx-auto mt-4 max-w-md leading-relaxed"
          >
            The link may be broken or the page may have moved. Let&apos;s get you
            back to something useful.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <ButtonLink
              href="/"
              variant="accent"
              size="lg"
              iconLeft={<Home className="h-4 w-4" />}
            >
              Go Home
            </ButtonLink>
            <ButtonLink
              href="/#solutions"
              variant="secondary"
              size="lg"
              iconLeft={<Boxes className="h-4 w-4" />}
              iconRight={<ArrowRight className="h-4 w-4" />}
            >
              View Solutions
            </ButtonLink>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
