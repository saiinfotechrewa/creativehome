"use client";

import { ArrowRight, Briefcase, LifeBuoy, Handshake, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { SITE_CONFIG } from "@/lib/constants";

interface ConnectCard {
  icon: LucideIcon;
  title: string;
  body: string;
  cta: string;
  href: string;
  hex: string;
  color: string;
  gradient: string;
}

const CARDS: ConnectCard[] = [
  {
    icon: Briefcase,
    title: "Sales",
    body: "Pricing, demos, and figuring out which CreativeDox products fit your business.",
    cta: "Talk to sales",
    href: `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent("Sales enquiry")}`,
    hex: "#38bdf8",
    color: "text-sky-400",
    gradient: "from-sky-500/20 to-blue-600/20",
  },
  {
    icon: LifeBuoy,
    title: "Support",
    body: "Already a customer? Get help with setup, billing, or anything that's not working right.",
    cta: "Get support",
    href: `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent("Support request")}`,
    hex: "#34d399",
    color: "text-emerald-400",
    gradient: "from-emerald-500/20 to-teal-600/20",
  },
  {
    icon: Handshake,
    title: "Partnership",
    body: "Resellers, agencies, and integration partners — let's explore working together.",
    cta: "Partner with us",
    href: `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent("Partnership enquiry")}`,
    hex: "#a78bfa",
    color: "text-violet-400",
    gradient: "from-violet-500/20 to-purple-600/20",
  },
];

/** Quick-connect cards routing each enquiry type to the right inbox. */
export function QuickConnect() {
  return (
    <section className="border-border/60 border-t bg-[#0b0b0e] py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Quick Connect"
          title="Know who you need? Go straight there"
          description="Three direct lines so your message lands with the right team from the start."
        />

        <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <StaggerItem key={card.title} className="h-full">
                <SpotlightCard
                  color={`${card.hex}24`}
                  className="hover:border-muted flex h-full flex-col p-8 transition-colors duration-300"
                >
                  <span
                    className={`grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-linear-to-br ${card.gradient} ${card.color}`}
                  >
                    <Icon className="h-7 w-7" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-foreground mt-6 text-xl font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 flex-1 leading-relaxed">
                    {card.body}
                  </p>
                  <a
                    href={card.href}
                    className="text-primary group mt-6 inline-flex items-center gap-1.5 text-sm font-medium"
                  >
                    {card.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
