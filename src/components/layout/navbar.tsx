"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { NAV_CTA, NAV_ITEMS } from "@/data/navigation";
import type { CompanyProfile } from "@/lib/company-content";
import { useActiveSection } from "@/hooks/use-active-section";
import { EASE } from "@/lib/animations";
import { getIcon } from "@/lib/icons";
import type { NavItem } from "@/lib/types";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Delay before a hover-opened dropdown closes after mouse leave. */
const CLOSE_DELAY_MS = 300;

/** Homepage section ids tracked for nav highlighting, in page order. */
const SECTION_IDS = [
  "hero",
  "trust",
  "solutions",
  "industries",
  "process",
  "products",
  "why-us",
  "testimonials",
  "stats",
  "contact",
] as const;

/** The section id a nav item points at, e.g. "/#solutions" → "solutions". */
const hashOf = (href: string) => href.split("#")[1] ?? null;

const dropdownList = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
} as const;

const dropdownItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
} as const;

const mobileList = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
} as const;

const mobileItem = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
} as const;

export function Navbar({ company }: { company: CompanyProfile }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeItem = NAV_ITEMS.find(
    (item) => item.label === active && item.children?.length
  );

  // Section currently in view → which nav item gets the underline.
  const currentSection = useActiveSection(SECTION_IDS);
  const highlightLabel =
    activeItem?.label ??
    NAV_ITEMS.find((item) => hashOf(item.href) === currentSection)?.label ??
    null;

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const openDropdown = (label: string) => {
    cancelClose();
    setActive(label);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setActive(null), CLOSE_DELAY_MS);
  };

  const closeAll = () => {
    cancelClose();
    setActive(null);
    setOpen(false);
  };

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

  useEffect(() => cancelClose, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-border bg-background/95 border-b backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      {/* Dimmed page backdrop while a dropdown is open */}
      <AnimatePresence>
        {activeItem ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            aria-hidden
            className="bg-background/60 pointer-events-none fixed inset-0 -z-10 backdrop-blur-[2px]"
          />
        ) : null}
      </AnimatePresence>

      <Container>
        <div className="relative">
          <nav className="flex h-16 items-center justify-between">
            {/* Brand */}
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={closeAll}
            >
              {company.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-8 w-auto max-w-[180px] object-contain"
                />
              ) : (
                <>
                  <span className="from-primary to-secondary grid h-8 w-8 place-items-center rounded-md bg-linear-to-br text-sm font-bold text-white">
                    {"{}"}
                  </span>
                  <span className="text-foreground text-lg font-semibold tracking-tight">
                    {company.name}
                  </span>
                </>
              )}
            </Link>

            {/* Desktop nav */}
            <ul className="hidden items-center gap-1 lg:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = active === item.label && !!item.children;
                const highlighted = item.label === highlightLabel;
                return (
                  <li
                    key={item.label}
                    onMouseEnter={() =>
                      item.children ? openDropdown(item.label) : scheduleClose()
                    }
                    onMouseLeave={scheduleClose}
                  >
                    <Link
                      href={item.href}
                      onClick={closeAll}
                      onFocus={() =>
                        item.children ? openDropdown(item.label) : undefined
                      }
                      className={cn(
                        "text-muted-foreground hover:text-foreground relative flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors",
                        (isActive || highlighted) && "text-foreground"
                      )}
                    >
                      {item.label}
                      {item.children ? (
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-300",
                            isActive && "rotate-180"
                          )}
                        />
                      ) : null}
                      {highlighted ? (
                        <motion.span
                          layoutId="nav-underline"
                          className="from-primary to-secondary absolute inset-x-3 -bottom-0.5 h-px bg-linear-to-r"
                          transition={{ duration: 0.25, ease: EASE }}
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Desktop CTAs */}
            <div className="hidden items-center gap-2 lg:flex">
              <ButtonLink
                href={NAV_CTA.secondary.href}
                variant={NAV_CTA.secondary.variant}
                external={NAV_CTA.secondary.external}
                size="sm"
              >
                {NAV_CTA.secondary.label}
              </ButtonLink>
              <ButtonLink
                href={NAV_CTA.primary.href}
                variant={NAV_CTA.primary.variant}
                external={NAV_CTA.primary.external}
                size="sm"
              >
                {NAV_CTA.primary.label}
              </ButtonLink>
            </div>

            {/* Mobile toggle — three lines morphing into an X */}
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="text-foreground hover:bg-accent grid h-10 w-10 place-items-center rounded-md lg:hidden"
            >
              <span className="relative block h-4 w-5">
                {[
                  {
                    base: "top-0",
                    anim: open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 },
                  },
                  {
                    base: "top-[7px]",
                    anim: open ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 },
                  },
                  {
                    base: "top-[14px]",
                    anim: open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 },
                  },
                ].map((line, i) => (
                  <motion.span
                    key={i}
                    animate={line.anim}
                    transition={{ duration: 0.3, ease: EASE }}
                    className={cn(
                      "absolute left-0 block h-0.5 w-5 rounded-full bg-current",
                      line.base
                    )}
                  />
                ))}
              </span>
            </button>
          </nav>

          {/* Desktop dropdown panel — centered under the nav bar */}
          <AnimatePresence mode="wait">
            {activeItem?.children ? (
              <motion.div
                key={activeItem.label}
                initial={{ opacity: 0, y: 8, scale: 0.95, x: "-50%" }}
                animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                exit={{
                  opacity: 0,
                  y: 8,
                  scale: 0.95,
                  x: "-50%",
                  transition: { duration: 0.15 },
                }}
                transition={{ duration: 0.25, ease: EASE }}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
                className="absolute top-full left-1/2 hidden origin-top pt-2 lg:block"
              >
                <div className="border-border bg-card/95 overflow-hidden rounded-xl border shadow-2xl shadow-black/40 backdrop-blur-xl">
                  <motion.ul
                    variants={dropdownList}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                      "grid gap-1 p-3",
                      activeItem.megaMenu
                        ? "w-[680px] grid-cols-2"
                        : activeItem.children.length > 4
                          ? "w-[420px]"
                          : "w-80"
                    )}
                  >
                    {activeItem.children.map((child) => (
                      <DropdownLink
                        key={child.label}
                        item={child}
                        onNavigate={closeAll}
                      />
                    ))}
                  </motion.ul>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="bg-background/60 fixed inset-0 top-16 z-40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              key="mobile-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: EASE }}
              className="border-border bg-background fixed top-16 right-0 bottom-0 z-40 flex w-full flex-col border-l sm:max-w-sm lg:hidden"
            >
              <motion.nav
                variants={mobileList}
                initial="hidden"
                animate="visible"
                aria-label="Mobile"
                className="flex-1 overflow-y-auto px-5 py-4"
              >
                {NAV_ITEMS.map((item) => (
                  <motion.div key={item.label} variants={mobileItem}>
                    {item.children?.length ? (
                      <MobileAccordion item={item} onNavigate={closeAll} />
                    ) : (
                      <Link
                        href={item.href}
                        onClick={closeAll}
                        className="text-foreground border-border/60 hover:text-primary flex items-center border-b px-1 py-3.5 text-base font-medium transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </motion.nav>

              {/* Sticky bottom CTA bar */}
              <div className="border-border bg-card/60 flex shrink-0 flex-col gap-2 border-t p-4 backdrop-blur">
                <ButtonLink
                  href={NAV_CTA.primary.href}
                  variant={NAV_CTA.primary.variant}
                  external={NAV_CTA.primary.external}
                  size="md"
                  className="w-full"
                >
                  {NAV_CTA.primary.label}
                </ButtonLink>
                <ButtonLink
                  href={NAV_CTA.secondary.href}
                  variant="outline"
                  external={NAV_CTA.secondary.external}
                  size="md"
                  className="w-full"
                >
                  {NAV_CTA.secondary.label}
                </ButtonLink>
                <p className="text-muted-foreground mt-1 text-center text-xs">
                  {company.tagline}
                </p>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

/** Icon + title + description row inside a desktop dropdown. */
function DropdownLink({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const Icon = item.icon ? getIcon(item.icon) : null;
  return (
    <motion.li variants={dropdownItem}>
      <Link
        href={item.href}
        onClick={onNavigate}
        className="group hover:border-primary hover:bg-accent flex gap-3 rounded-lg border-l-2 border-transparent p-3 transition-colors duration-200"
      >
        {Icon ? (
          <span className="border-border bg-background text-primary group-hover:border-primary/40 mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-md border transition-colors">
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <span className="min-w-0">
          <span className="text-foreground block text-sm font-medium">
            {item.label}
          </span>
          {item.description ? (
            <span className="text-muted-foreground mt-0.5 block truncate text-xs">
              {item.description}
            </span>
          ) : null}
        </span>
      </Link>
    </motion.li>
  );
}

/** Expandable section inside the mobile menu. */
function MobileAccordion({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-border/60 border-b">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        className="text-foreground flex w-full items-center justify-between px-1 py-3.5 text-base font-medium"
      >
        {item.label}
        <ChevronDown
          className={cn(
            "text-muted-foreground h-4 w-4 transition-transform duration-300",
            expanded && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <ul className="pb-3">
              {item.children?.map((child) => {
                const Icon = child.icon ? getIcon(child.icon) : null;
                return (
                  <li key={child.label}>
                    <Link
                      href={child.href}
                      onClick={onNavigate}
                      className="text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-3 rounded-md px-2 py-2.5 text-sm transition-colors"
                    >
                      {Icon ? (
                        <Icon className="text-primary h-4 w-4 shrink-0" />
                      ) : null}
                      {child.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
