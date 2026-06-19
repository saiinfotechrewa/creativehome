"use client";

import type { CSSProperties } from "react";
import { motion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/container";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/shared/motion";
import { ADVANTAGES } from "@/data/advantages";
import { getIcon } from "@/lib/icons";
import { EASE } from "@/lib/animations";
import type { Advantage } from "@/lib/types";
import type { CardContent, SectionHeadingContent } from "@/lib/homepage-sections";
import { cn, trackSpotlight } from "@/lib/utils";

/** Render shape shared by static `Advantage`s and CMS `CardContent`. */
interface RenderCard {
  key: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  hex: string;
}

const fromAdvantage = (a: Advantage): RenderCard => ({
  key: a.id,
  icon: a.icon,
  title: a.title,
  description: a.description,
  color: a.color,
  hex: a.hex,
});

const fromContent = (c: CardContent, i: number): RenderCard => ({
  key: `${c.title}-${i}`,
  icon: c.icon,
  title: c.title,
  description: c.description,
  color: c.color,
  hex: c.hex,
});

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
};

const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: [0.6, 1.12, 1],
    transition: { duration: 0.5, ease: EASE },
  },
};

export function WhyChooseUs({
  content,
}: {
  content?: { heading: SectionHeadingContent | null; items: CardContent[] } | null;
}) {
  const cards = content?.items.length
    ? content.items.map(fromContent)
    : ADVANTAGES.map(fromAdvantage);

  return (
    <section id="why-us" className="scroll-mt-20 py-28 sm:py-[120px]">
      <Container>
        <div className="grid gap-14 lg:grid-cols-5 lg:gap-12">
          {/* Sticky heading column */}
          <div className="lg:col-span-2">
            <div className="flex flex-col lg:sticky lg:top-[120px]">
              <SectionHeading
                align="left"
                eyebrow="Why CreativeDox"
                title={content?.heading?.title || "Why 500+ Businesses Choose CreativeDox"}
                description={
                  content?.heading?.description ||
                  "We combine enterprise-grade software with startup-friendly pricing and dedicated human support."
                }
              />

              <Reveal delay={0.3} className="mt-10">
                <div className="text-foreground text-6xl font-extrabold tracking-tight sm:text-7xl">
                  <AnimatedCounter value={500} suffix="+" glow />
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  businesses growing with CreativeDox every day
                </p>
              </Reveal>
            </div>
          </div>

          {/* Advantage cards */}
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-5 sm:grid-cols-2 lg:col-span-3"
          >
            {cards.map((card) => (
              <motion.div key={card.key} variants={cardVariants} className="h-full">
                <AdvantageCard advantage={card} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function AdvantageCard({ advantage }: { advantage: RenderCard }) {
  const Icon = getIcon(advantage.icon);

  return (
    <div
      onMouseMove={trackSpotlight}
      style={{ "--accent-border": `${advantage.hex}4d` } as CSSProperties}
      className="group bg-card relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#1e1e22] p-7 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-(--accent-border)"
    >
      {/* Cursor-following spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background: `radial-gradient(260px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${advantage.hex}14, transparent 70%)`,
        }}
      />

      <motion.span
        variants={iconVariants}
        className={cn(
          "relative grid h-11 w-11 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-105",
          advantage.color
        )}
        style={{
          backgroundColor: `${advantage.hex}1a`,
          boxShadow: `0 0 24px -6px ${advantage.hex}66`,
        }}
      >
        <Icon className="h-5 w-5" />
      </motion.span>

      <h3 className="text-foreground relative mt-5 text-lg font-semibold">
        {advantage.title}
      </h3>
      <p className="text-muted-foreground relative mt-2 text-sm leading-relaxed">
        {advantage.description}
      </p>
    </div>
  );
}
