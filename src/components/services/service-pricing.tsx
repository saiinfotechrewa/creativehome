import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { getIcon } from "@/lib/icons";
import type { ServiceDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

/** "Pricing Model" — fixed / hourly / retainer engagement options. */
export function ServicePricing({ service }: { service: ServiceDetail }) {
  return (
    <section id="pricing" className="scroll-mt-32 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Pricing Model"
          title="Engage the way that suits you"
          description="Fixed price for defined scope, hourly for evolving work, or a monthly retainer for an ongoing partnership."
        />

        <Stagger className="mt-14 grid gap-6 lg:grid-cols-3">
          {service.pricing.map((model) => {
            const Icon = getIcon(model.icon);
            const recommended = model.recommended;
            return (
              <StaggerItem key={model.id}>
                <div
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 transition-colors",
                    recommended
                      ? "border-transparent"
                      : "border-border bg-card hover:border-muted"
                  )}
                >
                  {recommended && (
                    <>
                      <div
                        aria-hidden
                        className={cn(
                          "absolute inset-0 bg-linear-to-br opacity-[0.14]",
                          service.gradient
                        )}
                      />
                      <div
                        aria-hidden
                        className="gradient-border-animated pointer-events-none absolute inset-0 rounded-2xl [--gradient-border-fill:var(--color-card)]"
                      />
                    </>
                  )}

                  <div className="relative flex flex-1 flex-col">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-lg",
                          service.gradient
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      {recommended && (
                        <Badge variant="primary" featured>
                          Most popular
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-foreground mt-5 text-lg font-semibold">
                      {model.label}
                    </h3>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="text-foreground text-3xl font-bold tracking-tight">
                        {model.price}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {model.unit}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                      {model.description}
                    </p>

                    <ul className="mt-6 space-y-3">
                      {model.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check
                            className={cn(
                              "mt-0.5 h-4 w-4 shrink-0",
                              service.color
                            )}
                          />
                          <span className="text-muted-foreground text-sm leading-snug">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 pt-2">
                      <ButtonLink
                        href="/book-consultation"
                        variant={recommended ? "accent" : "secondary"}
                        size="md"
                        className="w-full"
                      >
                        Get a quote
                      </ButtonLink>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        <p className="text-muted-foreground mt-8 text-center text-sm">
          Every estimate is free and itemized. No hidden fees, no lock-in.
        </p>
      </Container>
    </section>
  );
}
