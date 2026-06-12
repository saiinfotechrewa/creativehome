import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/shared/motion";
import type { Product, ProductDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductCtaProps {
  detail: ProductDetail;
  product: Product;
}

/** Closing CTA band tinted with the product gradient. */
export function ProductCTA({ detail, product }: ProductCtaProps) {
  const shortName = detail.name.replace("CreativeDox ", "");

  return (
    <section className="py-24 sm:py-28">
      <Container>
        <Reveal className="relative overflow-hidden rounded-2xl border border-white/10 px-6 py-16 text-center sm:px-16 sm:py-20">
          {/* Gradient wash + grid texture */}
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 bg-linear-to-br opacity-15",
              detail.gradient
            )}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[480px] -translate-x-1/2 rounded-full opacity-30 blur-[100px]"
            style={{ background: detail.hex }}
          />

          <div className="relative">
            <h2 className="text-foreground mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to try {shortName}?
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-relaxed sm:text-lg">
              See it working with your own data in a free, no-pressure demo —
              and go live within the week.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink
                href={product.demoUrl}
                external
                variant="primary"
                size="lg"
                iconRight={<ArrowRight className="h-4 w-4" />}
              >
                Get Free Demo
              </ButtonLink>
              <ButtonLink href="/#contact" variant="secondary" size="lg">
                Talk to Sales
              </ButtonLink>
            </div>
            <p className="text-muted mt-6 text-xs">
              Free onboarding · Hindi & English support · No long contracts
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
