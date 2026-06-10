import { ArrowUpRight, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { SOLUTIONS } from "@/data/solutions";

export function Solutions() {
  return (
    <section id="solutions" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Solutions"
          title="Everything you need to automate the busywork"
          description="From bespoke applications to end-to-end automations, we build the operational backbone your team relies on every day."
        />

        <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((solution) => {
            const Icon = solution.icon;
            return (
              <StaggerItem key={solution.id}>
                <Card interactive className="flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-accent text-primary transition-colors group-hover:border-primary/40">
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </div>

                  <CardTitle className="mt-5">{solution.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {solution.description}
                  </CardDescription>

                  <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
                    {solution.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2.5 text-sm text-muted-foreground"
                      >
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
