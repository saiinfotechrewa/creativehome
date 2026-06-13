import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/shared/motion";
import type { IndustryDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Closing call-to-action band: "Get Started". */
export function IndustryCTA({ industry }: { industry: IndustryDetail }) {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal className="relative overflow-hidden rounded-2xl border border-white/10 px-6 py-14 text-center sm:px-16">
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 bg-linear-to-br opacity-[0.18]",
              industry.gradient
            )}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]"
          />

          <div className="relative">
            <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className={cn("h-3.5 w-3.5", industry.color)} />
              Free consultation & demo
            </span>
            <h2 className="text-foreground mx-auto mt-5 max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to modernize your {industry.shortName.toLowerCase()} business?
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-relaxed sm:text-lg">
              See CreativeDox running on your exact workflow. We&apos;ll show you
              a tailored demo and a clear plan — no jargon, no obligation.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink
                href="/book-consultation"
                variant="accent"
                size="lg"
                iconRight={<ArrowRight className="h-4 w-4" />}
              >
                Get Started
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary" size="lg">
                Talk to our team
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
