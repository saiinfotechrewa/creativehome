"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { animate, motion, type PanInfo } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/shared/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { PRODUCTS } from "@/data/products";
import { EASE } from "@/lib/animations";
import type { Product, ProductBadge } from "@/lib/types";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5000;
const CARD_GAP = 24;
const MAX_CARD_WIDTH = 400;

const badgeVariant: Partial<
  Record<ProductBadge, "primary" | "success" | "warning" | "secondary">
> = {
  Popular: "primary",
  New: "success",
  "Best Value": "warning",
  "Best Seller": "warning",
  Trending: "secondary",
};

export function ProductShowcase() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  // Measure the viewport so the active card is mathematically centered.
  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setViewportWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cardWidth =
    viewportWidth > 0
      ? Math.min(MAX_CARD_WIDTH, viewportWidth - 32)
      : MAX_CARD_WIDTH;
  const trackX =
    viewportWidth > 0
      ? viewportWidth / 2 - cardWidth / 2 - index * (cardWidth + CARD_GAP)
      : 0;

  const goTo = useCallback((target: number) => {
    setIndex(((target % PRODUCTS.length) + PRODUCTS.length) % PRODUCTS.length);
  }, []);

  // Auto-advance; resets whenever the index changes (manual nav included).
  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [index, paused, reducedMotion, goTo]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) goTo(index + 1);
    else if (info.offset.x > 60) goTo(index - 1);
  };

  return (
    <section
      id="products"
      className="scroll-mt-20 bg-[linear-gradient(180deg,#09090b_0%,#0d0d12_50%,#09090b_100%)] py-28 sm:py-[120px]"
    >
      <Container>
        <SectionHeading
          eyebrow="Our Products"
          title="Ready-to-Use Business Software"
          description="Start using any product today. No setup complexity. No long contracts."
        />
      </Container>

      {/* Carousel — full-bleed, centered card math handles the rest */}
      <Reveal className="relative mt-16">
        <div
          ref={viewportRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="overflow-hidden py-4"
        >
          <motion.div
            className="flex cursor-grab will-change-transform active:cursor-grabbing"
            style={{ gap: CARD_GAP }}
            animate={{ x: trackX }}
            transition={{ type: "spring", stiffness: 230, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={onDragEnd}
          >
            {PRODUCTS.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                active={i === index}
                width={cardWidth}
              />
            ))}
          </motion.div>
        </div>

        {/* Navigation arrows */}
        <CarouselArrow direction="prev" onClick={() => goTo(index - 1)} />
        <CarouselArrow direction="next" onClick={() => goTo(index + 1)} />
      </Reveal>

      {/* Dot indicators */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {PRODUCTS.map((product, i) => (
          <button
            key={product.id}
            type="button"
            aria-label={`Go to ${product.name}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "bg-primary w-6" : "bg-border hover:bg-muted w-1.5"
            )}
          />
        ))}
      </div>

      {/* CTA */}
      <Reveal className="mt-12 text-center">
        <Link
          href="/#contact"
          className="text-primary after:bg-primary relative inline-flex items-center gap-1.5 text-sm font-medium after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:transition-[width] after:duration-300 hover:after:w-full"
        >
          See All Products &amp; Compare Plans
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */

function ProductCard({
  product,
  active,
  width,
}: {
  product: Product;
  active: boolean;
  width: number;
}) {
  return (
    <motion.article
      id={product.id}
      animate={{ scale: active ? 1.05 : 0.95, opacity: active ? 1 : 0.7 }}
      transition={{ type: "spring", stiffness: 230, damping: 30 }}
      style={{ width }}
      className={cn(
        "group bg-card flex shrink-0 scroll-mt-24 flex-col overflow-hidden rounded-[20px] border border-[#1e1e22] transition-[border-color,box-shadow] duration-300",
        active &&
          "z-10 hover:border-[#2c2c33] hover:shadow-[0_0_60px_rgba(59,130,246,0.1)]"
      )}
    >
      {/* Screenshot mockup */}
      <div className="relative overflow-hidden border-b border-[#1e1e22] bg-[#0a0a0d]">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-white/5 bg-white/[0.03] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="text-muted ml-3 truncate rounded-md bg-white/5 px-2.5 py-0.5 text-[10px]">
            app.creativedox.com/{product.id}
          </span>
        </div>

        {/* Dashboard area */}
        <div className="relative h-44">
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 bg-linear-to-br opacity-25",
              product.gradient
            )}
          />
          <MockDashboard />
        </div>

        {/* Shine sweep on hover (center card) */}
        {active ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
          />
        ) : null}

        {/* Badge */}
        {product.badge ? (
          <span className="absolute top-12 right-3">
            <Badge variant={badgeVariant[product.badge] ?? "primary"}>
              {product.badge}
            </Badge>
          </span>
        ) : null}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-foreground text-xl font-bold">{product.name}</h3>
        <p className="text-muted-foreground mt-1 truncate text-sm">
          {product.tagline}
        </p>

        <ul className="mt-4 space-y-2">
          {product.features.map((feature) => (
            <li
              key={feature}
              className="text-muted-foreground flex items-center gap-2 text-sm"
            >
              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-5">
          <div className="text-muted text-xs">Starting at</div>
          <div className="text-foreground text-2xl font-bold tracking-tight">
            <PriceCounter value={product.priceMonthly} active={active} />
            <span className="text-muted-foreground text-sm font-medium">
              /month
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <ButtonLink
            href={product.demoUrl}
            external
            variant="primary"
            size="sm"
          >
            Get Demo
          </ButtonLink>
          <ButtonLink
            href={product.loginUrl}
            external
            variant="ghost"
            size="sm"
          >
            Login
          </ButtonLink>
          <ButtonLink href={product.buyUrl} variant="accent" size="sm">
            Buy Now
          </ButtonLink>
        </div>
      </div>
    </motion.article>
  );
}

/** Counts the price up from 0 each time the card lands in the center. */
function PriceCounter({ value, active }: { value: number; active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const wasActive = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const render = (v: number) =>
      (node.textContent = `₹${new Intl.NumberFormat("en-IN").format(
        Math.round(v)
      )}`);

    if (!active || reducedMotion) {
      wasActive.current = active;
      render(value);
      return;
    }
    if (wasActive.current) return;
    wasActive.current = true;

    const controls = animate(0, value, {
      duration: 0.8,
      ease: EASE,
      onUpdate: render,
    });
    return () => controls.stop();
  }, [active, value, reducedMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      ₹{new Intl.NumberFormat("en-IN").format(value)}
    </span>
  );
}

/** Abstract dashboard mockup — stat chips, a bar chart, and table rows. */
function MockDashboard() {
  const bars = [34, 58, 42, 72, 50, 88, 64, 78];
  return (
    <div
      aria-hidden
      className="relative flex h-full flex-col gap-2.5 p-4 transition-transform duration-500 ease-out group-hover:-translate-y-1.5"
    >
      {/* Stat chips */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 rounded-md border border-white/10 bg-white/[0.06] p-2"
          >
            <div className="h-1.5 w-8 rounded-full bg-white/25" />
            <div className="mt-1.5 h-2.5 w-12 rounded-full bg-white/40" />
          </div>
        ))}
      </div>
      {/* Bar chart */}
      <div className="flex flex-1 items-end gap-1.5 rounded-md border border-white/10 bg-white/[0.04] p-2.5">
        {bars.map((height, i) => (
          <div
            key={i}
            style={{ height: `${height}%` }}
            className="flex-1 rounded-sm bg-white/25"
          />
        ))}
      </div>
      {/* Table rows */}
      <div className="space-y-1.5">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-white/30" />
            <div className="h-1.5 flex-1 rounded-full bg-white/15" />
            <div className="h-1.5 w-8 rounded-full bg-white/25" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Controls                                                           */
/* ------------------------------------------------------------------ */

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
      aria-label={direction === "prev" ? "Previous product" : "Next product"}
      onClick={onClick}
      className={cn(
        "border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card absolute top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 sm:grid",
        direction === "prev" ? "left-4 lg:left-10" : "right-4 lg:right-10"
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
