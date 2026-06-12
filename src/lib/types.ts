import type { IconName } from "@/lib/icons";

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

/** A single primary/secondary navigation entry. */
export interface NavItem {
  label: string;
  href: string;
  /** Optional nested dropdown items. */
  children?: NavItem[];
  /** Short blurb shown in rich dropdowns. */
  description?: string;
  /** Icon shown in rich dropdowns. */
  icon?: IconName;
  /** External link — opens in a new tab. */
  external?: boolean;
  /** Render this item's dropdown as a wide two-column mega menu. */
  megaMenu?: boolean;
}

/** A titled column of links in the footer. */
export interface FooterColumn {
  title: string;
  items: NavItem[];
}

/** Configuration for a call-to-action button. */
export interface CtaConfig {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "outline" | "ghost" | "accent";
  external?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Offerings                                                          */
/* ------------------------------------------------------------------ */

/** A business solution offered by CreativeDox. */
export interface Solution {
  /** URL-safe slug, also used as the anchor/page id. */
  id: string;
  title: string;
  /** One-liner shown on cards and in nav dropdowns. */
  shortDescription: string;
  /** Fuller copy for detail pages and expanded cards. */
  longDescription: string;
  icon: IconName;
  /** 6–8 key capabilities. */
  features: string[];
  href: string;
  /** Tailwind text-color class for the card accent (e.g. "text-sky-400"). */
  color: string;
  /** Accent hex matching `color`, for spotlight/glow effects (e.g. "#38bdf8"). */
  hex: string;
  /** Tailwind gradient stops for backgrounds (e.g. "from-sky-500 to-blue-600"). */
  gradient: string;
}

/** Badge shown on a product card. */
export type ProductBadge =
  | "Popular"
  | "New"
  | "Best Seller"
  | "Trending"
  | "Best Value";

/** A productized software offering with its own demo/login/buy links. */
export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: IconName;
  /** 4 key features. */
  features: string[];
  /** Starting price, display-ready (e.g. "From ₹499/month"). */
  pricing: string;
  /** Numeric monthly starting price, for count-up animations. */
  priceMonthly: number;
  demoUrl: string;
  loginUrl: string;
  buyUrl: string;
  /** Placeholder screenshot path under /public. */
  screenshot: string;
  badge?: ProductBadge;
  /** Tailwind gradient stops unique to this product. */
  gradient: string;
}

/** An industry vertical CreativeDox serves. */
export interface Industry {
  id: string;
  name: string;
  icon: IconName;
  description: string;
  /** Ids of the solutions most relevant to this industry. */
  relevantSolutions: string[];
  /** Tailwind text-color class for the card accent (e.g. "text-orange-400"). */
  color: string;
  /** Accent hex matching `color`, for spotlight/glow effects. */
  hex: string;
  /** Tailwind gradient stops for the card. */
  gradient: string;
}

/* ------------------------------------------------------------------ */
/*  Social proof & marketing                                           */
/* ------------------------------------------------------------------ */

/** A customer testimonial / social-proof quote. */
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  /** Star rating out of 5. */
  rating: number;
  /** Initials used for the placeholder avatar. */
  avatar: string;
}

/** A single stat shown in the metrics strip (animates 0 → value). */
export interface Stat {
  id: string;
  /** Numeric target for the counter animation. */
  value: number;
  /** Display suffix, e.g. "+", "%", "K", "M". */
  suffix: string;
  label: string;
  description?: string;
}

/** One step of the "how we work" process. */
export interface ProcessStep {
  id: string;
  /** 1-based position in the sequence. */
  step: number;
  icon: IconName;
  title: string;
  description: string;
  /** Tailwind text-color class for the step accent. */
  color: string;
  /** Tailwind gradient stops for the step icon backdrop. */
  gradient: string;
}

/** A "Why choose CreativeDox" advantage card. */
export interface Advantage {
  id: string;
  icon: IconName;
  title: string;
  description: string;
  /** Tailwind text-color class for the card accent. */
  color: string;
  /** Accent hex matching `color`, for spotlight/glow effects. */
  hex: string;
}

/** A tech / integration partner shown in the logo marquee. */
export interface PartnerLogo {
  id: string;
  name: string;
}

/* ------------------------------------------------------------------ */
/*  Product detail pages (/solutions/[slug])                           */
/* ------------------------------------------------------------------ */

/** A problem the business faces without this software. */
export interface ProductPainPoint {
  icon: IconName;
  title: string;
  description: string;
}

/** One feature card on a product page (3×3 grid). */
export interface ProductFeature {
  icon: IconName;
  title: string;
  description: string;
}

/** A module included in the product, shown in the accordion. */
export interface ProductModule {
  name: string;
  description: string;
}

/** One slide of the product screenshot carousel. */
export interface ProductScreenshot {
  /** Placeholder path under /public (real images can replace later). */
  src: string;
  alt: string;
  caption: string;
}

/** A before/after row in the benefits comparison. */
export interface ProductBenefit {
  before: string;
  after: string;
}

/** One pricing tier on a product page. */
export interface ProductPricingTier {
  name: "Starter" | "Professional" | "Enterprise";
  /** Price per month when billed monthly. */
  priceMonthly: number;
  /** Effective price per month when billed annually. */
  priceAnnual: number;
  description: string;
  features: string[];
  /** Highlights this tier with a spotlight treatment. */
  recommended?: boolean;
  ctaLabel: string;
}

/** A question/answer pair in the product FAQ accordion. */
export interface ProductFaq {
  question: string;
  answer: string;
}

/** Full content model for a product detail page. */
export interface ProductDetail {
  /** URL slug — matches the solution href (/solutions/[slug]). */
  slug: string;
  /** Id of the matching entry in PRODUCTS (links demo/login URLs). */
  productId: string;
  name: string;
  tagline: string;
  heroDescription: string;
  /** SEO title/description for generateMetadata. */
  metaTitle: string;
  metaDescription: string;
  /** Tailwind text-color class for accents (e.g. "text-sky-400"). */
  color: string;
  /** Accent hex matching `color`, for spotlight/glow effects. */
  hex: string;
  /** Tailwind gradient stops for hero orb and CTA backgrounds. */
  gradient: string;
  /** Heading for the pain points section, e.g. "Still tracking attendance on paper?" */
  painPointsHeading: string;
  painPoints: ProductPainPoint[];
  features: ProductFeature[];
  modules: ProductModule[];
  screenshots: ProductScreenshot[];
  benefits: ProductBenefit[];
  pricing: ProductPricingTier[];
  faqs: ProductFaq[];
  /** Names of compatible tools/devices. */
  integrations: string[];
  /** Slugs of 3 related product pages. */
  relatedProducts: string[];
}
