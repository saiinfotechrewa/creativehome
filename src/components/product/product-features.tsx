import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { getIcon } from "@/lib/icons";
import type { ProductDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Feature grid with the product-tinted spotlight hover effect. */
export function ProductFeatures({ detail }: { detail: ProductDetail }) {
  const shortName = detail.name.replace("CreativeDox ", "");

  return (
    <section id="features" className="scroll-mt-20 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Features"
          title={`Everything ${shortName} handles for you`}
          description="Every feature below ships in the product today — no add-on modules, no surprise costs."
        />

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {detail.features.map((feature) => {
            const Icon = getIcon(feature.icon);
            return (
              <StaggerItem key={feature.title}>
                <SpotlightCard
                  color={`${detail.hex}1f`}
                  className="h-full transition-colors duration-300 hover:border-muted"
                >
                  <span
                    className={cn(
                      "inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]",
                      detail.color
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-foreground mt-4 text-base font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {feature.description}
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
