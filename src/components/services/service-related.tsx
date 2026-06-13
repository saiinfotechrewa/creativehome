import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { SERVICE_CARDS } from "@/data/services";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * "Explore other services" — cross-links to the sibling service pages.
 * Pulls from the overview cards, keeps only entries that route to a
 * service detail page, and drops the one being viewed.
 */
export function ServiceRelated({ slug }: { slug: string }) {
  const others = SERVICE_CARDS.filter(
    (card) => card.href.startsWith("/services/") && card.id !== slug
  );

  if (others.length === 0) return null;

  return (
    <section className="border-border/60 border-t bg-[#0b0b0e] py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Explore More"
          title="Other ways we can help"
          description="Most projects touch more than one practice. Here's the rest of what we build."
        />

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((card) => {
            const Icon = getIcon(card.icon);
            return (
              <StaggerItem key={card.id}>
                <Link href={card.href} className="group block h-full">
                  <SpotlightCard
                    color={`${card.hex}1f`}
                    className="group-hover:border-muted h-full transition-colors duration-300"
                  >
                    <span
                      className={cn(
                        "inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]",
                        card.color
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-foreground mt-4 text-base font-semibold">
                      {card.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {card.description}
                    </p>
                    <span
                      className={cn(
                        "mt-4 inline-flex items-center gap-1.5 text-sm font-medium",
                        card.color
                      )}
                    >
                      Explore
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
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
