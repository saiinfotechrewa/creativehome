import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { getIcon } from "@/lib/icons";
import type { ServiceDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

/** "What We Build" — deliverable examples in a spotlight-card grid. */
export function ServiceDeliverables({ service }: { service: ServiceDetail }) {
  return (
    <section id="deliverables" className="scroll-mt-32 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="What We Build"
          title="Deliverables, not slideware"
          description="Every engagement ships working software your team can use. Here's the kind of thing we deliver in this practice."
        />

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {service.deliverables.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <StaggerItem key={item.title}>
                <SpotlightCard
                  color={`${service.hex}1f`}
                  className="h-full transition-colors duration-300 hover:border-muted"
                >
                  <span
                    className={cn(
                      "inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]",
                      service.color
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-foreground mt-4 text-base font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {item.description}
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
