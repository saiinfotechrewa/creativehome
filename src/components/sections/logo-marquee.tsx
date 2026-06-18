import { MarqueeRow } from "@/components/ui/marquee-row";
import { Reveal } from "@/components/shared/motion";
import { PARTNER_LOGOS } from "@/data/logos";

const STATIC_NAMES = PARTNER_LOGOS.map((l) => l.name);

/**
 * Two counter-scrolling rows of text-based partner wordmarks. Pure CSS
 * animation (MarqueeRow) — pauses on hover, fades at the edges, and
 * stops entirely under reduced motion.
 */
export function LogoMarquee({
  content,
}: {
  content?: { heading: string; logos: { name: string }[] } | null;
}) {
  const names = content?.logos.length
    ? content.logos.map((l) => l.name)
    : STATIC_NAMES;
  const heading =
    content?.heading || "Powering businesses with trusted technologies";

  const half = Math.ceil(names.length / 2);
  const rowOne = names.slice(0, half);
  const rowTwo = names.slice(half);

  return (
    <section className="overflow-hidden py-16 sm:py-20">
      <Reveal>
        <p className="text-muted text-center text-sm font-medium tracking-widest uppercase">
          {heading}
        </p>
      </Reveal>

      <Reveal delay={0.15} className="mt-9 flex flex-col gap-4">
        <MarqueeRow duration={30}>
          {rowOne.map((name, i) => (
            <LogoPill key={`${name}-${i}`} name={name} />
          ))}
        </MarqueeRow>
        {rowTwo.length > 0 ? (
          <MarqueeRow duration={30} reverse>
            {rowTwo.map((name, i) => (
              <LogoPill key={`${name}-${i}`} name={name} />
            ))}
          </MarqueeRow>
        ) : null}
      </Reveal>
    </section>
  );
}

function LogoPill({ name }: { name: string }) {
  return (
    <span className="border-border/70 bg-card/40 hover:text-muted-foreground hover:border-border rounded-full border px-6 py-2.5 text-sm font-semibold whitespace-nowrap text-zinc-600 transition-colors duration-300">
      {name}
    </span>
  );
}
