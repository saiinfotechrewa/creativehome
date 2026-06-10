import { Container } from "@/components/ui/container";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { COMPANY_STATS } from "@/lib/constants";

export function Stats() {
  return (
    <section className="border-y border-border bg-card/40 py-16">
      <Container>
        <Stagger className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {COMPANY_STATS.map((stat) => (
            <StaggerItem key={stat.label} className="text-center sm:text-left">
              <div className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-foreground">
                {stat.label}
              </div>
              {stat.description ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.description}
                </p>
              ) : null}
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
