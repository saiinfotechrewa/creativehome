import { ArrowRight, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/shared/motion";
import { SITE_CONFIG } from "@/lib/constants";

export function CTA() {
  return (
    <section id="contact" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <Reveal className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 text-center sm:px-16 sm:py-24">
          {/* Glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[640px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Ready to automate what slows you down?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Book a free strategy call and we&apos;ll map the highest-impact
              automations for your team — no obligation, no sales pressure.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <ButtonLink href="/#contact" size="lg" variant="primary">
                Book a strategy call
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href={`mailto:${SITE_CONFIG.email}`}
                size="lg"
                variant="outline"
                external
              >
                <Mail className="h-4 w-4" />
                {SITE_CONFIG.email}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
