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

/* ------------------------------------------------------------------ */
/*  Blog (/blog, /blog/[slug])                                         */
/* ------------------------------------------------------------------ */

/** A single rendered block inside a blog post body. */
export type BlogContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "ordered"; items: string[] }
  | { type: "quote"; text: string };

/** Author byline shown on cards and post heroes. */
export interface BlogAuthor {
  name: string;
  role: string;
  /** Initials for the placeholder avatar. */
  avatar: string;
}

/** Full content model for a blog post. */
export interface BlogPost {
  /** URL slug — /blog/[slug]. */
  slug: string;
  title: string;
  /** One/two-line summary shown on cards and meta description. */
  excerpt: string;
  /** Category label, also used for the filter tabs. */
  category: string;
  author: BlogAuthor;
  /** Publish date, ISO `YYYY-MM-DD`. */
  date: string;
  /** Estimated read time in minutes. */
  readTime: number;
  /** Thumbnail accent icon (resolved via the icon registry). */
  icon: IconName;
  /** Tailwind gradient stops for the thumbnail (e.g. "from-blue-500 to-sky-600"). */
  gradient: string;
  /** SEO overrides; fall back to title/excerpt when absent. */
  metaTitle?: string;
  metaDescription?: string;
  /** Ordered body blocks rendered by BlogContent. */
  content: BlogContentBlock[];
  /** Free-text tags shown under the post. */
  tags?: string[];
}

/* ------------------------------------------------------------------ */
/*  Services (/services, /services/[service])                          */
/* ------------------------------------------------------------------ */

/** A deliverable example shown in the "What We Build" grid. */
export interface ServiceDeliverable {
  icon: IconName;
  title: string;
  description: string;
}

/** One step of a service's delivery process (4–6 per service). */
export interface ServiceProcessStep {
  /** 1-based position in the sequence. */
  step: number;
  icon: IconName;
  title: string;
  description: string;
}

/** Compact case-study snippet shown on a service page. */
export interface ServiceCaseStudy {
  client: string;
  industry: string;
  /** The problem the client came to us with. */
  challenge: string;
  /** What we delivered and the outcome. */
  outcome: string;
  /** 3 headline metrics (display-ready, e.g. "60%", "4 weeks"). */
  metrics: { value: string; label: string }[];
}

/** A pricing model offered for a service (fixed / hourly / retainer). */
export interface ServicePricingModel {
  id: "fixed" | "hourly" | "retainer";
  label: string;
  icon: IconName;
  /** Display-ready headline price, e.g. "From ₹1.5L", "₹1,800". */
  price: string;
  /** Unit qualifier shown next to the price, e.g. "/ project", "/ hour". */
  unit: string;
  description: string;
  /** 3–4 inclusions for this model. */
  features: string[];
  /** Highlights this model with a spotlight treatment. */
  recommended?: boolean;
}

/** Full content model for a service detail page. */
export interface ServiceDetail {
  /** URL slug — /services/[slug]. */
  slug: string;
  title: string;
  /** Short eyebrow/category label. */
  eyebrow: string;
  /** Hero headline (animated word-by-word). */
  headline: string;
  /** Hero supporting paragraph. */
  heroDescription: string;
  /** SEO title/description for generateMetadata. */
  metaTitle: string;
  metaDescription: string;
  icon: IconName;
  /** Tailwind text-color class for accents (e.g. "text-sky-400"). */
  color: string;
  /** Accent hex matching `color`, for spotlight/glow effects. */
  hex: string;
  /** Tailwind gradient stops for hero orb and accents. */
  gradient: string;
  deliverables: ServiceDeliverable[];
  process: ServiceProcessStep[];
  /** Tech-stack names rendered as monogram chips. */
  technologies: string[];
  caseStudy: ServiceCaseStudy;
  pricing: ServicePricingModel[];
}

/** A card on the services overview grid (/services). */
export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  color: string;
  hex: string;
  gradient: string;
  href: string;
  /** Link label, e.g. "Explore service". */
  cta: string;
}
