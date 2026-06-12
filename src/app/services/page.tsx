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

/** Services overview — hero, 6 service cards, and a closing CTA. */
export default function ServicesPage() {
  return <ServicesOverview cards={SERVICE_CARDS} />;
}
