import type { NavItem } from "@/lib/types";

/** Primary header navigation. */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Solutions",
    href: "/#solutions",
    children: [
      { label: "Workflow Automation", href: "/#solutions" },
      { label: "Custom Software", href: "/#solutions" },
      { label: "Systems Integration", href: "/#solutions" },
      { label: "Data & Analytics", href: "/#solutions" },
    ],
  },
  {
    label: "Products",
    href: "/#products",
  },
  {
    label: "Customers",
    href: "/#testimonials",
  },
  {
    label: "Pricing",
    href: "/#pricing",
  },
  {
    label: "Docs",
    href: "https://docs.creativedox.com",
    external: true,
  },
];

/** Footer link columns. */
export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Product",
    items: [
      { label: "Solutions", href: "/#solutions" },
      { label: "Products", href: "/#products" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Changelog", href: "/#" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/#" },
      { label: "Careers", href: "/#" },
      { label: "Blog", href: "/#" },
      { label: "Contact", href: "/#" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Documentation", href: "https://docs.creativedox.com", external: true },
      { label: "API Reference", href: "/#" },
      { label: "Status", href: "/#" },
      { label: "Support", href: "/#" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", href: "/#" },
      { label: "Terms", href: "/#" },
      { label: "Security", href: "/#" },
      { label: "DPA", href: "/#" },
    ],
  },
];
