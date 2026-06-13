import type { Metadata } from "next";
import { ArrowRight, Quote, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/motion";
import { JsonLd } from "@/components/shared/json-ld";
import { SERVICE_DETAILS } from "@/data/services";
import { TESTIMONIALS } from "@/data/testimonials";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

const URL = `${SITE_CONFIG.url}/case-studies`;

/** Service engagements with a written case study, paired with their accent. */
const CASE_STUDIES = SERVICE_DETAILS.map((service) => ({
  ...service.caseStudy,
  service: service.title,
  serviceSlug: service.slug,
  hex: service.hex,
  color: service.color,
  gradient: service.gradient,
}));

export const metadata: Metadata = {
  title: "Case Studies & Success Stories",
  description:
    "Real outcomes from CreativeDox engagements — operations portals, SaaS launches, automation, and integrations that cut manual work and grew revenue for businesses across India.",
  alternates: { canonical: URL },
  openGraph: {
    title: `Case Studies & Success Stories | ${SITE_CONFIG.name}`,
    description:
      "Measurable results from real CreativeDox projects across web, SaaS, automation, and AI.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    images: [{ url: SITE_CONFIG.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies & Success Stories",
    description:
      "Measurable results from real CreativeDox projects across India.",
  },
};

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${URL}#page`,
        name: "Case Studies & Success Stories",
        url: URL,
        description:
          "Real outcomes from CreativeDox engagements across web, SaaS, automation, integrations, and AI.",
        isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.url },
          { "@type": "ListItem", position: 2, name: "Case Studies", item: URL },
        ],
      },
    ],
  };
}

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd data={jsonLd()} />

      {/* ---------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden pt-36 pb-16 sm:pt-40 sm:pb-20">
        <div
          aria-hidden
          className="from-primary pointer-events-none absolute -top-40 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-radial opacity-20 blur-[120px]"
        />
        <Container className="relative">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Reveal>
              <span className="border-border bg-card text-primary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium">
                Case Studies
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="text-foreground mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
                Real businesses. Measurable results.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
                Every engagement is judged on one thing: the outcome. Here&apos;s
                a selection of the problems we&apos;ve solved and the numbers
                that followed.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* -------------------------------------------------- Case studies */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-6">
            {CASE_STUDIES.map((cs, i) => (
              <Reveal key={cs.serviceSlug} delay={i * 0.05}>
                <article className="group bg-card border-border relative overflow-hidden rounded-3xl border p-7 sm:p-10">
                  <div
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -top-px left-8 right-8 h-px bg-linear-to-r from-transparent to-transparent"
                    )}
                    style={{ backgroundImage: `linear-gradient(90deg, transparent, ${cs.hex}, transparent)` }}
                  />
                  <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
                    {/* Narrative */}
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium",
                            cs.color
                          )}
                          style={{ backgroundColor: `${cs.hex}1a` }}
                        >
                          {cs.service}
                        </span>
                        <span className="text-muted text-xs">{cs.industry}</span>
                      </div>

                      <h2 className="text-foreground mt-5 text-xl font-semibold sm:text-2xl">
                        {cs.client}
                      </h2>

                      <div className="mt-5 space-y-4">
                        <div>
                          <h3 className="text-muted text-xs font-semibold tracking-wide uppercase">
                            Challenge
                          </h3>
                          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                            {cs.challenge}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-muted text-xs font-semibold tracking-wide uppercase">
                            Outcome
                          </h3>
                          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                            {cs.outcome}
                          </p>
                        </div>
                      </div>

                      <ButtonLink
                        href={`/services/${cs.serviceSlug}`}
                        variant="ghost"
                        size="sm"
                        className="mt-6 -ml-2"
                        iconRight={<ArrowRight className="h-4 w-4" />}
                      >
                        Explore {cs.service}
                      </ButtonLink>
                    </div>

                    {/* Metrics */}
                    <div className="border-border grid grid-cols-3 gap-4 self-center rounded-2xl border bg-black/20 p-6 lg:grid-cols-1">
                      {cs.metrics.map((m) => (
                        <div key={m.label} className="text-center lg:text-left">
                          <div
                            className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl"
                            style={{ color: cs.hex }}
                          >
                            {m.value}
                          </div>
                          <div className="text-muted mt-1 text-xs leading-snug">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------- Testimonials */}
      <section className="bg-card/30 border-border border-y py-24 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="In Their Words"
            title="What our customers say"
            description="Operators, founders, and owners across India on what changed after they switched to CreativeDox."
          />
          <Stagger className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <StaggerItem key={t.id} className="h-full">
                <figure className="bg-card border-border flex h-full flex-col rounded-2xl border p-7">
                  <Quote className="text-primary/40 h-7 w-7" aria-hidden />
                  <div className="mt-3 flex gap-0.5" aria-label={`${t.rating} out of 5`}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                        aria-hidden
                      />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mt-4 flex-1 text-sm leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="from-primary to-secondary grid h-10 w-10 place-items-center rounded-full bg-linear-to-br text-sm font-semibold text-white">
                      {t.avatar}
                    </span>
                    <span className="min-w-0">
                      <span className="text-foreground block text-sm font-medium">
                        {t.name}
                      </span>
                      <span className="text-muted block truncate text-xs">
                        {t.role}, {t.company}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ------------------------------------------------------------ CTA */}
      <section className="py-24 sm:py-28">
        <Container>
          <Reveal className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-foreground max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Want results like these for your business?
            </h2>
            <p className="text-muted-foreground max-w-xl text-base leading-relaxed sm:text-lg">
              Tell us what&apos;s slowing you down. We&apos;ll show you what a
              tailored solution could change — with a free, no-obligation
              consultation.
            </p>
            <ButtonLink
              href="/book-consultation"
              size="lg"
              variant="primary"
              iconRight={<ArrowRight className="h-4 w-4" />}
            >
              Book Free Consultation
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
