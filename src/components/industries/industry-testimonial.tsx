import { Quote, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/shared/motion";
import { getTestimonial } from "@/data/testimonials";
import type { IndustryDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Industry-specific testimonial pulled from the testimonials catalog. */
export function IndustryTestimonial({
  industry,
}: {
  industry: IndustryDetail;
}) {
  const testimonial = getTestimonial(industry.testimonialId);
  if (!testimonial) return null;

  return (
    <section className="py-24 sm:py-28">
      <Container>
        <Reveal className="relative overflow-hidden rounded-2xl border border-white/10 p-8 sm:p-12">
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 bg-linear-to-br opacity-[0.12]",
              industry.gradient
            )}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.05),transparent_55%)]"
          />

          <div className="relative mx-auto max-w-3xl text-center">
            <Quote
              className={cn("mx-auto h-9 w-9", industry.color)}
              aria-hidden
            />

            <div
              className="mt-6 flex justify-center gap-1"
              aria-label={`${testimonial.rating} out of 5 stars`}
            >
              {Array.from({ length: testimonial.rating }).map((_, index) => (
                <Star
                  key={index}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                  aria-hidden
                />
              ))}
            </div>

            <blockquote className="text-foreground mt-6 text-xl leading-relaxed font-medium text-balance sm:text-2xl">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>

            <div className="mt-8 flex items-center justify-center gap-3">
              <span
                className={cn(
                  "inline-flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white shadow-lg",
                  industry.gradient
                )}
                aria-hidden
              >
                {testimonial.avatar}
              </span>
              <div className="text-left">
                <div className="text-foreground font-semibold">
                  {testimonial.name}
                </div>
                <div className="text-muted-foreground text-sm">
                  {testimonial.role}, {testimonial.company}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
