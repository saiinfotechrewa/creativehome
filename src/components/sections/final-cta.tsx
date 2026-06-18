"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Calendar, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { SOCIAL_LINKS } from "@/lib/constants";
import { EASE } from "@/lib/animations";
import type { FinalCtaContentProps } from "@/lib/homepage-sections";
import { cn } from "@/lib/utils";

const DEFAULT_HEADLINE = "Ready to Digitize Your Business?";
const DEFAULT_GRADIENT_WORD = "Digitize";

/** Deterministic star field — seeded so SSR and client render identically. */
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}
const rand = seededRandom(7);
const STARS = Array.from({ length: 26 }, () => ({
  top: `${(rand() * 90 + 5).toFixed(2)}%`,
  left: `${(rand() * 96 + 2).toFixed(2)}%`,
  delay: `${(rand() * 4).toFixed(2)}s`,
  duration: `${(2 + rand() * 3).toFixed(2)}s`,
}));

const AURORA_BLOBS = [
  {
    position: "top-[-10%] left-[8%]",
    visual: "h-[560px] w-[560px] bg-[#3b82f6] opacity-[0.13] blur-[170px]",
    drift: { x: 60, y: 40, scale: 1.15 },
    duration: 26,
  },
  {
    position: "top-[15%] right-[5%]",
    visual: "h-[480px] w-[480px] bg-[#8b5cf6] opacity-[0.12] blur-[160px]",
    drift: { x: -50, y: 50, scale: 1.2 },
    duration: 22,
  },
  {
    position: "bottom-[-15%] left-[35%]",
    visual: "h-[420px] w-[420px] bg-[#06b6d4] opacity-[0.1] blur-[150px]",
    drift: { x: 40, y: -40, scale: 1.1 },
    duration: 30,
  },
];

const FLOATING_BADGES = [
  { label: "14-Day Trial", className: "top-[6%] left-[10%]", duration: 5 },
  {
    label: "Free Consultation",
    className: "top-[10%] right-[9%]",
    duration: 6,
  },
  {
    label: "No Credit Card",
    className: "bottom-[8%] right-[16%]",
    duration: 7,
  },
];

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay },
  }),
};

export function FinalCTA({ content }: { content?: FinalCtaContentProps | null }) {
  const reducedMotion = useReducedMotion();

  // Build the word list: plain headline words, then gradient highlight words.
  const headlineText = content?.headline || DEFAULT_HEADLINE;
  const highlightSet = new Set(
    content
      ? content.highlight
        ? content.highlight.split(" ")
        : []
      : [DEFAULT_GRADIENT_WORD],
  );
  const headlineWords = content?.highlight
    ? [...headlineText.split(" "), ...content.highlight.split(" ")]
    : headlineText.split(" ");

  const badge = content?.badge || "Get Started";
  const subheadline =
    content?.subheadline ||
    "Join 500+ businesses that have already transformed their operations with CreativeDox.";
  const ctaPrimary = content?.ctaPrimary ?? {
    text: "Schedule Free Consultation",
    link: `mailto:hello@creativedox.com?subject=${encodeURIComponent("Free consultation request")}`,
  };
  const ctaSecondary = content?.ctaSecondary ?? {
    text: "Explore All Products",
    link: "/#products",
  };
  const primaryExternal = ctaPrimary.link.startsWith("mailto:") || ctaPrimary.link.startsWith("http");

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden bg-[linear-gradient(180deg,#09090b_0%,#0c1225_35%,#150c25_70%,#09090b_100%)] py-32 sm:py-40"
    >
      {/* Aurora mesh + grid + stars */}
      <div aria-hidden className="absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-20" />
        {AURORA_BLOBS.map((blob, i) => (
          <div key={i} className={cn("absolute", blob.position)}>
            <motion.div
              animate={
                reducedMotion
                  ? undefined
                  : {
                      x: [0, blob.drift.x, 0],
                      y: [0, blob.drift.y, 0],
                      scale: [1, blob.drift.scale, 1],
                    }
              }
              transition={{
                duration: blob.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={cn("rounded-full will-change-transform", blob.visual)}
            />
          </div>
        ))}
        {STARS.map((star, i) => (
          <span
            key={i}
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
            className="absolute h-px w-px rounded-full bg-white opacity-10 shadow-[0_0_4px_1px_rgba(255,255,255,0.4)] motion-safe:[animation-iteration-count:infinite] motion-safe:[animation-name:twinkle]"
          />
        ))}
      </div>

      <Container className="relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative mx-auto flex max-w-[800px] flex-col items-center text-center"
        >
          {/* Floating decorative badges (desktop) */}
          {FLOATING_BADGES.map((badge) => (
            <motion.span
              key={badge.label}
              aria-hidden
              variants={item}
              custom={0.9}
              className={cn("absolute hidden lg:block", badge.className)}
            >
              <motion.span
                animate={reducedMotion ? undefined : { y: [0, -8, 0] }}
                transition={{
                  duration: badge.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="border-border/70 bg-card/50 text-muted-foreground block rounded-full border px-3.5 py-1.5 text-xs font-medium shadow-lg backdrop-blur-md"
              >
                {badge.label} ↗
              </motion.span>
            </motion.span>
          ))}

          {/* Badge */}
          <motion.div variants={item} custom={0.05}>
            <Badge featured glow>
              {badge}
            </Badge>
          </motion.div>

          {/* Headline */}
          <h2
            aria-label={headlineWords.join(" ")}
            className="text-foreground mt-7 text-4xl font-extrabold tracking-[-0.02em] text-balance sm:text-5xl lg:text-[56px] lg:leading-[1.1]"
          >
            {headlineWords.map((word, i) => {
              const gradient = highlightSet.has(word);
              return (
                <motion.span
                  key={word + i}
                  aria-hidden
                  variants={item}
                  custom={0.2 + i * 0.08}
                  className={cn(
                    "inline-block whitespace-pre",
                    gradient &&
                      "[background-size:200%_auto] bg-clip-text text-transparent motion-safe:[animation:gradient-shift_6s_linear_infinite]"
                  )}
                  style={
                    gradient
                      ? {
                          backgroundImage:
                            "linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)",
                        }
                      : undefined
                  }
                >
                  {word}{" "}
                </motion.span>
              );
            })}
          </h2>

          {/* Subheadline */}
          <motion.p
            variants={item}
            custom={0.75}
            className="text-muted-foreground mt-6 max-w-[560px] text-lg leading-relaxed"
          >
            {subheadline}
          </motion.p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <motion.div variants={item} custom={0.9}>
              <motion.div
                animate={reducedMotion ? undefined : { scale: [1, 1.02, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <MagneticButton>
                  <ButtonLink
                    href={ctaPrimary.link}
                    external={primaryExternal}
                    size="lg"
                    variant="accent"
                    iconLeft={<Calendar className="h-4 w-4" />}
                    className="px-8"
                  >
                    {ctaPrimary.text}
                    {/* Idle shimmer sweep every ~3s */}
                    {!reducedMotion && (
                      <motion.span
                        aria-hidden
                        initial={{ x: "-130%" }}
                        animate={{ x: "130%" }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          repeatDelay: 3,
                          ease: "easeInOut",
                        }}
                        className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                      />
                    )}
                  </ButtonLink>
                </MagneticButton>
              </motion.div>
            </motion.div>
            <motion.div variants={item} custom={1.0}>
              <ButtonLink
                href={ctaSecondary.link}
                size="lg"
                variant="outline"
                iconRight={<ArrowRight className="h-4 w-4" />}
                className="gradient-border-animated hover:shadow-secondary/20 border-transparent px-8 [--gradient-border-fill:transparent] hover:shadow-lg"
              >
                {ctaSecondary.text}
              </ButtonLink>
            </motion.div>
          </div>

          {/* WhatsApp line */}
          <motion.a
            variants={item}
            custom={1.15}
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noreferrer noopener"
            className="group text-muted-foreground hover:text-foreground mt-8 inline-flex items-center gap-2 text-sm transition-colors"
          >
            <MessageCircle className="h-4 w-4 fill-[#25d366] text-[#25d366] group-hover:motion-safe:animate-pulse" />
            {content?.whatsapp || "Or chat with us directly on WhatsApp"}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </motion.a>
        </motion.div>
      </Container>
    </section>
  );
}
