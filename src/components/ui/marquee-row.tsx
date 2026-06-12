import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeRowProps {
  children: ReactNode;
  className?: string;
  /** Seconds for one full loop. Default 40. */
  duration?: number;
  /** Gap between items (CSS length). Default "3rem". */
  gap?: string;
  /** Scroll right-to-left by default; set true to reverse. */
  reverse?: boolean;
  /** Pause the scroll while hovered. Default true. */
  pauseOnHover?: boolean;
  /** Fade the row out at the left/right edges. Default true. */
  fadeEdges?: boolean;
}

/**
 * Infinite horizontal scrolling row for logos, tech stacks, and
 * integrations. Pure CSS animation (no JS) — the content is rendered
 * twice and translated by exactly one copy's width per loop.
 *
 * Stops automatically under `prefers-reduced-motion`.
 *
 * @example
 * <MarqueeRow duration={30}>
 *   {logos.map((logo) => <Logo key={logo.name} {...logo} />)}
 * </MarqueeRow>
 */
export function MarqueeRow({
  children,
  className,
  duration = 40,
  gap = "3rem",
  reverse = false,
  pauseOnHover = true,
  fadeEdges = true,
}: MarqueeRowProps) {
  return (
    <div
      className={cn(
        "group flex w-full gap-(--marquee-gap) overflow-hidden",
        fadeEdges &&
          "[mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]",
        className
      )}
      style={
        {
          "--marquee-duration": `${duration}s`,
          "--marquee-gap": gap,
        } as CSSProperties
      }
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={cn(
            "animate-marquee flex min-w-full shrink-0 items-center justify-around gap-(--marquee-gap)",
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
