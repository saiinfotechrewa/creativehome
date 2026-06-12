import { MarqueeRow } from "@/components/ui/marquee-row";
import { Reveal } from "@/components/shared/motion";
import { PARTNER_LOGOS } from "@/data/logos";
import type { PartnerLogo } from "@/lib/types";

const ROW_ONE = PARTNER_LOGOS.slice(0, 8);
const ROW_TWO = PARTNER_LOGOS.slice(8);

/**
 * Two counter-scrolling rows of text-based partner wordmarks. Pure CSS
 * animation (MarqueeRow) — pauses on hover, fades at the edges, and
 * stops entirely under reduced motion.
 */
export function LogoMarquee() {
  return (
    <section className="overflow-hidden py-16 sm:py-20">
      <Reveal>
        <p className="text-muted text-center text-sm font-medium tracking-widest uppercase">
          Powering businesses with trusted technologies
        </p>
      </Reveal>

      <Reveal delay={0.15} className="mt-9 flex flex-col gap-4">
        <MarqueeRow duration={30}>
          {ROW_ONE.map((logo) => (
            <LogoPill key={logo.id} logo={logo} />
          ))}
        </MarqueeRow>
        <MarqueeRow duration={30} reverse>
          {ROW_TWO.map((logo) => (
            <LogoPill key={logo.id} logo={logo} />
          ))}
        </MarqueeRow>
      </Reveal>
    </section>
  );
}

function LogoPill({ logo }: { logo: PartnerLogo }) {
  return (
    <span className="border-border/70 bg-card/40 hover:text-muted-foreground hover:border-border rounded-full border px-6 py-2.5 text-sm font-semibold whitespace-nowrap text-zinc-600 transition-colors duration-300">
      {logo.name}
    </span>
  );
}
