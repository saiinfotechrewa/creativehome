import { Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Reveal } from "@/components/shared/motion";
import type { ServiceDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Split a display-ready metric (e.g. "60%", "10 weeks", "₹4.2L") into a
 * count-up-able number plus its surrounding text, so the figure animates
 * while the unit stays put. Returns `null` for values with no leading
 * number, which then render verbatim.
 */
function parseMetric(
  value: string
): { prefix: string; number: number; suffix: string } | null {
  const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
  if (!match) return null;
  const [, prefix = "", digits = "", suffix = ""] = match;
  const number = Number(digits.replace(/,/g, ""));
  if (Number.isNaN(number)) return null;
  return { prefix, number, suffix };
}

/** "Case Study Snippet" — a compact result story with headline metrics. */
export function ServiceCaseStudy({ service }: { service: ServiceDetail }) {
  const { caseStudy } = service;

  return (
    <section id="case-study" className="scroll-mt-32 py-24 sm:py-28">
      <Container>
        <Reveal className="relative overflow-hidden rounded-2xl border border-white/10 p-8 sm:p-12">
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 bg-linear-to-br opacity-[0.12]",
              service.gradient
            )}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.05),transparent_55%)]"
          />

          <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <Badge variant="primary" featured>
                Case Study
              </Badge>
              <div className="mt-5 flex items-start gap-3">
                <Quote
                  className={cn("h-7 w-7 shrink-0", service.color)}
                  aria-hidden
                />
                <div>
                  <p className="text-foreground text-lg font-medium leading-relaxed sm:text-xl">
                    {caseStudy.challenge}
                  </p>
                  <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                    {caseStudy.outcome}
                  </p>
                </div>
              </div>
              <div className="text-muted-foreground mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span className="text-foreground font-semibold">
                  {caseStudy.client}
                </span>
                <span aria-hidden>·</span>
                <span>{caseStudy.industry}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 lg:grid-cols-1">
              {caseStudy.metrics.map((metric) => {
                const parsed = parseMetric(metric.value);
                const figureClass = cn(
                  "bg-linear-to-r bg-clip-text text-2xl font-bold text-transparent sm:text-3xl",
                  service.gradient
                );
                return (
                  <div
                    key={metric.label}
                    className="border-border bg-card/60 rounded-xl border p-4 text-center backdrop-blur lg:text-left"
                  >
                    {parsed ? (
                      <AnimatedCounter
                        value={parsed.number}
                        prefix={parsed.prefix}
                        suffix={parsed.suffix}
                        duration={1.6}
                        className={figureClass}
                      />
                    ) : (
                      <div className={figureClass}>{metric.value}</div>
                    )}
                    <div className="text-muted-foreground mt-1 text-xs leading-snug sm:text-sm">
                      {metric.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
