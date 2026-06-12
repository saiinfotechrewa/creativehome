import type { TargetAndTransition, Variants } from "framer-motion";

/**
 * Reusable Framer Motion variants for the CreativeDox design system.
 *
 * Variants pair with `initial="hidden"` / `whileInView="visible"` (or
 * `animate="visible"`). Objects typed `TargetAndTransition` are meant for
 * the `whileHover` / `animate` props directly.
 */

/** Signature easing curve used across the site (cubic-bezier(0.16, 1, 0.3, 1)). */
export const EASE = [0.16, 1, 0.3, 1] as const;

const enter = (duration = 0.6) => ({ duration, ease: EASE });

/* ------------------------------------------------------------------ */
/*  Scroll reveals                                                     */
/* ------------------------------------------------------------------ */

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: enter() },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: enter() },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: enter() },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: enter() },
};

/** Larger-offset entrance for panels / media that slide in from off-grid. */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -64 },
  visible: { opacity: 1, x: 0, transition: enter(0.7) },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 64 },
  visible: { opacity: 1, x: 0, transition: enter(0.7) },
};

/** Starts blurred and out of focus, resolves to sharp. */
export const blurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(12px)" },
  visible: { opacity: 1, filter: "blur(0px)", transition: enter(0.7) },
};

/** Bouncy spring entrance for icons, badges, and stat chips. */
export const springScale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
};

/* ------------------------------------------------------------------ */
/*  Stagger orchestration (grids, lists)                               */
/* ------------------------------------------------------------------ */

/** Put on the parent — staggers the entrance of `staggerItem` children. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/** Put on each child of a `staggerContainer`. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: enter() },
};

/* ------------------------------------------------------------------ */
/*  Text reveals                                                       */
/* ------------------------------------------------------------------ */

/** Parent for word-by-word reveals — wrap the heading element. */
export const textRevealContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

/** Child variant for each word inside a `textRevealContainer`. */
export const textReveal: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  visible: { opacity: 1, y: 0, transition: enter(0.5) },
};

/** Parent for character-by-character typewriter reveals. */
export const typewriterContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
};

/** Child variant for each character inside a `typewriterContainer`. */
export const typewriter: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
};

/* ------------------------------------------------------------------ */
/*  SVG                                                                */
/* ------------------------------------------------------------------ */

/** Draws an SVG path from 0 → full length. Use on `motion.path`. */
export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.4, ease: EASE },
      opacity: { duration: 0.3 },
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Interaction + ambient (use with `whileHover` / `animate`)          */
/* ------------------------------------------------------------------ */

/** Pass to `whileHover` for a gentle card scale-up. */
export const scaleOnHover: TargetAndTransition = {
  scale: 1.03,
  transition: { duration: 0.3, ease: EASE },
};

/** Pass to `animate` for a continuous, gentle Y-axis float. */
export const floatingAnimation: TargetAndTransition = {
  y: [0, -10, 0],
  transition: { duration: 5, ease: "easeInOut", repeat: Infinity },
};

/** Pass to `animate` on glow layers for a slow breathing pulse. */
export const pulseGlow: TargetAndTransition = {
  opacity: [0.5, 1, 0.5],
  transition: { duration: 3, ease: "easeInOut", repeat: Infinity },
};
