import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { SiteFrame } from "@/components/layout/site-frame";
import { SITE_CONFIG } from "@/lib/constants";
import { getCompanySettings } from "@/lib/company-content";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Site-wide metadata, driven by the Company Settings saved in the admin panel
 * (name, description, OG image) and falling back to `SITE_CONFIG`.
 */
export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanySettings();
  const defaultTitle = company.seo.title || `${company.name} — ${company.tagline}`;
  const description = company.seo.description;
  const ogImage = company.seo.ogImage;

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: defaultTitle,
      template: `%s · ${company.name}`,
    },
    description,
    keywords: [...SITE_CONFIG.keywords],
    applicationName: company.name,
    authors: [{ name: company.name, url: SITE_CONFIG.url }],
    creator: company.name,
    publisher: company.name,
    category: "technology",
    referrer: "origin-when-cross-origin",
    // Phone/email/addresses are intentional links in our UI, not numbers to
    // auto-detect and restyle on mobile Safari.
    formatDetection: { telephone: false, email: false, address: false },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: SITE_CONFIG.url,
      title: defaultTitle,
      description,
      siteName: company.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${company.name} — ${company.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
      images: [ogImage],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-icon.png",
    },
    manifest: "/manifest.webmanifest",
  };
}

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const company = await getCompanySettings();
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen font-sans antialiased">
        {/* `reducedMotion="user"` makes every Framer Motion animation on the
            site honour the OS `prefers-reduced-motion` setting automatically,
            without each component opting in via the useReducedMotion hook. */}
        <MotionConfig reducedMotion="user">
          {/* SiteFrame renders the marketing chrome for public routes and a
              bare slate for /admin/* (which supplies its own shell). */}
          <SiteFrame company={company}>{children}</SiteFrame>
        </MotionConfig>
      </body>
    </html>
  );
}
