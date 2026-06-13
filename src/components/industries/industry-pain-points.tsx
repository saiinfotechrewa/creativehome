import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { getIcon } from "@/lib/icons";
import type { IndustryDetail } from "@/lib/types";

/** "Pain Points" — the 4–5 problems this industry faces today. */
export function IndustryPainPoints({ industry }: { industry: IndustryDetail }) {
  return (
    <section id="challenges" className="scroll-mt-24 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="The Challenges"
          title={`What's slowing ${industry.shortName.toLowerCase()} down`}
          description="If any of these sound familiar, you're not alone — and they're exactly what we fix."
        />

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industry.painPoints.map((pain) => {
            const Icon = getIcon(pain.icon);
            return (
              <StaggerItem key={pain.title}>
                <SpotlightCard
                  color={`${industry.hex}1f`}
                  className="hover:border-muted h-full transition-colors duration-300"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-rose-500/20 bg-rose-500/10 text-rose-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-foreground mt-4 text-base font-semibold">
                    {pain.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {pain.description}
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
