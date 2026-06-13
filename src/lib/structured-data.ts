import type { Product, ProductDetail } from "@/lib/types";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  Structured data (schema.org / JSON-LD)                             */
/*                                                                     */
/*  Reusable builders that return plain objects. Render them with the  */
/*  <JsonLd> helper (or an inline <script type="application/ld+json">) */
/*  so search engines can parse Organization, WebSite, Product, FAQ,   */
/*  and BreadcrumbList markup. Mirrors the inline pattern already used  */
/*  on the service, industry, and blog pages.                          */
/* ------------------------------------------------------------------ */

/** Stable @id for the Organization node so other nodes can reference it. */
const ORG_ID = `${SITE_CONFIG.url}/#organization`;
const WEBSITE_ID = `${SITE_CONFIG.url}/#website`;

/**
 * Company-wide Organization node. Powers the Google knowledge panel:
 * logo, contact channels, postal address, and verified social profiles.
 */
export function buildOrganizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.email,
    telephone: SITE_CONFIG.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rewa",
      addressRegion: "Madhya Pradesh",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_CONFIG.phone,
      email: SITE_CONFIG.email,
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    sameAs: [
      SOCIAL_LINKS.linkedin,
      SOCIAL_LINKS.twitter,
      SOCIAL_LINKS.youtube,
      SOCIAL_LINKS.instagram,
    ],
  };
}

/** WebSite node — names the site and points back at its publisher. */
export function buildWebSiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    inLanguage: "en-IN",
    publisher: { "@id": ORG_ID },
  };
}

/**
 * Site-wide graph rendered once (on the homepage): Organization + WebSite.
 * Every other page references the Organization by @id instead of repeating
 * the whole node.
 */
export function buildSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [buildOrganizationJsonLd(), buildWebSiteJsonLd()],
  };
}

/**
 * Product + FAQPage + BreadcrumbList graph for a solution detail page
 * (/solutions/[slug]). The lowest monthly tier becomes the offer's
 * lowPrice; each FAQ entry becomes a schema.org Question/Answer pair.
 */
export function buildProductJsonLd(detail: ProductDetail, product: Product) {
  const url = `${SITE_CONFIG.url}/solutions/${detail.slug}`;
  const lowPrice = Math.min(
    ...detail.pricing.map((tier) => tier.priceMonthly),
    product.priceMonthly
  );

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Product",
      "@id": `${url}#product`,
      name: product.name,
      description: detail.heroDescription,
      url,
      category: "BusinessApplication",
      brand: { "@type": "Brand", name: SITE_CONFIG.name },
      manufacturer: { "@id": ORG_ID },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        lowPrice,
        offerCount: detail.pricing.length,
        availability: "https://schema.org/InStock",
        seller: { "@id": ORG_ID },
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.url },
        {
          "@type": "ListItem",
          position: 2,
          name: "Solutions",
          item: `${SITE_CONFIG.url}/#solutions`,
        },
        { "@type": "ListItem", position: 3, name: product.name, item: url },
      ],
    },
  ];

  if (detail.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: detail.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
