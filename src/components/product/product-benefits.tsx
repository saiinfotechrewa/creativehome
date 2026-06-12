import { ArrowRight, Check, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import type { ProductDetail } from "@/lib/types";

/** Before/after comparison — life without vs. with the product. */
export function ProductBenefits({ detail }: { detail: ProductDetail }) {
  const shortName = detail.name.replace("CreativeDox ", "");

  return (
    <section className="border-border/60 border-y bg-[#0b0b0e] py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Before & After"
          title="What actually changes"
          description={`The same work, before and after ${shortName} — as our customers describe it.`}
        />

        <Stagger className="mx-auto mt-14 max-w-4xl space-y-4">
          {/* Column labels */}
          <StaggerItem className="hidden grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 sm:grid">
            <span className="text-muted text-xs font-semibold tracking-widest uppercase">
              Without {shortName}
            </span>
            <span aria-hidden className="w-4" />
            <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              With {shortName}
            </span>
          </StaggerItem>

          {detail.benefits.map((benefit) => (
            <StaggerItem
              key={benefit.before}
              className="border-border bg-card grid grid-cols-1 gap-4 rounded-lg border p-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                  <X className="h-3 w-3 text-red-400" />
                </span>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.before}
                </p>
              </div>

              <ArrowRight
                aria-hidden
                className="text-muted hidden h-4 w-4 sm:block"
              />

              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <Check className="h-3 w-3 text-emerald-400" />
                </span>
                <p className="text-foreground text-sm leading-relaxed">
                  {benefit.after}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
