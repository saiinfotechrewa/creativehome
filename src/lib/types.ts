import type { LucideIcon } from "lucide-react";

/** A single primary/secondary navigation entry. */
export interface NavItem {
  label: string;
  href: string;
  /** Optional nested dropdown items. */
  children?: NavItem[];
  /** External link — opens in a new tab. */
  external?: boolean;
}

/** A business solution offered by CreativeDox. */
export interface Solution {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Short benefit bullet points shown on cards. */
  features: string[];
  href: string;
}

/** A productized software/automation offering. */
export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  /** Highlighted capabilities. */
  highlights: string[];
  status: "live" | "beta" | "coming-soon";
  href: string;
}

/** A customer testimonial / social-proof quote. */
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  /** Optional avatar URL. */
  avatar?: string;
  rating: number;
}

/** A single stat shown in the metrics strip. */
export interface Stat {
  label: string;
  value: string;
  description?: string;
}

/** Generic CTA descriptor used across sections. */
export interface CtaLink {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
}
