"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { CursorGlow } from "@/components/shared/cursor-glow";
import { PageTransition } from "@/components/shared/page-transition";
import { SmoothScrollProvider } from "@/components/shared/smooth-scroll-provider";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

/**
 * Decides which chrome wraps the page.
 *
 * The admin panel (`/admin/*`) gets its OWN shell (see AdminShell) and must not
 * inherit the marketing navbar, footer, cursor glow, WhatsApp button or the
 * Lenis smooth-scroll provider — those would fight the admin UX. Since nested
 * layouts can't strip a parent's chrome, we branch here on the pathname.
 *
 * Public marketing routes keep the exact previous nesting, so their behaviour
 * is unchanged.
 */
export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    // Bare slate — the admin route group supplies its own layout + providers.
    return <>{children}</>;
  }

  return (
    <SmoothScrollProvider>
      <CursorGlow />
      <Navbar />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <ScrollToTop />
      <WhatsAppButton />
    </SmoothScrollProvider>
  );
}
