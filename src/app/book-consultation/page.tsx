import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { BookingHero } from "@/components/book-consultation/booking-hero";
import { ConsultationForm } from "@/components/book-consultation/consultation-form";
import { TrustPanel } from "@/components/book-consultation/trust-panel";
import { SITE_CONFIG } from "@/lib/constants";

const TITLE = "Book a Free Consultation";
const DESCRIPTION =
  "Book a free, no-obligation consultation with CreativeDox. Tell us about your business, pick a time, and our team will tailor the right software and automation for you — trusted by 500+ businesses.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_CONFIG.url}/book-consultation` },
  openGraph: {
    title: `${TITLE} | ${SITE_CONFIG.name}`,
    description: DESCRIPTION,
    url: `${SITE_CONFIG.url}/book-consultation`,
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
 * Book Consultation — the primary lead-generation page. A four-step
 * booking form (left, ~60%) paired with a trust column (right, ~40%).
 */
export default function BookConsultationPage() {
  return (
    <>
      <BookingHero />

      <section className="pb-24 sm:pb-28">
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
            <ConsultationForm />
            <TrustPanel />
          </div>
        </Container>
      </section>
    </>
  );
}
