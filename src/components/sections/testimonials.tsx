"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  type PanInfo,
  type Variants,
} from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/shared/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { TESTIMONIALS } from "@/data/testimonials";
import { EASE } from "@/lib/animations";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6000;
const COUNT = TESTIMONIALS.length;

/** 3D card transition — enters tilted from one side, exits to the other. */
const cardVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 140 : -140,
    rotateY: direction > 0 ? 15 : -15,
    scale: 0.9,
    opacity: 0,
  }),
  center: { x: 0, rotateY: 0, scale: 1, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -140 : 140,
    rotateY: direction > 0 ? -15 : 15,
    scale: 0.9,
    opacity: 0,
  }),
};

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  const paginate = useCallback((dir: number) => {
    setSlide(([current]) => [(((current + dir) % COUNT) + COUNT) % COUNT, dir]);
  }, []);

  const goTo = (target: number) =>
    setSlide(([current]) => [target, target > current ? 1 : -1]);

  // Auto-advance — pauses on hover, off-screen, and reduced motion.
  useEffect(() => {
    if (paused || reducedMotion || !inView) return;
    const timer = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, reducedMotion, inView, paginate, index]);

  // Keyboard navigation while the section is on screen.
  useEffect(() => {
    if (!inView) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") paginate(1);
      if (event.key === "ArrowLeft") paginate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, paginate]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70) paginate(1);
    else if (info.offset.x > 70) paginate(-1);
  };

  const active = TESTIMONIALS[index]!;
  const previous = TESTIMONIALS[(index - 1 + COUNT) % COUNT]!;
  const next = TESTIMONIALS[(index + 1) % COUNT]!;

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="scroll-mt-20 overflow-hidden bg-[linear-gradient(180deg,#09090b_0%,#0b0b14_50%,#09090b_100%)] py-28 sm:py-[120px]"
    >
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="What Business Owners Say"
          description="Real stories from real businesses that transformed with CreativeDox."
        />

        <div
          className="relative mt-16 [perspective:1400px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Side previews (desktop) — click to navigate */}
          <PreviewCard
            testimonial={previous}
            side="left"
            onClick={() => paginate(-1)}
          />
          <PreviewCard
            testimonial={next}
            side="right"
            onClick={() => paginate(1)}
          />

          {/* Active card */}
          <div className="relative z-10 mx-auto max-w-[700px]">
            <AnimatePresence
              custom={direction}
              mode="popLayout"
              initial={false}
            >
              <motion.div
                key={active.id}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 26,
                  opacity: { duration: 0.3 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={onDragEnd}
                className="cursor-grab will-change-transform active:cursor-grabbing"
              >
                <TestimonialCard testimonial={active} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Arrows */}
          <CarouselArrow direction="prev" onClick={() => paginate(-1)} />
          <CarouselArrow direction="next" onClick={() => paginate(1)} />
        </div>

        {/* Dots */}
        <div className="mt-9 flex items-center justify-center gap-2">
          {TESTIMONIALS.map((testimonial, i) => (
            <button
              key={testimonial.id}
              type="button"
              aria-label={`Show testimonial from ${testimonial.name}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index
                  ? "bg-primary w-6"
                  : "bg-border hover:bg-muted w-1.5"
              )}
            />
          ))}
        </div>

        {/* CTA */}
        <Reveal className="mt-12 text-center">
          <Link
            href="/case-studies"
            className="text-primary after:bg-primary relative inline-flex items-center gap-1.5 text-sm font-medium after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:transition-[width] after:duration-300 hover:after:w-full"
          >
            Read More Success Stories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Cards                                                              */
/* ------------------------------------------------------------------ */

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="gradient-border-animated relative overflow-hidden rounded-3xl [--gradient-border-fill:#131318]">
      {/* #111113 → #161620 surface gradient */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-3xl bg-linear-to-br from-[#111113] to-[#161620]"
      />

      <div className="relative p-8 sm:p-12">
        {/* Decorative quote mark */}
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.45, ease: EASE }}
          className="from-primary to-secondary block bg-linear-to-r bg-clip-text font-serif text-7xl leading-none text-transparent"
        >
          &ldquo;
        </motion.span>

        <blockquote className="text-foreground mt-2 text-lg leading-[1.7] font-medium sm:text-xl">
          {testimonial.quote}
        </blockquote>

        {/* Stars — fill in sequentially */}
        <div className="mt-6 flex gap-1">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.05, duration: 0.3, ease: EASE }}
            >
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
            </motion.span>
          ))}
        </div>

        {/* Divider */}
        <span
          aria-hidden
          className="via-border my-7 block h-px w-full bg-linear-to-r from-transparent to-transparent"
        />

        {/* Author */}
        <div className="flex flex-wrap items-center gap-4">
          <span className="from-primary to-secondary grid h-12 w-12 shrink-0 place-items-center rounded-full bg-linear-to-br text-sm font-bold text-white">
            {testimonial.avatar}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-foreground font-bold">{testimonial.name}</div>
            <div className="text-muted-foreground text-sm">
              {testimonial.role}, {testimonial.company}
            </div>
          </div>
          <Badge variant="primary">{testimonial.industry}</Badge>
        </div>
      </div>
    </article>
  );
}

/** Dimmed, tilted preview of the prev/next testimonial (desktop only). */
function PreviewCard({
  testimonial,
  side,
  onClick,
}: {
  testimonial: Testimonial;
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      key={testimonial.id}
      aria-label={`Show testimonial from ${testimonial.name}`}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        transform: `translateY(-50%) rotateY(${side === "left" ? 22 : -22}deg) scale(0.85)`,
      }}
      className={cn(
        "border-border/70 bg-card/60 absolute top-1/2 z-0 hidden w-72 rounded-2xl border p-6 text-left opacity-50 backdrop-blur-sm transition-opacity duration-300 hover:opacity-80 xl:block",
        side === "left" ? "left-0 2xl:left-10" : "right-0 2xl:right-10"
      )}
    >
      <p className="text-muted-foreground line-clamp-4 text-sm leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-2.5">
        <span className="from-primary to-secondary grid h-8 w-8 shrink-0 place-items-center rounded-full bg-linear-to-br text-[10px] font-bold text-white">
          {testimonial.avatar}
        </span>
        <span className="text-foreground truncate text-xs font-semibold">
          {testimonial.name}
        </span>
      </div>
    </motion.button>
  );
}

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={
        direction === "prev" ? "Previous testimonial" : "Next testimonial"
      }
      onClick={onClick}
      className={cn(
        "border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card absolute top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 sm:grid",
        direction === "prev"
          ? "left-0 xl:-left-2 2xl:-left-16"
          : "right-0 xl:-right-2 2xl:-right-16"
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
