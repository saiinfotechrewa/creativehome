import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/shared/motion";
import { SOCIAL_LINKS } from "@/lib/constants";

/** Closing CTA band for the About page. */
export function AboutCTA() {
  return (
    <section className="py-24 sm:py-28">
      <Container>
        <Reveal className="relative overflow-hidden rounded-2xl border border-white/10 px-6 py-16 text-center sm:px-16">
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
              Let&apos;s build something
            </span>
            <h2 className="text-foreground mx-auto mt-5 max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to see what CreativeDox can do for you?
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-relaxed sm:text-lg">
              Book a free, no-pressure walkthrough with our team and see your
              own data running inside CreativeDox.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink
                href="/contact"
                variant="accent"
                size="lg"
                iconRight={<ArrowRight className="h-4 w-4" />}
              >
                Get in Touch
              </ButtonLink>
              <ButtonLink
                href={SOCIAL_LINKS.whatsapp}
                external
                variant="outline"
                size="lg"
                iconLeft={
                  <MessageCircle className="h-4 w-4 fill-[#25d366] text-[#25d366]" />
                }
              >
                Chat on WhatsApp
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
