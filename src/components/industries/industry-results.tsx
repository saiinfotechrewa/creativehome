import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import type { IndustryDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Split a display-ready result (e.g. "80%", "3x", "30s") into a
 * count-up-able number plus its surrounding text, so the figure animates
 * while the unit stays put. Returns `null` for values with no leading
 * number, which then render verbatim.
 */
function parseResult(
  value: string
): { prefix: string; number: number; suffix: string } | null {
  const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
  if (!match) return null;
  const [, prefix = "", digits = "", suffix = ""] = match;
  const number = Number(digits.replace(/,/g, ""));
  if (Number.isNaN(number)) return null;
  return { prefix, number, suffix };
}

/** "Results" — headline improvement metrics for this industry. */
export function IndustryResults({ industry }: { industry: IndustryDetail }) {
  return (
    <section
      id="results"
      className="border-border/60 scroll-mt-24 border-y bg-[#0b0b0e] py-24 sm:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="The Results"
          title="Outcomes our customers see"
          description="Real improvements businesses in this industry report after switching to CreativeDox."
        />

        <Stagger
          className={cn(
            "mt-14 grid gap-5",
            industry.results.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"
          )}
        >
          {industry.results.map((result) => {
            const parsed = parseResult(result.value);
            const figureClass = cn(
              "bg-linear-to-r bg-clip-text text-4xl font-bold text-transparent sm:text-5xl",
              industry.gradient
            );
            return (
              <StaggerItem key={result.label}>
                <div className="border-border bg-card relative h-full overflow-hidden rounded-2xl border p-7 text-center">
                  <div
                    aria-hidden
                    className={cn(
                      "absolute inset-0 bg-linear-to-br opacity-[0.06]",
                      industry.gradient
                    )}
                  />
                  <div className="relative">
                    {parsed ? (
                      <AnimatedCounter
                        value={parsed.number}
                        prefix={parsed.prefix}
                        suffix={parsed.suffix}
                        duration={1.8}
                        className={figureClass}
                      />
                    ) : (
                      <div className={figureClass}>{result.value}</div>
                    )}
                    <p className="text-muted-foreground mt-3 text-sm leading-snug">
                      {result.label}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
