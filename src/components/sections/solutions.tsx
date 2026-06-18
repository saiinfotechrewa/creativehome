"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/motion";
import { SOLUTIONS } from "@/data/solutions";
import { getIcon } from "@/lib/icons";
import type { Solution } from "@/lib/types";
import type { CardContent, SectionHeadingContent } from "@/lib/homepage-sections";
import { cn, trackSpotlight } from "@/lib/utils";

/** First 9 fill the 3×3 grid; the 10th (Custom Development) goes wide. */
const GRID_SOLUTIONS = SOLUTIONS.slice(0, 9);
const HIGHLIGHT_SOLUTION = SOLUTIONS[9];

/** Minimal render shape shared by static `Solution`s and CMS `CardContent`. */
interface RenderCard {
  key: string;
  icon: string;
  title: string;
  description: string;
  href: string;
  color: string;
  hex: string;
}

const fromSolution = (s: Solution): RenderCard => ({
  key: s.id,
  icon: s.icon,
  title: s.title,
  description: s.shortDescription,
  href: s.href,
  color: s.color,
  hex: s.hex,
});

const fromContent = (c: CardContent, i: number): RenderCard => ({
  key: `${c.title}-${i}`,
  icon: c.icon,
  title: c.title,
  description: c.description,
  href: c.link,
  color: c.color,
  hex: c.hex,
});

export function Solutions({
  content,
}: {
  content?: { heading: SectionHeadingContent | null; items: CardContent[] } | null;
}) {
  const cards = content?.items.length
    ? content.items.map(fromContent)
    : GRID_SOLUTIONS.map(fromSolution);
  const highlight = content?.items.length ? null : HIGHLIGHT_SOLUTION;

  return (
    <section id="solutions" className="scroll-mt-20 pt-28 pb-24 sm:pt-[120px]">
      <Container>
        <SectionHeading
          eyebrow="Our Solutions"
          title={content?.heading?.title || "Software Solutions for Every Business Need"}
          description={
            content?.heading?.description ||
            "From attendance tracking to full business automation — we have the tools to streamline your operations."
          }
        />

        <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <StaggerItem key={card.key} className="h-full">
              <SolutionCard card={card} />
            </StaggerItem>
          ))}
        </Stagger>

        {highlight ? (
          <Reveal className="mt-5">
            <HighlightCard solution={highlight} />
          </Reveal>
        ) : null}

        {/* Bottom CTA */}
        <Reveal className="mt-16 flex flex-col items-center gap-5 text-center">
          <p className="text-muted-foreground text-base sm:text-lg">
            Not sure which solution fits your business?
          </p>
          <ButtonLink
            href="/#contact"
            size="lg"
            variant="primary"
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            Get Free Consultation
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Cards                                                              */
/* ------------------------------------------------------------------ */

function SolutionCard({ card }: { card: RenderCard }) {
  const Icon = getIcon(card.icon);

  return (
    <Link
      href={card.href}
      onMouseMove={trackSpotlight}
      style={{ "--accent-border": `${card.hex}4d` } as CSSProperties}
      className="group bg-card relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#1e1e22] p-7 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-(--accent-border)"
    >
      {/* Cursor-following spotlight in the solution's accent color */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${card.hex}14, transparent 70%)`,
        }}
      />

      <span
        className={cn(
          "relative grid h-12 w-12 place-items-center rounded-xl",
          card.color
        )}
        style={{
          backgroundColor: `${card.hex}1a`,
          boxShadow: `0 0 24px -6px ${card.hex}66`,
        }}
      >
        <Icon className="h-5 w-5" />
      </span>

      <h3 className="text-foreground relative mt-5 text-xl font-semibold">
        {card.title}
      </h3>
      <p className="text-muted relative mt-2 line-clamp-2 text-sm leading-relaxed">
        {card.description}
      </p>

      <span className="text-primary relative mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium">
        Learn More
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

/** Full-width Custom Development highlight card below the grid. */
function HighlightCard({ solution }: { solution: Solution }) {
  const Icon = getIcon(solution.icon);

  return (
    <Link
      href={solution.href}
      onMouseMove={trackSpotlight}
      style={{ "--accent-border": `${solution.hex}4d` } as CSSProperties}
      className="group bg-card relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-[#1e1e22] p-7 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-(--accent-border) sm:p-8 lg:flex-row lg:items-center lg:justify-between"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${solution.hex}14, transparent 70%)`,
        }}
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <span
          className={cn(
            "grid h-14 w-14 shrink-0 place-items-center rounded-xl",
            solution.color
          )}
          style={{
            backgroundColor: `${solution.hex}1a`,
            boxShadow: `0 0 28px -6px ${solution.hex}66`,
          }}
        >
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-foreground text-xl font-semibold sm:text-2xl">
            Need something built just for you?
          </h3>
          <p className="text-muted-foreground mt-1.5 max-w-xl text-sm leading-relaxed">
            {solution.shortDescription} Web apps, mobile apps, portals, and
            integrations — designed around your exact workflows.
          </p>
        </div>
      </div>

      <span className="border-border bg-accent text-foreground group-hover:border-primary/50 relative inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-md border px-6 text-sm font-medium transition-colors lg:self-auto">
        Start a Project
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
