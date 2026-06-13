import type { Metadata } from "next";
import { ServiceHero } from "@/components/services/service-hero";
import { ServiceSectionNav } from "@/components/services/service-section-nav";
import { ServiceDeliverables } from "@/components/services/service-deliverables";
import { ServiceProcess } from "@/components/services/service-process";
import { ServiceTechnologies } from "@/components/services/service-technologies";
import { ServiceCaseStudy } from "@/components/services/service-case-study";
import { ServicePricing } from "@/components/services/service-pricing";
import { ServiceRelated } from "@/components/services/service-related";
import { ServiceCTA } from "@/components/services/service-cta";
import { SITE_CONFIG } from "@/lib/constants";
import type { ServiceDetail } from "@/lib/types";

/**
 * Build the page metadata for a service detail page. Each route's
 * `generateMetadata` delegates here so SEO stays consistent.
 */
export function buildServiceMetadata(service: ServiceDetail): Metadata {
  const url = `${SITE_CONFIG.url}/services/${service.slug}`;
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${service.metaTitle} | ${SITE_CONFIG.name}`,
      description: service.metaDescription,
      url,
      siteName: SITE_CONFIG.name,
      type: "website",
      images: [{ url: SITE_CONFIG.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle,
      description: service.metaDescription,
    },
  };
}

/**
 * Build Service + BreadcrumbList structured data (schema.org) for a
 * service detail page. Pricing models are exposed as offers; the display
 * prices are free-text, so they're surfaced as offer descriptions rather
 * than numeric `price` fields to keep the markup valid.
 */
export function buildServiceJsonLd(service: ServiceDetail) {
  const url = `${SITE_CONFIG.url}/services/${service.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title,
        serviceType: service.eyebrow,
        description: service.metaDescription,
        url,
        provider: {
          "@type": "Organization",
          name: SITE_CONFIG.name,
          url: SITE_CONFIG.url,
        },
        areaServed: { "@type": "Country", name: "India" },
        offers: service.pricing.map((model) => ({
          "@type": "Offer",
          name: model.label,
          description: `${model.price} ${model.unit} — ${model.description}`,
          priceCurrency: "INR",
        })),
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
            name: "Services",
            item: `${SITE_CONFIG.url}/services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: url,
          },
        ],
      },
    ],
  };
}

/**
 * Universal service detail page — composes all seven sections from a
 * single `ServiceDetail` entry, plus a sticky section nav, sibling-service
 * cross-links, and JSON-LD structured data. Each route renders this.
 */
export function ServiceDetailPage({ service }: { service: ServiceDetail }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildServiceJsonLd(service)),
        }}
      />
      <ServiceHero service={service} />
      <ServiceSectionNav />
      <ServiceDeliverables service={service} />
      <ServiceProcess service={service} />
      <ServiceTechnologies service={service} />
      <ServiceCaseStudy service={service} />
      <ServicePricing service={service} />
      <ServiceRelated slug={service.slug} />
      <ServiceCTA service={service} />
    </>
  );
}
