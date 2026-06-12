"use client";

import { motion, useSpring } from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** How strongly the element is pulled toward the cursor (0–1). Default 0.35. */
  strength?: number;
}

/**
 * Wrapper that makes its child subtly drift toward the cursor while
 * hovered — a premium micro-interaction for primary CTAs. Wrap a
 * `<Button>` or `<ButtonLink>`:
 *
 * @example
 * <MagneticButton>
 *   <ButtonLink href="/#contact">Get started</ButtonLink>
 * </MagneticButton>
 *
 * Disabled under `prefers-reduced-motion`.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.35,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const spring = { stiffness: 180, damping: 15, mass: 0.1 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    const rect = el.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x, y }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}
