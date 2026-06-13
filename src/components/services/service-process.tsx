import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { getIcon } from "@/lib/icons";
import type { ServiceDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

/** "Our Process" — a numbered, connected timeline of 4–6 steps. */
export function ServiceProcess({ service }: { service: ServiceDetail }) {
  return (
    <section id="process" className="scroll-mt-32 py-24 sm:py-28">
      {/* Subtle tinted backdrop to separate the section */}
      <div className="relative">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent to-transparent opacity-40",
            service.gradient
          )}
        />
        <Container>
          <SectionHeading
            eyebrow="Our Process"
            title="A delivery process you can see into"
            description="No black boxes. You always know what's being built, what's next, and what it costs."
          />

          <Stagger className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Connecting line on large screens */}
            <div
              aria-hidden
              className="border-border/60 pointer-events-none absolute inset-x-0 top-7 hidden border-t border-dashed lg:block"
            />

            {service.process.map((step) => {
              const Icon = getIcon(step.icon);
              return (
                <StaggerItem key={step.step}>
                  <div className="border-border bg-card relative h-full overflow-hidden rounded-lg border p-6">
                    <div
                      aria-hidden
                      className={cn(
                        "absolute -right-10 -top-10 h-28 w-28 rounded-full bg-linear-to-br opacity-10 blur-2xl",
                        service.gradient
                      )}
                    />
                    <div className="relative flex items-center gap-4">
                      <span
                        className={cn(
                          "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-lg",
                          service.gradient
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
      </div>
    </section>
  );
}
