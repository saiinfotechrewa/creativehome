"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Intercepts same-page anchor clicks (e.g. "/#solutions") and smooth-
 * scrolls to the target instead of jumping. Complements the global
 * `scroll-behavior: smooth` / `scroll-padding-top` CSS by also updating
 * the URL hash without a hard navigation.
 *
 * Respects `prefers-reduced-motion` (falls back to an instant jump).
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement).closest?.(
        "a[href*='#']"
      ) as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank") return;

      const url = new URL(anchor.href, window.location.href);
      const samePage =
        url.origin === window.location.origin &&
        url.pathname === window.location.pathname;
      if (!samePage || !url.hash) return;

      const target = document.getElementById(
        decodeURIComponent(url.hash.slice(1))
      );
      if (!target) return;

      event.preventDefault();
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      history.pushState(null, "", url.hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <>{children}</>;
}
