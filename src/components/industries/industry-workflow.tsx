import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { getIcon } from "@/lib/icons";
import type { IndustryDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

/** "Workflow" — how CreativeDox runs day-to-day for this industry. */
export function IndustryWorkflow({ industry }: { industry: IndustryDetail }) {
  return (
    <section id="workflow" className="scroll-mt-24 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="How It Works"
          title={`A day in your ${industry.shortName.toLowerCase()} business, on CreativeDox`}
          description="The same operations you run today — only faster, connected, and visible end to end."
        />

        <Stagger className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line on large screens */}
          <div
            aria-hidden
            className="border-border/60 pointer-events-none absolute inset-x-0 top-7 hidden border-t border-dashed lg:block"
          />

          {industry.workflow.map((step) => {
            const Icon = getIcon(step.icon);
            return (
              <StaggerItem key={step.step}>
                <div className="border-border bg-card relative h-full overflow-hidden rounded-lg border p-6">
                  <div
                    aria-hidden
                    className={cn(
                      "absolute -top-10 -right-10 h-28 w-28 rounded-full bg-linear-to-br opacity-10 blur-2xl",
                      industry.gradient
                    )}
                  />
                  <div className="relative flex items-center gap-4">
                    <span
                      className={cn(
                        "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-lg",
                        industry.gradient
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-muted-foreground/60 text-3xl font-bold tabular-nums">
                      {String(step.step).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-foreground mt-5 text-base font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
