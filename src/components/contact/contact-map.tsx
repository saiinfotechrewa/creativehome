import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/shared/motion";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Map embed placeholder — drop a real Google Maps `<iframe>` here later.
 * Styled as a dark, grid-textured panel with a pulsing location pin.
 */
export function ContactMap() {
  return (
    <section className="pb-24 sm:pb-28">
      <Container>
        <Reveal className="border-border bg-card relative h-[360px] overflow-hidden rounded-2xl border sm:h-[420px]">
          {/* Grid texture + radial glow stand in for the map tiles */}
          <div aria-hidden className="bg-grid absolute inset-0 opacity-30" />
          <div
            aria-hidden
            className="from-primary/15 absolute inset-0 bg-radial to-transparent opacity-60"
          />

          {/* Pulsing pin */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative flex flex-col items-center">
              <span className="relative grid h-14 w-14 place-items-center">
                <span className="bg-primary/30 absolute inset-0 animate-ping rounded-full" />
                <span className="border-primary/40 bg-card relative grid h-12 w-12 place-items-center rounded-full border shadow-[0_0_28px_-4px_var(--color-glow-primary)]">
                  <MapPin className="text-primary h-6 w-6" />
                </span>
              </span>
              <div className="border-border bg-card/80 mt-4 rounded-full border px-4 py-1.5 text-sm backdrop-blur">
                <span className="text-foreground font-medium">
                  {SITE_CONFIG.name}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  · {SITE_CONFIG.address}
                </span>
              </div>
            </div>
          </div>

          {/* Corner caption */}
          <span className="border-border bg-card/70 text-muted absolute bottom-4 left-4 rounded-md border px-2.5 py-1 text-xs backdrop-blur">
            Map embed placeholder
          </span>
        </Reveal>
      </Container>
    </section>
  );
}
