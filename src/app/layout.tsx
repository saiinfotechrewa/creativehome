import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { SiteFrame } from "@/components/layout/site-frame";
import { SITE_CONFIG } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const DEFAULT_TITLE = "CreativeDox — Business Software & Automation Solutions";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: DEFAULT_TITLE,
    template: `%s · ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  applicationName: SITE_CONFIG.name,
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
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
    title: DEFAULT_TITLE,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
    creator: "@creativedox",
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

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen font-sans antialiased">
        {/* `reducedMotion="user"` makes every Framer Motion animation on the
            site honour the OS `prefers-reduced-motion` setting automatically,
            without each component opting in via the useReducedMotion hook. */}
        <MotionConfig reducedMotion="user">
          {/* SiteFrame renders the marketing chrome for public routes and a
              bare slate for /admin/* (which supplies its own shell). */}
          <SiteFrame>{children}</SiteFrame>
        </MotionConfig>
      </body>
    </html>
  );
}
