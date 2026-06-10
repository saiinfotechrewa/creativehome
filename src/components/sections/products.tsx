import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { PRODUCTS } from "@/data/products";
import type { Product } from "@/lib/types";

const statusMeta: Record<
  Product["status"],
  { label: string; variant: "success" | "warning" | "secondary" }
> = {
  live: { label: "Live", variant: "success" },
  beta: { label: "Beta", variant: "warning" },
  "coming-soon": { label: "Coming soon", variant: "secondary" },
};

export function Products() {
  return (
    <section
      id="products"
      className="scroll-mt-20 border-t border-border bg-card/30 py-24 sm:py-32"
    >
      <Container>
        <SectionHeading
          eyebrow="Products"
          title="A platform suite built for operators"
          description="Each product stands alone or works together — pick the pieces you need and connect the rest of your stack."
        />

        <Stagger className="mt-16 grid gap-6 md:grid-cols-2">
          {PRODUCTS.map((product) => {
            const Icon = product.icon;
            const status = statusMeta[product.status];
            return (
              <StaggerItem key={product.id}>
                <Card interactive className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {product.tagline}
                        </p>
                      </div>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {product.highlights.map((h) => (
                      <span
                        key={h}
                        className="rounded-md border border-border bg-accent px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={product.href}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Explore {product.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Card>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
