"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Calculator,
  Clock,
  MessageCircle,
  PieChart,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Canvas coordinates — the wrapper scales responsively via transform. */
const SIZE = 600;
const CENTER = SIZE / 2;
const RADIUS = 215;
/** Seconds for one full orbit of the ring. */
const ORBIT_DURATION = 60;

interface NetworkNode {
  label: string;
  icon: LucideIcon;
  /** Tailwind text color for the icon. */
  color: string;
  /** Tailwind shadow color for the card glow. */
  glow: string;
  /** Hex used for the SVG line accents + traveling particle. */
  hex: string;
  /** Seconds for the particle to travel center → node. */
  particleDuration: number;
}

const NODES: NetworkNode[] = [
  {
    label: "CRM",
    icon: Users,
    color: "text-violet-400",
    glow: "shadow-violet-500/20",
    hex: "#8b5cf6",
    particleDuration: 3.6,
  },
  {
    label: "WhatsApp",
    icon: MessageCircle,
    color: "text-green-400",
    glow: "shadow-green-500/20",
    hex: "#22c55e",
    particleDuration: 4.4,
  },
  {
    label: "Accounting",
    icon: Calculator,
    color: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    hex: "#10b981",
    particleDuration: 5.2,
  },
  {
    label: "Attendance",
    icon: Clock,
    color: "text-sky-400",
    glow: "shadow-sky-500/20",
    hex: "#0ea5e9",
    particleDuration: 4,
  },
  {
    label: "Marketing",
    icon: TrendingUp,
    color: "text-orange-400",
    glow: "shadow-orange-500/20",
    hex: "#f97316",
    particleDuration: 4.8,
  },
  {
    label: "Reports",
    icon: BarChart3,
    color: "text-indigo-400",
    glow: "shadow-indigo-500/20",
    hex: "#6366f1",
    particleDuration: 5.6,
  },
  {
    label: "Analytics",
    icon: PieChart,
    color: "text-fuchsia-400",
    glow: "shadow-fuchsia-500/20",
    hex: "#d946ef",
    particleDuration: 4.2,
  },
];

/** Position of node `i` on the orbital ring (12 o'clock first). */
function nodePosition(index: number) {
  const angle = -Math.PI / 2 + (index / NODES.length) * Math.PI * 2;
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  };
}

/**
 * Animated network diagram of the CreativeDox ecosystem — a glowing
 * central hub orbited by seven product nodes, with data particles
 * flowing along the connection lines. The ring slowly rotates while
 * each node counter-rotates so the labels stay upright.
 *
 * Lazy-loaded by the hero (client-only); static under reduced motion.
 */
export function HeroNetwork() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="relative will-change-transform"
      style={{ width: SIZE, height: SIZE }}
    >
      {/* Rotating ring: connection lines + orbiting nodes */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        animate={reducedMotion ? undefined : { rotate: 360 }}
        transition={{
          duration: ORBIT_DURATION,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0 h-full w-full"
          fill="none"
          aria-hidden
        >
          {/* Faint orbital guide */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            stroke="var(--color-border)"
            strokeOpacity="0.45"
            strokeDasharray="3 7"
          />

          {NODES.map((node, index) => {
            const { x, y } = nodePosition(index);
            const path = `M ${CENTER},${CENTER} L ${x},${y}`;
            return (
              <g key={node.label}>
                {/* Base connection line */}
                <line
                  x1={CENTER}
                  y1={CENTER}
                  x2={x}
                  y2={y}
                  stroke="var(--color-border)"
                  strokeOpacity="0.6"
                />
                {/* Flowing dash overlay */}
                <line
                  x1={CENTER}
                  y1={CENTER}
                  x2={x}
                  y2={y}
                  stroke={node.hex}
                  strokeOpacity="0.25"
                  strokeDasharray="4 10"
                >
                  {!reducedMotion && (
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-112"
                      dur={`${node.particleDuration * 2}s`}
                      repeatCount="indefinite"
                    />
                  )}
                </line>
                {/* Glowing particle traveling outward */}
                {!reducedMotion && (
                  <circle r="2.5" fill={node.hex} opacity="0.9">
                    <animateMotion
                      dur={`${node.particleDuration}s`}
                      begin={`${index * 0.45}s`}
                      repeatCount="indefinite"
                      path={path}
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Orbiting nodes (counter-rotated so labels stay upright) */}
        {NODES.map((node, index) => {
          const { x, y } = nodePosition(index);
          const Icon = node.icon;
          return (
            <div
              key={node.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y }}
            >
              <motion.div
                animate={reducedMotion ? undefined : { rotate: -360 }}
                transition={{
                  duration: ORBIT_DURATION,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="will-change-transform"
              >
                <motion.div
                  animate={reducedMotion ? undefined : { y: [0, -7, 0] }}
                  transition={{
                    duration: 4 + index * 0.5,
                    delay: index * 0.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span
                    className={cn(
                      "border-border bg-card/90 grid h-12 w-12 place-items-center rounded-xl border shadow-lg backdrop-blur",
                      node.color,
                      node.glow
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-muted-foreground text-[11px] font-medium">
                    {node.label}
                  </span>
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* Central hub (static, above the ring) */}
      <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex flex-col items-center gap-2">
          <span
            aria-hidden
            className="bg-primary/40 absolute -inset-3 rounded-3xl blur-2xl motion-safe:animate-pulse"
          />
          <div className="from-primary to-secondary border-primary/40 shadow-primary/40 relative grid h-20 w-20 place-items-center rounded-2xl border bg-linear-to-br text-2xl font-bold text-white shadow-2xl">
            {"{}"}
          </div>
          <span className="text-foreground relative text-xs font-semibold tracking-wide">
            CreativeDox
          </span>
        </div>
      </div>
    </div>
  );
}
