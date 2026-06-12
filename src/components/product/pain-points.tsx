import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { getIcon } from "@/lib/icons";
import type { ProductDetail } from "@/lib/types";

/** "Still doing X manually?" — the problems this product removes. */
export function PainPoints({ detail }: { detail: ProductDetail }) {
  return (
    <section className="border-border/60 border-y bg-[#0b0b0e] py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="The Problem"
          title={detail.painPointsHeading}
          description="These are the costs businesses quietly absorb every month — until they automate."
        />

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {detail.painPoints.map((point) => {
            const Icon = getIcon(point.icon);
            return (
              <StaggerItem
                key={point.title}
                className="group relative overflow-hidden rounded-lg border border-red-500/15 bg-red-500/[0.03] p-6 transition-colors duration-300 hover:border-red-500/30"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-red-500/20 bg-red-500/10 text-red-400">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-foreground mt-4 text-base font-semibold">
                  {point.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {point.description}
                </p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
