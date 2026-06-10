"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Boxes } from "lucide-react";
import { NAV_ITEMS } from "@/data/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground"
            onClick={() => setOpen(false)}
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-primary to-secondary">
              <Boxes className="h-5 w-5 text-white" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              {SITE_CONFIG.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer noopener" : undefined}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-2 md:flex">
            <ButtonLink href="/#contact" variant="ghost" size="sm">
              Sign in
            </ButtonLink>
            <ButtonLink href="/#contact" variant="primary" size="sm">
              Get started
            </ButtonLink>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-md text-foreground hover:bg-accent md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-border bg-background md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer noopener" : undefined}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <ButtonLink href="/#contact" variant="outline" size="md">
                  Sign in
                </ButtonLink>
                <ButtonLink href="/#contact" variant="primary" size="md">
                  Get started
                </ButtonLink>
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
