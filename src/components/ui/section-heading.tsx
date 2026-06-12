"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/shared/motion";
import { textReveal, textRevealContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

const viewport = { once: true, margin: "-80px" } as const;

/**
 * Consistent eyebrow + title + description block for each section.
 * String titles reveal word by word as the section scrolls into view;
 * ReactNode titles fall back to a single fade-up.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  const headingClasses =
    "max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl";

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        className
      )}
    >
      {eyebrow ? (
        <Reveal>
          <Badge variant="primary" featured>
            {eyebrow}
          </Badge>
        </Reveal>
      ) : null}

      {typeof title === "string" ? (
        <motion.h2
          className={headingClasses}
          aria-label={title}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={textRevealContainer}
        >
          {title.split(" ").map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              aria-hidden
              variants={textReveal}
              className="inline-block whitespace-pre"
            >
              {word}{" "}
            </motion.span>
          ))}
        </motion.h2>
      ) : (
        <Reveal>
          <h2 className={headingClasses}>{title}</h2>
        </Reveal>
      )}

      {description ? (
        <Reveal delay={0.15}>
          <p
            className={cn(
              "text-muted-foreground max-w-2xl text-base leading-relaxed sm:text-lg",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
