import type { CtaConfig, FooterColumn, NavItem } from "@/lib/types";
import { INDUSTRIES } from "@/data/industries";
import { SOLUTIONS } from "@/data/solutions";
import { SERVICE_CARDS } from "@/data/services";

/**
 * Primary header navigation. Solution, service, and industry dropdowns are
 * all derived from the data layer so their links can never drift out of
 * sync with the pages that actually exist.
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Solutions",
    href: "/#solutions",
    megaMenu: true,
    children: SOLUTIONS.map((solution) => ({
      label: solution.title,
      href: solution.href,
      description: solution.shortDescription,
      icon: solution.icon,
    })),
  },
  {
    label: "Services",
    href: "/services",
    megaMenu: true,
    children: SERVICE_CARDS.map((service) => ({
      label: service.title,
      href: service.href,
      description: service.description,
      icon: service.icon,
    })),
  },
  {
    label: "Industries",
    href: "/industries",
    megaMenu: true,
    children: INDUSTRIES.map((industry) => ({
      label: industry.name,
      href: industry.href,
      description: industry.description,
      icon: industry.icon,
    })),
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Case Studies",
    href: "/case-studies",
  },
  {
    label: "Blog",
    href: "/blog",
  },
];

/** Header call-to-action buttons (desktop & mobile menu). */
export const NAV_CTA: { primary: CtaConfig; secondary: CtaConfig } = {
  primary: {
    label: "Book Consultation",
    href: "/book-consultation",
    variant: "primary",
  },
  secondary: {
    label: "Login",
    href: "/login",
    variant: "ghost",
  },
};

/** Footer link columns (the Contact column renders from SITE_CONFIG). */
export const FOOTER_NAV: FooterColumn[] = [
  {
    title: "Solutions",
    items: SOLUTIONS.slice(0, 6).map((solution) => ({
      label: solution.title,
      href: solution.href,
    })),
  },
  {
    title: "Company",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Industries", href: "/industries" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Blog", href: "/blog" },
      { label: "Pricing", href: "/pricing" },
      { label: "Book a Demo", href: "/book-consultation" },
      {
        label: "Help Center",
        href: "https://help.creativedox.com",
        external: true,
      },
    ],
  },
];

/** Legal links shown in the footer bottom bar. */
export const LEGAL_LINKS: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Refund Policy", href: "/refund-policy" },
];
