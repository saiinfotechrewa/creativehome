"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { INDUSTRIES } from "@/data/industries";
import { getSolution } from "@/data/solutions";
import { getIcon } from "@/lib/icons";
import type { Industry } from "@/lib/types";
import type { CardContent, SectionHeadingContent } from "@/lib/homepage-sections";
import { cn, trackSpotlight } from "@/lib/utils";

type CardSize = "large" | "medium" | "small";

/** Bento layout: 3-col dense grid — larges span 2, the rest fill in. */
const CARD_SIZE: Record<string, CardSize> = {
  "retail-shops": "large",
  "schools-education": "large",
  "cable-tv-operators": "medium",
  manufacturing: "medium",
  agencies: "medium",
  "service-providers": "small",
  startups: "small",
};

/** Render shape shared by static `Industry`s and CMS `CardContent`. */
interface RenderCard {
  key: string;
  icon: string;
  name: string;
  description: string;
  href: string;
  color: string;
  hex: string;
  gradient: string;
  size: CardSize;
  tags: string[];
}

const fromIndustry = (ind: Industry): RenderCard => ({
  key: ind.id,
  icon: ind.icon,
  name: ind.name,
  description: ind.description,
  href: ind.href,
  color: ind.color,
  hex: ind.hex,
  gradient: ind.gradient,
  size: CARD_SIZE[ind.id] ?? "medium",
  tags: ind.relevantSolutions
    .map((id) => getSolution(id)?.title)
    .filter((title): title is string => Boolean(title)),
});

const fromContent = (c: CardContent, i: number): RenderCard => ({
  key: `${c.title}-${i}`,
  icon: c.icon,
  name: c.title,
  description: c.description,
  href: c.link,
  color: c.color,
  hex: c.hex,
  gradient: c.gradient,
  // First card spans wide; the rest are uniform medium tiles.
  size: i === 0 ? "large" : "medium",
  tags: [],
});

export function Industries({
  content,
}: {
  content?: { heading: SectionHeadingContent | null; items: CardContent[] } | null;
}) {
  const cards = content?.items.length
    ? content.items.map(fromContent)
    : INDUSTRIES.map(fromIndustry);

  return (
    <section
      id="industries"
      className="scroll-mt-20 bg-[linear-gradient(180deg,#09090b_0%,#0b0b10_50%,#09090b_100%)] py-28 sm:py-[120px]"
    >
      <Container>
        <SectionHeading
          eyebrow="Industries"
          title={content?.heading?.title || "Built for Your Industry"}
          description={
            content?.heading?.description ||
            "Solutions designed with your industry's unique challenges in mind."
          }
        />

        <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-flow-dense lg:grid-cols-3">
          {cards.map((card) => (
            <StaggerItem
              key={card.key}
              className={cn("h-full", card.size === "large" && "sm:col-span-2")}
            >
              <IndustryCard card={card} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

function IndustryCard({ card }: { card: RenderCard }) {
  const Icon = getIcon(card.icon);
  const large = card.size === "large";
  const tags = card.tags;

  return (
    <Link
      href={card.href}
      onMouseMove={trackSpotlight}
      style={{ "--accent-border": `${card.hex}4d` } as CSSProperties}
      className={cn(
        "group bg-card relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#1e1e22] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-(--accent-border)",
        large ? "p-8" : "p-7"
      )}
    >
      {/* Faint industry gradient wash */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-linear-to-br",
          card.gradient,
          large ? "opacity-[0.07]" : "opacity-[0.04]"
        )}
      />

      {/* Cursor-following spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background: `radial-gradient(${large ? 380 : 280}px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${card.hex}14, transparent 70%)`,
        }}
      />

      {/* Abstract pattern on large cards */}
      {large ? <CardPattern className={card.color} /> : null}

      <span
        className={cn(
          "relative grid place-items-center rounded-xl",
          card.color,
          large ? "h-14 w-14" : "h-12 w-12"
        )}
        style={{
          backgroundColor: `${card.hex}1a`,
          boxShadow: `0 0 24px -6px ${card.hex}66`,
        }}
      >
        <Icon className={large ? "h-6 w-6" : "h-5 w-5"} />
      </span>

      <h3
        className={cn(
          "text-foreground relative mt-5 font-semibold",
          large ? "text-2xl" : "text-lg"
        )}
      >
        {card.name}
      </h3>
      <p
        className={cn(
          "text-muted-foreground relative mt-2 text-sm leading-relaxed",
          !large && "line-clamp-3"
        )}
      >
        {card.description}
      </p>

      <span className="text-primary relative mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
        Explore Industry
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>

      {/* Relevant solution tags */}
      <span className="relative mt-auto flex flex-wrap gap-1.5 pt-5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="border-border bg-background/60 text-muted-foreground rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
          >
            {tag}
          </span>
        ))}
      </span>
    </Link>
  );
}

/** Decorative concentric arcs in the card's accent color. */
function CardPattern({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      fill="none"
      className={cn(
        "pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 opacity-[0.08] transition-opacity duration-300 group-hover:opacity-[0.14]",
        className
      )}
    >
      {[30, 55, 80, 105].map((r) => (
        <circle
          key={r}
          cx="100"
          cy="100"
          r={r}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ))}
      <circle cx="100" cy="100" r="8" fill="currentColor" />
    </svg>
  );
}
