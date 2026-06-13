import type { Metadata } from "next";
import { IndustriesOverview } from "@/components/industries/industries-overview";
import { INDUSTRY_DETAILS } from "@/data/industry-details";
import { SITE_CONFIG } from "@/lib/constants";

const TITLE = "Industries";
const DESCRIPTION =
  "CreativeDox builds software and automation tailored to your industry — retail, schools, cable TV, manufacturing, agencies, service providers, and startups.";

const INDUSTRIES_URL = `${SITE_CONFIG.url}/industries`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: INDUSTRIES_URL },
  openGraph: {
    title: `${TITLE} | ${SITE_CONFIG.name}`,
    description: DESCRIPTION,
    url: INDUSTRIES_URL,
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${INDUSTRIES_URL}#page`,
      url: INDUSTRIES_URL,
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
      itemListElement: INDUSTRY_DETAILS.map((industry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: industry.name,
        description: industry.cardDescription,
        url: `${INDUSTRIES_URL}/${industry.slug}`,
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
          name: "Industries",
          item: INDUSTRIES_URL,
        },
      ],
    },
  ],
};

/** Industries overview — hero, bento grid of verticals, and a closing CTA. */
export default function IndustriesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IndustriesOverview industries={INDUSTRY_DETAILS} />
    </>
  );
}
