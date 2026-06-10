"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { MOTION } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Shared fade-up variant used across sections. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.duration, ease: MOTION.ease },
  },
};

/** Container that staggers its children on scroll into view. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: MOTION.stagger, delayChildren: 0.05 },
  },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in seconds before the animation starts. */
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "span";
}

/**
 * Reveals its children with a fade-up motion the first time they scroll
 * into view. Lightweight wrapper around Framer Motion's `whileInView`.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "ul";
}

/** Wrap a group of `<Reveal>`-style items to stagger their entrance. */
export function Stagger({ children, className, as = "div" }: StaggerProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
    >
      {children}
    </MotionTag>
  );
}

/** A child item for use inside <Stagger>. */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={cn(className)} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
