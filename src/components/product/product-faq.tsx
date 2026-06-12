"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/shared/motion";
import { EASE } from "@/lib/animations";
import type { ProductDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Expandable FAQ accordion with smooth height animation. */
export function ProductFAQ({ detail }: { detail: ProductDetail }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-border/60 border-y bg-[#0b0b0e] py-24 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          description="Everything businesses ask us before getting started — answered straight."
        />

        <Reveal className="mt-12 space-y-3">
          {detail.faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.question}
                className={cn(
                  "border-border bg-card overflow-hidden rounded-lg border transition-colors duration-300",
                  isOpen && "border-muted"
                )}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-foreground text-sm font-medium sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "text-muted h-4 w-4 shrink-0 transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="text-muted-foreground px-5 pb-5 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
