"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Ambient radial glow that trails the cursor — the Linear.app-style
 * premium lighting effect. Extremely low opacity, large radius, and
 * desktop-only (skipped on touch devices and under reduced motion).
 */
export function CursorGlow() {
  const hasPointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = useReducedMotion();

  // Start far off-screen so the glow doesn't flash at (0, 0) on mount.
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const springConfig = { stiffness: 120, damping: 25, mass: 0.4 };
  const glowX = useSpring(x, springConfig);
  const glowY = useSpring(y, springConfig);

  useEffect(() => {
    if (!hasPointer || reducedMotion) return;
    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [hasPointer, reducedMotion, x, y]);

  if (!hasPointer || reducedMotion) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        x: glowX,
        y: glowY,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.03) 40%, transparent 70%)",
      }}
      className="pointer-events-none fixed top-0 left-0 z-20 h-[600px] w-[600px] rounded-full"
    />
  );
}
