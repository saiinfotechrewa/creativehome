import type { Metadata } from "next";
import { LoginHub } from "@/components/login/login-hub";
import { PRODUCTS } from "@/data/products";
import { SITE_CONFIG } from "@/lib/constants";

const TITLE = "Login";
const DESCRIPTION =
  "Log in to your CreativeDox product — CRM, Accounting, Attendance, WhatsApp, Cable TV, School, ERP, and more. Find your product and go straight to its secure sign-in.";

const LOGIN_URL = `${SITE_CONFIG.url}/login`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: LOGIN_URL },
  openGraph: {
    title: `${TITLE} | ${SITE_CONFIG.name}`,
    description: DESCRIPTION,
    url: LOGIN_URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    images: [{ url: SITE_CONFIG.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ${SITE_CONFIG.name}`,
    description: DESCRIPTION,
  },
  robots: { index: false, follow: true },
};

/** Login hub — searchable grid of product sign-in links. */
export default function LoginPage() {
  return <LoginHub products={PRODUCTS} />;
}
