"use client";

import { Target, Eye, Heart, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Stagger, StaggerItem } from "@/components/shared/motion";

interface Pillar {
  icon: LucideIcon;
  title: string;
  body: string;
  color: string;
  hex: string;
  gradient: string;
}

const PILLARS: Pillar[] = [
  {
    icon: Target,
    title: "Mission",
    body: "Put powerful, dependable software within reach of every growing business — priced fairly, set up for them, and built to remove the daily grind.",
    color: "text-sky-400",
    hex: "#38bdf8",
    gradient: "from-sky-500/20 to-blue-600/20",
  },
  {
    icon: Eye,
    title: "Vision",
    body: "A future where running a business in India means working on it, not drowning in it — with automation quietly handling the repetitive work behind the scenes.",
    color: "text-violet-400",
    hex: "#a78bfa",
    gradient: "from-violet-500/20 to-purple-600/20",
  },
  {
    icon: Heart,
    title: "Values",
    body: "Honesty over hype, support that actually shows up, and products we'd happily run our own business on. If it's not good enough for us, it doesn't ship.",
    color: "text-rose-400",
    hex: "#fb7185",
    gradient: "from-rose-500/20 to-pink-600/20",
  },
];

/** Mission / Vision / Values — three spotlight cards. */
export function MissionVisionValues() {
  return (
    <section className="border-border/60 border-t bg-[#0b0b0e] py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="What Drives Us"
          title="Mission, vision, and the values behind them"
          description="The principles we keep coming back to when we decide what to build and how to behave."
        />

        <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <StaggerItem key={p.title} className="h-full">
                <SpotlightCard
                  color={`${p.hex}24`}
                  className="hover:border-muted flex h-full flex-col p-8 transition-colors duration-300"
                >
                  <span
                    className={`grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-linear-to-br ${p.gradient} ${p.color}`}
                  >
                    <Icon className="h-7 w-7" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-foreground mt-6 text-xl font-semibold">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    {p.body}
                  </p>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
