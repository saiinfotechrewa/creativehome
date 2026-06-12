"use client";

import { motion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { EASE } from "@/lib/animations";
import { cn } from "@/lib/utils";

const HEADLINE = "Software that quietly runs your business";
const GRADIENT_WORDS = new Set(["quietly", "runs"]);

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay },
  }),
};

/** About page hero — word-by-word animated headline over a gradient field. */
export function AboutHero() {
  const words = HEADLINE.split(" ");

  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      <div
        aria-hidden
        className="from-primary/35 to-secondary/25 pointer-events-none absolute -top-44 left-1/2 h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-radial opacity-30 blur-[130px]"
      />
      <div
        aria-hidden
        className="bg-grid absolute inset-0 opacity-[0.18]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,#09090b)]"
      />

      <Container className="relative">
        <motion.div
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <motion.div variants={item} custom={0}>
            <Badge variant="primary" featured>
              About CreativeDox
            </Badge>
          </motion.div>

          <h1
            aria-label={HEADLINE}
            className="text-foreground mt-7 text-balance text-4xl font-extrabold tracking-[-0.02em] sm:text-5xl lg:text-6xl lg:leading-[1.1]"
          >
            {words.map((word, i) => {
              const gradient = GRADIENT_WORDS.has(word);
              return (
                <motion.span
                  key={word + i}
                  aria-hidden
                  variants={item}
                  custom={0.15 + i * 0.07}
                  className={cn(
                    "inline-block whitespace-pre",
                    gradient &&
                      "bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent"
                  )}
                >
                  {word}{" "}
                </motion.span>
              );
            })}
          </h1>

          <motion.p
            variants={item}
            custom={0.15 + words.length * 0.07}
            className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed"
          >
            We&apos;re a product studio from the heart of India, building
            ready-to-use business software and automation that growing teams
            actually enjoy using — no bloat, no lock-in, no nonsense.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
