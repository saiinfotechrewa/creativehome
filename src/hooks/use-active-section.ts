"use client";

import { useEffect, useState } from "react";

/**
 * Track which page section is currently in view, by element id.
 * Returns the id of the last section whose top has crossed `offset`
 * (the fixed-navbar height), or null when above the first section.
 *
 * Scroll work is rAF-coalesced, so it costs one layout read per
 * section per frame at most.
 *
 * @example
 * const active = useActiveSection(["hero", "solutions", "contact"]);
 */
export function useActiveSection(
  ids: readonly string[],
  offset = 96
): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);

  return active;
}
