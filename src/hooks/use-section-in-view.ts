"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

interface UseSectionInViewOptions {
  /** How much of the section must be visible to count (0–1). Default 0.2. */
  threshold?: number;
  /** Margin around the viewport, e.g. "-80px". */
  rootMargin?: string;
  /** When true, stays `true` after the first intersection. Default true. */
  once?: boolean;
}

interface UseSectionInViewResult<T extends HTMLElement> {
  ref: RefObject<T | null>;
  inView: boolean;
}

/**
 * Detect when a section enters the viewport via IntersectionObserver.
 *
 * @example
 * const { ref, inView } = useSectionInView<HTMLDivElement>();
 * return <section ref={ref}>{inView ? <Chart /> : null}</section>;
 */
export function useSectionInView<T extends HTMLElement = HTMLElement>({
  threshold = 0.2,
  rootMargin = "0px",
  once = true,
}: UseSectionInViewOptions = {}): UseSectionInViewResult<T> {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
