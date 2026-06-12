"use client";

import { Package, Workflow, Wrench, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/motion";

interface Pillar {
  icon: LucideIcon;
  title: string;
  body: string;
  color: string;
}

const PILLARS: Pillar[] = [
  {
    icon: Package,
    title: "Ready-to-use products",
    body: "A growing suite of business apps — CRM, GST accounting, attendance, and WhatsApp marketing — that work on day one, not after months of setup.",
    color: "text-sky-400",
  },
  {
    icon: Workflow,
    title: "Automation & workflows",
    body: "We connect the dots between tools and teams so the repetitive work — reminders, follow-ups, reports — happens on its own, reliably.",
    color: "text-violet-400",
  },
  {
    icon: Wrench,
    title: "Custom development",
    body: "When off-the-shelf isn't enough, we design and build software around your exact process, then stay on to support and scale it with you.",
    color: "text-amber-400",
  },
];

/** What We Do — three pillars with icons. */
export function WhatWeDo() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="What We Do"
          title="Three ways we move your business forward"
          description="Whether you need something off the shelf or built from scratch, we've got a lane for it."
        />

        <Stagger className="mt-14 grid gap-10 md:grid-cols-3">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <StaggerItem key={p.title} className="flex flex-col items-start">
                <span
                  className={`grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] ${p.color}`}
                >
                  <Icon className="h-7 w-7" strokeWidth={1.75} />
                </span>
                <h3 className="text-foreground mt-6 text-xl font-semibold">
                  {p.title}
                </h3>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  {p.body}
                </p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
