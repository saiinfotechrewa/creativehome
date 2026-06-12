import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { MouseEvent as ReactMouseEvent } from "react";

/**
 * Merge Tailwind classes intelligently — `clsx` handles conditional
 * class joining, `tailwind-merge` resolves conflicting utilities so the
 * last one wins (e.g. `px-2 px-4` -> `px-4`).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a number into a compact, human-readable string (e.g. 1.2k). */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Format an ISO date (YYYY-MM-DD) as e.g. "12 June 2026". */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Build an absolute URL from the configured site URL + a path. */
export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://creativedox.com";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Track the cursor inside an element for spotlight hover effects.
 * Writes `--spot-x` / `--spot-y` CSS variables consumed by a
 * `radial-gradient(... at var(--spot-x) var(--spot-y))` overlay.
 */
export function trackSpotlight(event: ReactMouseEvent<HTMLElement>): void {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
  el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
}

/** Smooth-scroll to an element by id (client-side only). */
export function scrollToId(id: string): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id.replace(/^#/, ""));
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
