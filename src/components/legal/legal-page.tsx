import type { Metadata } from "next";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { LegalToc } from "@/components/legal/legal-toc";
import { LEGAL_DOCUMENTS } from "@/data/legal";
import { SITE_CONFIG } from "@/lib/constants";
import type { LegalDocument } from "@/lib/types";
import { formatDate } from "@/lib/utils";

/** Build consistent metadata for a legal page. */
export function buildLegalMetadata(doc: LegalDocument): Metadata {
  const url = `${SITE_CONFIG.url}/${doc.slug}`;
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${doc.title} | ${SITE_CONFIG.name}`,
      description: doc.description,
      url,
      siteName: SITE_CONFIG.name,
      type: "website",
      images: [{ url: SITE_CONFIG.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
    },
  };
}

/**
 * Universal legal/policy page — a clean two-column layout with a sticky
 * table of contents and professionally formatted sections. Server-rendered
 * for SEO; only the TOC scroll-spy is interactive.
 */
export function LegalPage({ doc }: { doc: LegalDocument }) {
  const others = LEGAL_DOCUMENTS.filter((entry) => entry.slug !== doc.slug);

  return (
    <article>
      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-12 sm:pt-44 sm:pb-16">
        <div
          aria-hidden
          className="from-primary/30 to-secondary/20 pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-radial opacity-20 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,#09090b)]"
        />
        <Container className="relative">
          <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur">
            <ShieldCheck className="text-primary h-3.5 w-3.5" />
            Legal
          </span>
          <h1 className="text-foreground mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {doc.title}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">
            {doc.description}
          </p>
          <p className="text-muted-foreground mt-4 text-sm">
            Last updated{" "}
            <time dateTime={doc.updated} className="text-foreground font-medium">
              {formatDate(doc.updated)}
            </time>
          </p>
        </Container>
      </section>

      {/* Body */}
      <section className="pb-24 sm:pb-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
            {/* Sticky table of contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <LegalToc sections={doc.sections} />
              </div>
            </aside>

            {/* Content */}
            <div className="max-w-3xl">
              <p className="text-muted-foreground border-border bg-card/40 rounded-xl border p-5 text-sm leading-relaxed sm:text-base">
                {doc.intro}
              </p>

              <div className="mt-12 space-y-12">
                {doc.sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
                      {section.heading}
                    </h2>
                    <div className="mt-4 space-y-4">
                      {section.blocks.map((block, index) =>
                        block.type === "paragraph" ? (
                          <p
                            key={index}
                            className="text-muted-foreground leading-relaxed"
                          >
                            {block.text}
                          </p>
                        ) : (
                          <ul key={index} className="space-y-2.5">
                            {block.items.map((item) => (
                              <li
                                key={item}
                                className="text-muted-foreground flex gap-3 leading-relaxed"
                              >
                                <span
                                  aria-hidden
                                  className="bg-primary mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )
                      )}
                    </div>
                  </section>
                ))}
              </div>

              {/* Cross-links to the other legal docs */}
              <div className="border-border mt-16 border-t pt-8">
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Related
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {others.map((entry) => (
                    <Link
                      key={entry.slug}
                      href={`/${entry.slug}`}
                      className="group border-border bg-card hover:border-muted text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                    >
                      {entry.title}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </article>
  );
}
