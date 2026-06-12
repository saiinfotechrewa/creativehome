"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Radius of the spotlight in px. Default 320. */
  radius?: number;
  /** CSS color of the glow. Defaults to a very subtle primary blue. */
  color?: string;
}

/**
 * Card where a radial light gradient follows the mouse cursor —
 * the Linear.app-style "spotlight" effect. The glow is intentionally
 * subtle; raise `color` opacity for a stronger effect.
 */
export function SpotlightCard({
  children,
  className,
  radius = 320,
  color = "rgba(59, 130, 246, 0.1)",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn(
        "group border-border bg-card relative overflow-hidden rounded-lg border p-6",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(${radius}px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${color}, transparent 65%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
