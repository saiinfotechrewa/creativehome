"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/shared/motion";
import { PROCESS_STEPS } from "@/data/process";
import { getIcon } from "@/lib/icons";
import { EASE } from "@/lib/animations";
import type { ProcessStep } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Fill fraction at which each step's node activates. */
const STEP_FRACTIONS = PROCESS_STEPS.map(
  (_, index) => (index + 0.5) / PROCESS_STEPS.length
);

/**
 * Scroll-driven timeline: a gradient line fills with scroll progress,
 * lighting up each step node (and its card) as it passes. Horizontal
 * with alternating cards on desktop, vertical on mobile.
 */
export function Process() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.75", "end 0.4"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  const [activeCount, setActiveCount] = useState(0);
  useMotionValueEvent(fill, "change", (value) => {
    const count = STEP_FRACTIONS.filter((f) => value >= f).length;
    setActiveCount((prev) => (prev === count ? prev : count));
  });

  return (
    <section
      id="process"
      className="relative scroll-mt-20 overflow-hidden py-28 sm:py-[120px]"
    >
      {/* Subtle vertical guide line behind the section */}
      <span
        aria-hidden
        className="via-border absolute top-0 bottom-0 left-1/2 hidden w-px bg-linear-to-b from-transparent to-transparent lg:block"
      />

      <Container className="relative">
        <SectionHeading
          eyebrow="How It Works"
          title="From Chaos to Clarity in 4 Steps"
          description="We don't just sell software. We partner with you to transform your operations."
        />

        <div ref={timelineRef}>
          {/* ------------------------- Desktop ------------------------- */}
          <div className="relative mt-20 hidden lg:block">
            {/* Track + scroll-driven gradient fill */}
            <div className="absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2">
              <span className="bg-border absolute inset-0 rounded-full" />
              <motion.span
                style={{ scaleX: fill }}
                className="from-primary to-secondary absolute inset-0 origin-left rounded-full bg-linear-to-r shadow-[0_0_14px_var(--color-glow-primary)] will-change-transform"
              />
            </div>

            <div className="relative grid grid-cols-4 gap-6">
              {PROCESS_STEPS.map((step, index) => {
                const active = index < activeCount;
                const above = index % 2 === 0;
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className="flex h-64 w-full flex-col items-center justify-end">
                      {above ? (
                        <>
                          <StepCard step={step} index={index} active={active} />
                          <Connector />
                        </>
                      ) : null}
                    </div>
                    <StepNode step={step} index={index} active={active} />
                    <div className="flex h-64 w-full flex-col items-center justify-start">
                      {!above ? (
                        <>
                          <Connector />
                          <StepCard step={step} index={index} active={active} />
                        </>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ------------------------- Mobile -------------------------- */}
          <div className="relative mt-16 lg:hidden">
            {/* Vertical track + fill */}
            <div className="absolute top-2 bottom-2 left-6 w-0.5">
              <span className="bg-border absolute inset-0 rounded-full" />
              <motion.span
                style={{ scaleY: fill }}
                className="from-primary to-secondary absolute inset-0 origin-top rounded-full bg-linear-to-b shadow-[0_0_14px_var(--color-glow-primary)] will-change-transform"
              />
            </div>

            <div className="flex flex-col gap-10">
              {PROCESS_STEPS.map((step, index) => {
                const active = index < activeCount;
                return (
                  <div key={step.id} className="relative pl-16">
                    <div className="absolute top-1 left-6 -translate-x-1/2">
                      <StepNode
                        step={step}
                        index={index}
                        active={active}
                        compact
                      />
                    </div>
                    <StepCard step={step} index={index} active={active} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <Reveal className="mt-20 flex flex-col items-center gap-5 text-center">
          <p className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
            Start Your Transformation Today
          </p>
          <ButtonLink href="/#contact" size="lg" variant="primary">
            Book Free Consultation
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */

function Connector() {
  return <span aria-hidden className="bg-border h-8 w-px" />;
}

function StepNode({
  step,
  index,
  active,
  compact,
}: {
  step: ProcessStep;
  index: number;
  active: boolean;
  compact?: boolean;
}) {
  return (
    <motion.div
      animate={active ? { scale: [0.85, 1.1, 1] } : { scale: 1 }}
      transition={{ duration: 0.45, ease: EASE }}
      className={cn(
        "relative z-10 grid place-items-center rounded-full border-2 transition-colors duration-500",
        compact ? "h-12 w-12" : "h-16 w-16",
        active
          ? "from-primary to-secondary border-transparent bg-linear-to-br text-white shadow-[0_0_28px_var(--color-glow-primary)]"
          : "border-border bg-card text-muted"
      )}
      aria-label={`Step ${step.step}: ${step.title}`}
    >
      {active ? (
        <Check className={compact ? "h-5 w-5" : "h-6 w-6"} />
      ) : (
        <span className="text-sm font-semibold">{index + 1}</span>
      )}
    </motion.div>
  );
}

function StepCard({
  step,
  index,
  active,
}: {
  step: ProcessStep;
  index: number;
  active: boolean;
}) {
  const Icon = getIcon(step.icon);

  return (
    <motion.div
      animate={
        active
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0.3, y: 16, filter: "blur(2px)" }
      }
      transition={{ duration: 0.5, ease: EASE }}
      className="border-border/80 bg-card/60 w-full max-w-xs rounded-2xl border p-6 backdrop-blur-md"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "border-border bg-accent grid h-10 w-10 place-items-center rounded-full border",
            step.color
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        <motion.span
          animate={
            active
              ? { filter: "blur(0px)", opacity: 1, scale: 1 }
              : { filter: "blur(6px)", opacity: 0.4, scale: 0.95 }
          }
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          className="from-primary to-secondary bg-linear-to-r bg-clip-text text-3xl font-extrabold text-transparent"
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>
      </div>
      <h3 className="text-foreground mt-4 text-lg font-bold">{step.title}</h3>
      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
        {step.description}
      </p>
    </motion.div>
  );
}
