import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { getSolution } from "@/data/solutions";
import { getIcon } from "@/lib/icons";
import type { IndustryDetail, Solution } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * "Our Solutions" — the CreativeDox products best fit to this industry.
 * Resolves the industry's `solutions` slugs against the solutions catalog
 * and links each card to its `/solutions/[slug]` page.
 */
export function IndustrySolutions({ industry }: { industry: IndustryDetail }) {
  const solutions = industry.solutions
    .map((slug) => getSolution(slug))
    .filter((entry): entry is Solution => Boolean(entry));

  if (solutions.length === 0) return null;

  return (
    <section
      id="solutions"
      className="border-border/60 scroll-mt-24 border-y bg-[#0b0b0e] py-24 sm:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="Our Solutions"
          title={`The CreativeDox stack for ${industry.shortName.toLowerCase()}`}
          description="Proven products that work on their own and share data when you combine them."
        />

        <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
          {solutions.map((solution) => {
            const Icon = getIcon(solution.icon);
            return (
              <StaggerItem key={solution.id}>
                <Link
                  href={solution.href}
                  className="group block h-full"
                >
                  <SpotlightCard
                    color={`${solution.hex}1f`}
                    className="group-hover:border-muted flex h-full flex-col transition-colors duration-300"
                  >
                    <span
                      className={cn(
                        "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-lg",
                        solution.gradient
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-foreground mt-5 text-lg font-semibold">
                      {solution.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {solution.shortDescription}
                    </p>

                    <ul className="mt-5 space-y-2.5">
                      {solution.features.slice(0, 3).map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5"
                        >
                          <Check
                            className={cn(
                              "mt-0.5 h-4 w-4 shrink-0",
                              solution.color
                            )}
                          />
                          <span className="text-muted-foreground text-sm leading-snug">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <span
                      className={cn(
                        "mt-6 inline-flex items-center gap-1.5 text-sm font-medium",
                        solution.color
                      )}
                    >
                      Explore solution
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </SpotlightCard>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
