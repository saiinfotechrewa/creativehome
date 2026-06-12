"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { STATS } from "@/data/stats";
import type { Stat } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatMeta {
  icon: LucideIcon;
  color: string;
  hex: string;
  gradient: string;
}

const STAT_META: Record<string, StatMeta> = {
  businesses: {
    icon: Building2,
    color: "text-sky-400",
    hex: "#38bdf8",
    gradient: "from-sky-500/25 to-blue-600/25",
  },
  users: {
    icon: Users,
    color: "text-violet-400",
    hex: "#a78bfa",
    gradient: "from-violet-500/25 to-purple-600/25",
  },
  projects: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    hex: "#34d399",
    gradient: "from-emerald-500/25 to-teal-600/25",
  },
  automations: {
    icon: Zap,
    color: "text-amber-400",
    hex: "#fbbf24",
    gradient: "from-amber-500/25 to-orange-600/25",
  },
};

const FALLBACK_META: StatMeta = {
  icon: Zap,
  color: "text-primary",
  hex: "#3b82f6",
  gradient: "from-primary/25 to-secondary/25",
};

/** Full-width impact strip of four massive scroll-triggered counters. */
export function Stats() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="stats"
      className="border-border/50 relative scroll-mt-20 overflow-hidden border-y bg-[linear-gradient(135deg,#0c1220_0%,#09090b_50%,#120c20_100%)] py-24 sm:py-28"
    >
      {/* Atmosphere */}
      <div aria-hidden className="absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-25" />
        <div className="absolute -top-40 left-[10%]">
          <motion.div
            animate={
              reducedMotion ? undefined : { x: [0, 40, 0], y: [0, 24, 0] }
            }
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
            className="bg-primary/10 h-[480px] w-[480px] rounded-full blur-[140px] will-change-transform"
          />
        </div>
        <div className="absolute right-[5%] -bottom-48">
          <motion.div
            animate={
              reducedMotion ? undefined : { x: [0, -40, 0], y: [0, -20, 0] }
            }
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
            className="bg-secondary/10 h-[420px] w-[420px] rounded-full blur-[130px] will-change-transform"
          />
        </div>
      </div>

      <Container className="relative">
        <Stagger className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <StaggerItem key={stat.id} className="relative h-full">
              {/* Gradient divider between counters (desktop) */}
              {index > 0 ? (
                <span
                  aria-hidden
                  className="via-border absolute top-1/2 -left-2.5 hidden h-28 w-px -translate-y-1/2 bg-linear-to-b from-transparent to-transparent lg:block"
                />
              ) : null}
              <ImpactStat stat={stat} index={index} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

function ImpactStat({ stat, index }: { stat: Stat; index: number }) {
  const [done, setDone] = useState(false);
  const reducedMotion = useReducedMotion();
  const meta = STAT_META[stat.id] ?? FALLBACK_META;
  const Icon = meta.icon;

  return (
    <div className="flex h-full flex-col items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-8 text-center backdrop-blur-md sm:px-6 sm:py-10">
      {/* Glass icon circle */}
      <span
        className={cn(
          "grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-linear-to-br backdrop-blur",
          meta.gradient,
          meta.color
        )}
      >
        <Icon className="h-9 w-9" strokeWidth={1.75} />
      </span>

      {/* Number with landing pulse, glow flash, and ripple */}
      <div className="relative">
        {done && !reducedMotion ? (
          <motion.span
            aria-hidden
            initial={{ opacity: 0.5, scale: 0.7 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute -inset-3 rounded-full border"
            style={{ borderColor: meta.hex }}
          />
        ) : null}
        <motion.span
          aria-hidden
          animate={done ? { opacity: [0, 0.45, 0.15] } : { opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute -inset-5 rounded-full blur-2xl"
          style={{ backgroundColor: meta.hex }}
        />
        <motion.div
          animate={done ? { scale: [1.08, 1] } : undefined}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-foreground relative text-4xl font-extrabold tracking-[-0.02em] sm:text-5xl lg:text-6xl"
          style={{ textShadow: "0 0 32px var(--color-glow-primary)" }}
        >
          <AnimatedCounter
            value={stat.value}
            duration={3}
            delay={index * 0.3}
            onComplete={() => setDone(true)}
          />
          <span className="text-gradient">{stat.suffix}</span>
        </motion.div>
      </div>

      <div className="text-muted text-base">{stat.label}</div>
    </div>
  );
}
