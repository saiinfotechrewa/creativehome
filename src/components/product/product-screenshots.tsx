"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/shared/motion";
import { BrowserMockup } from "@/components/product/browser-mockup";
import { EASE } from "@/lib/animations";
import type { ProductDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

const MOCK_VARIANTS = ["dashboard", "list", "chart"] as const;

/** Interactive screenshot carousel with browser mockups and captions. */
export function ProductScreenshots({ detail }: { detail: ProductDetail }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const count = detail.screenshots.length;

  const goTo = (target: number) => {
    setDirection(target > index ? 1 : -1);
    setIndex(((target % count) + count) % count);
  };

  const active = detail.screenshots[index] ?? detail.screenshots[0];
  if (!active) return null;

  return (
    <section className="border-border/60 border-y bg-[#0b0b0e] py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Inside the Product"
          title="See it before you try it"
          description="A quick tour of the screens your team will live in every day."
        />

        <Reveal className="relative mx-auto mt-14 max-w-3xl">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 48 * direction }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -48 * direction }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <BrowserMockup
                  url={`app.creativedox.com/${detail.productId}`}
                  gradient={detail.gradient}
                  variant={MOCK_VARIANTS[index % MOCK_VARIANTS.length]}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Arrows */}
          <CarouselArrow direction="prev" onClick={() => goTo(index - 1)} />
          <CarouselArrow direction="next" onClick={() => goTo(index + 1)} />

          {/* Caption */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={active.caption}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="text-muted-foreground mt-6 text-center text-sm"
            >
              {active.caption}
            </motion.p>
          </AnimatePresence>

          {/* Dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {detail.screenshots.map((screenshot, i) => (
              <button
                key={screenshot.src}
                type="button"
                aria-label={`Show screenshot ${i + 1}`}
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
        </Reveal>
      </Container>
    </section>
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
        direction === "prev" ? "Previous screenshot" : "Next screenshot"
      }
      onClick={onClick}
      className={cn(
        "border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 sm:grid",
        direction === "prev" ? "-left-5 lg:-left-14" : "-right-5 lg:-right-14"
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
