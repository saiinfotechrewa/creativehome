import type { Metadata } from "next";
import { IndustryHero } from "@/components/industries/industry-hero";
import { IndustryPainPoints } from "@/components/industries/industry-pain-points";
import { IndustrySolutions } from "@/components/industries/industry-solutions";
import { IndustryWorkflow } from "@/components/industries/industry-workflow";
import { IndustryResults } from "@/components/industries/industry-results";
import { IndustryTestimonial } from "@/components/industries/industry-testimonial";
import { IndustryCTA } from "@/components/industries/industry-cta";
import { getSolution } from "@/data/solutions";
import { SITE_CONFIG } from "@/lib/constants";
import type { IndustryDetail, Solution } from "@/lib/types";

/**
 * Build the page metadata for an industry landing page. Each route's
 * `generateMetadata` delegates here so SEO stays consistent.
 */
export function buildIndustryMetadata(industry: IndustryDetail): Metadata {
  const url = `${SITE_CONFIG.url}/industries/${industry.slug}`;
  return {
    title: industry.metaTitle,
    description: industry.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${industry.metaTitle} | ${SITE_CONFIG.name}`,
      description: industry.metaDescription,
      url,
      siteName: SITE_CONFIG.name,
      type: "website",
      images: [{ url: SITE_CONFIG.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: industry.metaTitle,
      description: industry.metaDescription,
    },
  };
}

/**
 * Build Service + BreadcrumbList structured data (schema.org) for an
 * industry landing page. The featured solutions are exposed as the
 * services offered to that vertical.
 */
export function buildIndustryJsonLd(industry: IndustryDetail) {
  const url = `${SITE_CONFIG.url}/industries/${industry.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: industry.metaTitle,
        serviceType: `Business software for ${industry.name}`,
        description: industry.metaDescription,
        url,
        audience: { "@type": "BusinessAudience", name: industry.name },
        provider: {
          "@type": "Organization",
          name: SITE_CONFIG.name,
          url: SITE_CONFIG.url,
        },
        areaServed: { "@type": "Country", name: "India" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `CreativeDox solutions for ${industry.name}`,
          itemListElement: industry.solutions
            .map((slug) => getSolution(slug))
            .filter((solution): solution is Solution => Boolean(solution))
            .map((solution) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: solution.title,
                url: `${SITE_CONFIG.url}${solution.href}`,
              },
            })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_CONFIG.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Industries",
            item: `${SITE_CONFIG.url}/industries`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: industry.name,
            item: url,
          },
        ],
      },
    ],
  };
}

/**
 * Universal industry landing page — composes all seven sections from a
 * single `IndustryDetail` entry, plus JSON-LD structured data. Each route
 * renders this with its data.
 */
export function IndustryDetailPage({
  industry,
}: {
  industry: IndustryDetail;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildIndustryJsonLd(industry)),
        }}
      />
      <IndustryHero industry={industry} />
      <IndustryPainPoints industry={industry} />
      <IndustrySolutions industry={industry} />
      <IndustryWorkflow industry={industry} />
      <IndustryResults industry={industry} />
      <IndustryTestimonial industry={industry} />
      <IndustryCTA industry={industry} />
    </>
  );
}
