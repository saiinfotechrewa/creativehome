"use client";

import { motion } from "framer-motion";
import { useEffect, useId, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";

interface AnimatedBeamProps {
  /** Positioned ancestor (`relative`) that contains both endpoints. */
  containerRef: RefObject<HTMLElement | null>;
  /** Element the beam starts from. */
  fromRef: RefObject<HTMLElement | null>;
  /** Element the beam ends at. */
  toRef: RefObject<HTMLElement | null>;
  /** Vertical bend of the curve in px. Positive bends up. Default 0 (straight). */
  curvature?: number;
  /** Reverses the direction the energy travels. */
  reverse?: boolean;
  /** Seconds for one full sweep. Default 5. */
  duration?: number;
  /** Delay in seconds before the animation starts. */
  delay?: number;
  /** Color of the static base path. */
  pathColor?: string;
  pathWidth?: number;
  gradientStart?: string;
  gradientStop?: string;
  /** Show the glowing particle that travels along the path. Default true. */
  particle?: boolean;
  className?: string;
}

/**
 * SVG beam connecting two elements, with an animated blue→purple energy
 * gradient and a glowing particle traveling along the path. Used for
 * integration / connection visualizations.
 *
 * Render inside the container, after both endpoints:
 *
 * @example
 * <div ref={containerRef} className="relative">
 *   <div ref={fromRef} /> <div ref={toRef} />
 *   <AnimatedBeam containerRef={containerRef} fromRef={fromRef} toRef={toRef} curvature={40} />
 * </div>
 */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 5,
  delay = 0,
  pathColor = "var(--color-border)",
  pathWidth = 1.5,
  gradientStart = "#3b82f6",
  gradientStop = "#8b5cf6",
  particle = true,
  className,
}: AnimatedBeamProps) {
  const id = useId();
  const gradientId = `beam-gradient-${id}`;
  const glowId = `beam-glow-${id}`;
  const [pathD, setPathD] = useState("");
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const from = fromRef.current;
      const to = toRef.current;
      if (!container || !from || !to) return;

      const containerRect = container.getBoundingClientRect();
      const rectA = from.getBoundingClientRect();
      const rectB = to.getBoundingClientRect();

      const startX = rectA.left - containerRect.left + rectA.width / 2;
      const startY = rectA.top - containerRect.top + rectA.height / 2;
      const endX = rectB.left - containerRect.left + rectB.width / 2;
      const endY = rectB.top - containerRect.top + rectB.height / 2;
      const controlY = (startY + endY) / 2 - curvature;

      setSize({ width: containerRect.width, height: containerRect.height });
      setPathD(
        `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, fromRef, toRef, curvature]);

  if (!pathD) return null;

  return (
    <svg
      fill="none"
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      className={cn(
        "pointer-events-none absolute top-0 left-0 transform-gpu",
        className
      )}
      aria-hidden
    >
      <defs>
        <motion.linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
          animate={{
            x1: reverse ? ["90%", "-10%"] : ["10%", "110%"],
            x2: reverse ? ["100%", "0%"] : ["0%", "100%"],
            y1: ["0%", "0%"],
            y2: ["0%", "0%"],
          }}
          transition={{
            delay,
            duration,
            ease: [0.16, 1, 0.3, 1],
            repeat: Infinity,
          }}
        >
          <stop stopColor={gradientStart} stopOpacity="0" />
          <stop stopColor={gradientStart} />
          <stop offset="32.5%" stopColor={gradientStop} />
          <stop offset="100%" stopColor={gradientStop} stopOpacity="0" />
        </motion.linearGradient>
        <filter id={glowId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Static base path */}
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity="0.4"
        strokeLinecap="round"
      />
      {/* Animated energy gradient */}
      <path
        d={pathD}
        stroke={`url(#${gradientId})`}
        strokeWidth={pathWidth}
        strokeLinecap="round"
      />
      {/* Glowing particle traveling along the path */}
      {particle && (
        <circle r="3" fill={gradientStart} filter={`url(#${glowId})`}>
          <animateMotion
            dur={`${duration}s`}
            begin={`${delay}s`}
            repeatCount="indefinite"
            path={pathD}
            keyPoints={reverse ? "1;0" : "0;1"}
            keyTimes="0;1"
          />
        </circle>
      )}
    </svg>
  );
}
