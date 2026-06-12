import type { Metadata } from "next";
import { ServiceHero } from "@/components/services/service-hero";
import { ServiceDeliverables } from "@/components/services/service-deliverables";
import { ServiceProcess } from "@/components/services/service-process";
import { ServiceTechnologies } from "@/components/services/service-technologies";
import { ServiceCaseStudy } from "@/components/services/service-case-study";
import { ServicePricing } from "@/components/services/service-pricing";
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
 * Universal service detail page — composes all seven sections from a
 * single `ServiceDetail` entry. Each route renders this with its data.
 */
export function ServiceDetailPage({ service }: { service: ServiceDetail }) {
  return (
    <>
      <ServiceHero service={service} />
      <ServiceDeliverables service={service} />
      <ServiceProcess service={service} />
      <ServiceTechnologies service={service} />
      <ServiceCaseStudy service={service} />
      <ServicePricing service={service} />
      <ServiceCTA service={service} />
    </>
  );
}
