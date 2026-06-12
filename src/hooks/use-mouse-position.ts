"use client";

import { useEffect, useState, type RefObject } from "react";

export interface MousePosition {
  x: number;
  y: number;
}

/**
 * Track the mouse position for spotlight / parallax effects.
 *
 * Without an argument, returns viewport-relative coordinates. Pass an
 * element ref to get coordinates relative to that element instead
 * (useful for spotlight cards).
 *
 * @example
 * const { x, y } = useMousePosition();
 * const local = useMousePosition(cardRef);
 */
export function useMousePosition(
  ref?: RefObject<HTMLElement | null>
): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const el = ref?.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        setPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      } else {
        setPosition({ x: event.clientX, y: event.clientY });
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [ref]);

  return position;
}
