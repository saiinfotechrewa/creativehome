import type { Metadata } from "next";
import { ServicesOverview } from "@/components/services/services-overview";
import { SERVICE_CARDS } from "@/data/services";
import { SITE_CONFIG } from "@/lib/constants";

const TITLE = "Services";
const DESCRIPTION =
  "Custom web development, SaaS, business automation, API integration, and AI — CreativeDox designs, builds, and maintains software engineered around your business.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_CONFIG.url}/services` },
  openGraph: {
    title: `${TITLE} | ${SITE_CONFIG.name}`,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/services`,
    siteName: SITE_CONFIG.name,
    type: "website",
    images: [{ url: SITE_CONFIG.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ${SITE_CONFIG.name}`,
    description: DESCRIPTION,
  },
};

const SERVICES_URL = `${SITE_CONFIG.url}/services`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SERVICES_URL}#page`,
      url: SERVICES_URL,
      name: `${TITLE} | ${SITE_CONFIG.name}`,
      description: DESCRIPTION,
      isPartOf: {
        "@type": "WebSite",
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
      },
    },
    {
      "@type": "ItemList",
      itemListElement: SERVICE_CARDS.map((card, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: card.title,
        description: card.description,
        url: card.href.startsWith("http")
          ? card.href
          : `${SITE_CONFIG.url}${card.href}`,
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
          item: SERVICES_URL,
        },
      ],
    },
  ],
};

/** Services overview — hero, 6 service cards, and a closing CTA. */
export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesOverview cards={SERVICE_CARDS} />
    </>
  );
}
