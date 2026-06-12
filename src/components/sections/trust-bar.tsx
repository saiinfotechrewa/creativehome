"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Headphones,
  Package,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { cn } from "@/lib/utils";

interface TrustStat {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
}

const TRUST_STATS: TrustStat[] = [
  { icon: Building2, value: 500, suffix: "+", label: "Businesses Served" },
  { icon: Package, value: 10, suffix: "+", label: "Software Products" },
  { icon: Users, value: 50000, suffix: "+", label: "Active Users" },
  { icon: Shield, value: 99.9, suffix: "%", label: "Uptime Guarantee" },
  { icon: Headphones, value: 24, suffix: "/7", label: "Support Available" },
];

/**
 * Compact glass strip of animated metrics directly under the hero.
 * Counters start 200ms apart, land with a tiny scale bounce, and glow
 * once finished.
 */
export function TrustBar() {
  return (
    <section
      id="trust"
      className="relative scroll-mt-20 bg-[#0c0c0f]/80 py-8 backdrop-blur-xl"
    >
      {/* Gradient hairline borders */}
      <span
        aria-hidden
        className="from-primary/40 to-secondary/40 absolute inset-x-0 top-0 h-px bg-linear-to-r via-transparent"
      />
      <span
        aria-hidden
        className="from-secondary/40 to-primary/40 absolute inset-x-0 bottom-0 h-px bg-linear-to-r via-transparent"
      />

      <Container>
        <Stagger className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-5 lg:gap-y-0">
          {TRUST_STATS.map((stat, index) => (
            <StaggerItem
              key={stat.label}
              className={cn(
                "lg:border-border/60 lg:border-l lg:first:border-l-0",
                // 5th item: centered full-width row on the 2-col mobile grid
                index === 4 && "col-span-2 lg:col-span-1"
              )}
            >
              <TrustStatItem stat={stat} index={index} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

function TrustStatItem({ stat, index }: { stat: TrustStat; index: number }) {
  const [done, setDone] = useState(false);
  const Icon = stat.icon;

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <Icon className="text-primary h-6 w-6" />
      <motion.div
        animate={done ? { scale: [1.06, 1] } : undefined}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={cn(
          "text-foreground text-3xl font-bold tracking-tight transition-[text-shadow] duration-500 sm:text-4xl",
          done && "[text-shadow:0_0_28px_var(--color-glow-primary)]"
        )}
      >
        <AnimatedCounter
          value={stat.value}
          suffix={stat.suffix}
          duration={2.5}
          delay={index * 0.2}
          onComplete={() => setDone(true)}
        />
      </motion.div>
      <div className="text-muted-foreground text-sm">{stat.label}</div>
    </div>
  );
}
