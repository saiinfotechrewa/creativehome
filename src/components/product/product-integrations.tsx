import { Plug } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import type { ProductDetail } from "@/lib/types";

/** Chips of tools and devices the product connects with. */
export function ProductIntegrations({ detail }: { detail: ProductDetail }) {
  return (
    <section className="py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Integrations"
          title="Plays well with what you already use"
          description="Connect your existing tools and devices — no rip-and-replace required."
        />

        <Stagger className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-3">
          {detail.integrations.map((integration) => (
            <StaggerItem key={integration}>
              <span className="border-border bg-card text-muted-foreground hover:text-foreground hover:border-muted inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200">
                <Plug className="h-3.5 w-3.5 opacity-60" />
                {integration}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
