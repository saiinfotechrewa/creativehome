"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  /** Target number to count up to. */
  value: number;
  /** Rendered before the number, e.g. "$". */
  prefix?: string;
  /** Rendered after the number, e.g. "+", "%", "K", "M". */
  suffix?: string;
  /** Animation duration in seconds. Default 2. */
  duration?: number;
  /** Seconds to wait after entering the viewport before counting. */
  delay?: number;
  /** Decimal places. Defaults to the precision of `value` (e.g. 99.99 → 2). */
  decimals?: number;
  /** Adds a soft primary glow behind the number. */
  glow?: boolean;
  /** Called once the count finishes (immediately under reduced motion). */
  onComplete?: () => void;
  className?: string;
}

/**
 * Counts from 0 to `value` the first time it scrolls into view, with an
 * ease-out deceleration. Respects `prefers-reduced-motion` by rendering
 * the final value immediately.
 *
 * @example
 * <AnimatedCounter value={480} suffix="+" />
 * <AnimatedCounter value={99.99} suffix="%" glow />
 */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 2,
  delay = 0,
  decimals,
  glow,
  onComplete,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reducedMotion = useReducedMotion();
  const [completed, setCompleted] = useState(false);

  const places = decimals ?? countDecimals(value);

  // Keep the latest callback without re-triggering the animation effect.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (!completed) return;
    onCompleteRef.current?.();
  }, [completed]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;

    const render = (current: number) => {
      node.textContent = `${prefix}${format(current, places)}${suffix}`;
    };

    if (reducedMotion) {
      render(value);
      setCompleted(true);
      return;
    }

    const controls = animate(0, value, {
      duration,
      delay,
      ease: EASE,
      onUpdate: render,
      onComplete: () => setCompleted(true),
    });
    return () => controls.stop();
  }, [inView, reducedMotion, value, prefix, suffix, duration, delay, places]);

  return (
    <span
      ref={ref}
      className={cn("tabular-nums", className)}
      style={
        glow ? { textShadow: "0 0 24px var(--color-glow-primary)" } : undefined
      }
    >
      {`${prefix}${format(0, places)}${suffix}`}
    </span>
  );
}

function countDecimals(value: number): number {
  if (Number.isInteger(value)) return 0;
  return value.toString().split(".")[1]?.length ?? 0;
}

function format(value: number, decimals: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
