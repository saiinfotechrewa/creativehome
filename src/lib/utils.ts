import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

/** Build an absolute URL from the configured site URL + a path. */
export function absoluteUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://creativedox.com";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Smooth-scroll to an element by id (client-side only). */
export function scrollToId(id: string): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id.replace(/^#/, ""));
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
