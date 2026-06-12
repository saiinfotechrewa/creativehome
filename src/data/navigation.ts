import type { CtaConfig, FooterColumn, NavItem } from "@/lib/types";
import { INDUSTRIES } from "@/data/industries";
import { SOLUTIONS } from "@/data/solutions";

/** Engineering & delivery services shown in the Services dropdown. */
const SERVICES: NavItem[] = [
  {
    label: "Custom Software Development",
    href: "/services/custom-software",
    description: "Web apps and portals built around your workflows.",
    icon: "code",
  },
  {
    label: "Mobile App Development",
    href: "/services/mobile-apps",
    description: "Android & iOS apps for your staff and customers.",
    icon: "smartphone",
  },
  {
    label: "Website Development",
    href: "/services/websites",
    description: "Fast, SEO-ready business websites that convert.",
    icon: "globe",
  },
  {
    label: "API & Integrations",
    href: "/services/integrations",
    description: "Connect Tally, payment gateways, and WhatsApp.",
    icon: "plug",
  },
  {
    label: "Cloud Hosting & DevOps",
    href: "/services/cloud-hosting",
    description: "Managed hosting, daily backups, 99.9% uptime.",
    icon: "cloud",
  },
  {
    label: "Support & AMC",
    href: "/services/support-amc",
    description: "Training, maintenance, and priority support plans.",
    icon: "life-buoy",
  },
];

/** Content resources shown in the Resources dropdown. */
const RESOURCES: NavItem[] = [
  {
    label: "Blog",
    href: "/blog",
    description: "Product updates and automation playbooks.",
    icon: "file-text",
  },
  {
    label: "Guides",
    href: "/guides",
    description: "Step-by-step guides to digitize your operations.",
    icon: "book-open",
  },
  {
    label: "FAQs",
    href: "/faq",
    description: "Answers about pricing, data, and onboarding.",
    icon: "circle-help",
  },
];

/**
 * Primary header navigation. Solution and industry dropdowns are
 * derived from the data layer so they never drift out of sync.
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
    href: "/#solutions",
    children: SERVICES,
  },
  {
    label: "Industries",
    href: "/#industries",
    megaMenu: true,
    children: INDUSTRIES.map((industry) => ({
      label: industry.name,
      href: "/#industries",
      description: industry.description,
      icon: industry.icon,
    })),
  },
  {
    label: "Pricing",
    href: "/#pricing",
  },
  {
    label: "Case Studies",
    href: "/#testimonials",
  },
  {
    label: "Resources",
    href: "/blog",
    children: RESOURCES,
  },
];

/** Header call-to-action buttons (desktop & mobile menu). */
export const NAV_CTA: { primary: CtaConfig; secondary: CtaConfig } = {
  primary: {
    label: "Book Consultation",
    href: "/#contact",
    variant: "primary",
  },
  secondary: {
    label: "Login",
    href: "https://app.creativedox.com",
    variant: "ghost",
    external: true,
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
      { label: "About Us", href: "/#why-us" },
      { label: "Case Studies", href: "/#testimonials" },
      { label: "Industries", href: "/#industries" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Blog", href: "/blog" },
      { label: "Guides", href: "/guides" },
      { label: "FAQs", href: "/faq" },
      {
        label: "Help Center",
        href: "https://help.creativedox.com",
        external: true,
      },
      { label: "Book a Demo", href: "/#contact" },
    ],
  },
];

/** Legal links shown in the footer bottom bar. */
export const LEGAL_LINKS: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refunds" },
];
