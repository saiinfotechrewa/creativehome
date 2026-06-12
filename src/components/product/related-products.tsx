import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { getProductDetail } from "@/data/product-details";
import { getIcon } from "@/lib/icons";
import { getProduct } from "@/data/products";
import type { ProductDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Three sibling products the visitor might need next. */
export function RelatedProducts({ detail }: { detail: ProductDetail }) {
  const related = detail.relatedProducts
    .map((slug) => getProductDetail(slug))
    .filter((entry): entry is ProductDetail => Boolean(entry));

  if (related.length === 0) return null;

  return (
    <section className="border-border/60 border-t bg-[#0b0b0e] py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Explore More"
          title="Works even better together"
          description="CreativeDox products share data — add one and both get more useful."
        />

        <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
          {related.map((entry) => {
            const product = getProduct(entry.productId);
            const Icon = product ? getIcon(product.icon) : null;
            return (
              <StaggerItem key={entry.slug}>
                <Link href={`/solutions/${entry.slug}`} className="group block h-full">
                  <SpotlightCard
                    color={`${entry.hex}1f`}
                    className="hover:border-muted h-full transition-colors duration-300"
                  >
                    {Icon ? (
                      <span
                        className={cn(
                          "inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]",
                          entry.color
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                    ) : null}
                    <h3 className="text-foreground mt-4 text-base font-semibold">
                      {entry.name}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {entry.tagline}
                    </p>
                    <span
                      className={cn(
                        "mt-4 inline-flex items-center gap-1.5 text-sm font-medium",
                        entry.color
                      )}
                    >
                      Explore
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </SpotlightCard>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
