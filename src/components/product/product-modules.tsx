"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/shared/motion";
import { EASE } from "@/lib/animations";
import type { ProductDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Accordion of every module included in the product. */
export function ProductModules({ detail }: { detail: ProductDetail }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 sm:py-28">
      <Container className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
        <SectionHeading
          align="left"
          eyebrow="Modules"
          title="Every module, included"
          description={`No per-module pricing games — every ${detail.name.replace(
            "CreativeDox ",
            ""
          )} plan ships with the full module set listed here.`}
          className="lg:sticky lg:top-28"
        />

        <Reveal className="border-border bg-card divide-border divide-y rounded-lg border">
          {detail.modules.map((module, i) => {
            const isOpen = open === i;
            return (
              <div key={module.name}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-center gap-4 px-5 py-4 text-left"
                >
                  <span
                    className={cn(
                      "text-xs font-semibold tabular-nums",
                      isOpen ? detail.color : "text-muted"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-sm font-medium transition-colors duration-200",
                      isOpen
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {module.name}
                  </span>
                  <Plus
                    className={cn(
                      "text-muted h-4 w-4 shrink-0 transition-transform duration-300",
                      isOpen && "rotate-45"
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
                      <p className="text-muted-foreground px-5 pb-5 pl-[52px] text-sm leading-relaxed">
                        {module.description}
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
