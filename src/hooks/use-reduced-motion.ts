"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Respect the user's `prefers-reduced-motion` accessibility setting.
 * Components should skip or simplify animations when this returns true.
 *
 * SSR-safe — returns `false` until mounted on the client.
 *
 * @example
 * const reducedMotion = useReducedMotion();
 * if (reducedMotion) return <StaticVersion />;
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
