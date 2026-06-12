import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/shared/motion";

/** "Need a Custom Plan?" gradient band below the pricing tables. */
export function CustomPlanCTA() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal className="relative overflow-hidden rounded-2xl border border-white/10 px-6 py-14 text-center sm:px-16">
          <div
            aria-hidden
            className="from-primary to-secondary absolute inset-0 bg-linear-to-br opacity-15"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]"
          />

          <div className="relative">
            <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="text-primary h-3.5 w-3.5" />
              Custom requirements?
            </span>
            <h2 className="text-foreground mx-auto mt-5 max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Need a Custom Plan?
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-relaxed sm:text-lg">
              Multiple products, multiple branches, or something built just for
              you — we&apos;ll put together a plan and a price that fits.
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink
                href="/#contact"
                variant="accent"
                size="lg"
                iconRight={<ArrowRight className="h-4 w-4" />}
              >
                Talk to Our Team
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
