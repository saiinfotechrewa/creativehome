"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Calendar, ChevronDown, Rocket } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Particles } from "@/components/ui/particles";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE } from "@/lib/animations";
import type { HeroContentProps } from "@/lib/homepage-sections";
import { cn } from "@/lib/utils";

/** Lazy-load the network diagram — client-only, below the headline fold. */
const HeroNetwork = dynamic(
  () => import("./hero-network").then((m) => m.HeroNetwork),
  { ssr: false, loading: () => <div style={{ width: 600, height: 600 }} /> }
);

const DEFAULT_LINE_ONE = "Transform Your Business With".split(" ");
const DEFAULT_LINE_TWO = "Smart Software & Automation".split(" ");

/** Word-by-word headline timing. */
const WORD_DELAY = 0.25;
const WORD_STAGGER = 0.08;
/** Content entrance delays (s) after the headline cascade. */
const SUB_DELAY = 1.0;
const CTA_DELAY = 1.15;
const TRUST_DELAY = 1.45;

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay },
});

export function Hero({ content }: { content?: HeroContentProps | null }) {
  const { scrollY } = useScroll();
  const indicatorOpacity = useTransform(scrollY, [0, 160], [1, 0]);
  const reducedMotion = useReducedMotion();

  // Normal words then gradient (highlight) words; falls back to the static copy.
  const lineOne = content?.headline ? content.headline.split(" ") : DEFAULT_LINE_ONE;
  const lineTwo = content
    ? content.highlight
      ? content.highlight.split(" ")
      : []
    : DEFAULT_LINE_TWO;
  const headlineLabel = [...lineOne, ...lineTwo].join(" ");

  const badge = content?.badge || "Business Software & Automation Platform";
  const subheadline =
    content?.subheadline ||
    "CRM, Accounting, Attendance, WhatsApp Automation, Marketing Tools — ready-to-use cloud software and custom development for growing businesses.";
  const ctaPrimary = content?.ctaPrimary ?? {
    text: "Explore Solutions",
    link: "/#solutions",
  };
  const ctaSecondary = content?.ctaSecondary ?? {
    text: "Book Free Consultation",
    link: "/#contact",
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen scroll-mt-20 flex-col overflow-hidden pt-36 pb-16 sm:pt-44"
    >
      <HeroBackground reducedMotion={reducedMotion} />

      <Container className="relative z-10">
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
          >
            <Badge featured glow>
              <Rocket className="text-primary h-3.5 w-3.5" />
              {badge}
            </Badge>
          </motion.div>

          {/* Headline */}
          <h1
            aria-label={headlineLabel}
            className="text-foreground mt-7 text-5xl font-extrabold tracking-[-0.03em] text-balance drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)] sm:text-6xl lg:text-7xl"
          >
            <span className="block">
              {lineOne.map((word, i) => (
                <HeadlineWord
                  key={word + i}
                  delay={WORD_DELAY + i * WORD_STAGGER}
                >
                  {word}
                </HeadlineWord>
              ))}
            </span>
            {lineTwo.length > 0 ? (
              <span className="mt-2 block">
                {lineTwo.map((word, i) => (
                  <HeadlineWord
                    key={word + i}
                    gradient
                    delay={WORD_DELAY + (lineOne.length + i) * WORD_STAGGER}
                  >
                    {word}
                  </HeadlineWord>
                ))}
              </span>
            ) : null}
          </h1>

          {/* Subheadline */}
          <motion.p
            {...enter(SUB_DELAY)}
            className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed text-pretty sm:text-xl"
          >
            {subheadline}
          </motion.p>

          {/* CTAs */}
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <motion.div {...enter(CTA_DELAY)}>
              <MagneticButton>
                <ButtonLink
                  href={ctaPrimary.link}
                  size="lg"
                  variant="accent"
                  iconRight={<ArrowRight className="h-4 w-4" />}
                >
                  {ctaPrimary.text}
                </ButtonLink>
              </MagneticButton>
            </motion.div>
            <motion.div {...enter(CTA_DELAY + 0.12)}>
              <ButtonLink
                href={ctaSecondary.link}
                size="lg"
                variant="outline"
                iconLeft={<Calendar className="h-4 w-4" />}
                className="hover:border-primary/60 hover:shadow-primary/15 hover:shadow-lg"
              >
                {ctaSecondary.text}
              </ButtonLink>
            </motion.div>
          </div>

          {/* Trust line */}
          <motion.p
            {...enter(TRUST_DELAY)}
            className="text-muted-foreground mt-9 flex items-center gap-3 text-sm"
          >
            <TrustDots />
            {content?.trustLine ? (
              <span>{content.trustLine}</span>
            ) : (
              <>
                Trusted by{" "}
                <span className="text-foreground -mx-1.5 font-semibold">
                  500+ businesses
                </span>{" "}
                across India
              </>
            )}
            <TrustDots reverse />
          </motion.p>
        </div>

        {/* Network visualization — simplified away on phones */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-8 hidden justify-center sm:flex"
        >
          <div className="origin-top scale-75 md:scale-90 lg:scale-100">
            <HeroNetwork />
          </div>
        </motion.div>
      </Container>

      {/* Scroll indicator — fades out as the user scrolls */}
      <motion.div
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="text-muted flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase">
            Scroll to explore
          </span>
          <motion.span
            animate={reducedMotion ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Headline word                                                      */
/* ------------------------------------------------------------------ */

function HeadlineWord({
  children,
  delay,
  gradient,
}: {
  children: string;
  delay: number;
  gradient?: boolean;
}) {
  return (
    <motion.span
      aria-hidden
      initial={{ opacity: 0, y: "0.4em" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className={cn(
        "inline-block whitespace-pre",
        gradient &&
          "[background-size:200%_auto] bg-clip-text text-transparent motion-safe:[animation:gradient-shift_6s_linear_infinite]"
      )}
      style={
        gradient
          ? {
              backgroundImage:
                "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #8b5cf6, #3b82f6)",
            }
          : undefined
      }
    >
      {children}{" "}
    </motion.span>
  );
}

/** Three fading dots flanking the trust line. */
function TrustDots({ reverse }: { reverse?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn("flex items-center gap-1", reverse && "flex-row-reverse")}
    >
      <span className="bg-primary/80 h-1 w-1 rounded-full" />
      <span className="bg-primary/50 h-1 w-1 rounded-full" />
      <span className="bg-primary/25 h-1 w-1 rounded-full" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Layered background                                                 */
/* ------------------------------------------------------------------ */

const ORBS = [
  {
    position: "-top-32 right-[-8%]",
    visual: "h-[600px] w-[600px] bg-[#3b82f6] opacity-15 blur-[150px]",
    drift: { x: -30, y: 40 },
    duration: 22,
  },
  {
    position: "bottom-[-10%] left-[-8%]",
    visual: "h-[500px] w-[500px] bg-[#8b5cf6] opacity-[0.12] blur-[120px]",
    drift: { x: 40, y: -30 },
    duration: 18,
  },
  {
    position: "bottom-[-12%] left-1/2",
    visual: "h-[400px] w-[400px] bg-[#06b6d4] opacity-[0.08] blur-[100px]",
    drift: { x: -50, y: -20 },
    duration: 25,
  },
];

const BEAMS = [
  { top: "22%", rotate: -14, duration: 7, delay: 1.5, via: "via-primary/50" },
  { top: "48%", rotate: -9, duration: 9, delay: 5, via: "via-secondary/40" },
  { top: "72%", rotate: -16, duration: 8, delay: 9, via: "via-cyan-400/40" },
];

function HeroBackground({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Layer 1 — base gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#09090b_0%,#0a0a12_100%)]" />

      {/* Layer 2 — grid pattern, masked toward the edges */}
      <div className="bg-grid absolute inset-0 opacity-40" />

      {/* Layer 3 — floating gradient orbs */}
      {ORBS.map((orb, index) => (
        <div key={index} className={cn("absolute", orb.position)}>
          <motion.div
            animate={
              reducedMotion
                ? undefined
                : { x: [0, orb.drift.x, 0], y: [0, orb.drift.y, 0] }
            }
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={cn("rounded-full will-change-transform", orb.visual)}
          />
        </div>
      ))}

      {/* Layer 4 — drifting particle field (lightweight canvas) */}
      <Particles quantity={40} className="opacity-70" />

      {/* Layer 5 — shooting-star beams */}
      {!reducedMotion &&
        BEAMS.map((beam, index) => (
          <motion.div
            key={index}
            initial={{ x: "-30vw", opacity: 0 }}
            animate={{ x: "130vw", opacity: [0, 1, 1, 0] }}
            transition={{
              duration: beam.duration,
              delay: beam.delay,
              repeat: Infinity,
              repeatDelay: 6,
              ease: "linear",
            }}
            style={{ top: beam.top, rotate: beam.rotate }}
            className={cn(
              "absolute left-0 h-px w-48 bg-linear-to-r from-transparent to-transparent will-change-transform",
              beam.via
            )}
          />
        ))}
    </div>
  );
}
