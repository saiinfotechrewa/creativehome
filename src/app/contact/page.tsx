import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { QuickConnect } from "@/components/contact/quick-connect";
import { ContactMap } from "@/components/contact/contact-map";
import { SITE_CONFIG } from "@/lib/constants";

const TITLE = "Contact Us";
const DESCRIPTION =
  "Get in touch with CreativeDox — sales, support, or partnerships. Send us a message, email, call, or WhatsApp us, and we'll reply within one business day.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_CONFIG.url}/contact` },
  openGraph: {
    title: `${TITLE} | ${SITE_CONFIG.name}`,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/contact`,
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

/**
 * Contact page — hero, two-column form + info, quick-connect cards,
 * and a map embed placeholder.
 */
export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <section className="pb-24 sm:pb-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <ContactForm />
            <ContactInfo />
          </div>
        </Container>
      </section>

      <QuickConnect />
      <ContactMap />
    </>
  );
}
