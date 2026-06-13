import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { BrandGlyph } from "@/components/services/brand-glyph";
import type { ServiceDetail } from "@/lib/types";

/** "Technologies" — the tech stack rendered as brand-logo chips. */
export function ServiceTechnologies({ service }: { service: ServiceDetail }) {
  return (
    <section id="technologies" className="scroll-mt-32 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Technologies"
          title="A modern, battle-tested stack"
          description="We pick proven tools over trends — the ones that stay fast, secure, and maintainable years from now."
        />

        <Stagger className="mx-auto mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-3 sm:gap-4">
          {service.technologies.map((tech) => (
            <StaggerItem key={tech}>
              <div className="group border-border bg-card hover:border-muted flex items-center gap-3 rounded-full border py-2 pr-5 pl-2 transition-all duration-300 hover:-translate-y-0.5">
                <BrandGlyph
                  name={tech}
                  gradient={service.gradient}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span className="text-foreground text-sm font-medium">
                  {tech}
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
