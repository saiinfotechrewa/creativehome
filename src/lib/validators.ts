import { z } from "zod";

/**
 * Central Zod schemas. Used by NextAuth `authorize`, API routes, and
 * react-hook-form (`@hookform/resolvers/zod`) on the client so validation rules
 * live in exactly one place.
 */

// ───────────────────────────── Shared ───────────────────────────────────────

export const idSchema = z.string().min(1, "id is required");
export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens");

export const emailSchema = z.string().email("Enter a valid email").max(160);
export const phoneSchema = z
  .string()
  .regex(/^[+]?[0-9\s-]{7,15}$/, "Enter a valid phone number");

export const seoSchema = z
  .object({
    title: z.string().max(70).optional(),
    description: z.string().max(180).optional(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().url().optional().or(z.literal("")),
    canonical: z.string().url().optional().or(z.literal("")),
  })
  .partial();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

// ───────────────────────────── Enums ────────────────────────────────────────

export const adminRoleSchema = z.enum(["SUPERADMIN", "ADMIN", "EDITOR", "VIEWER"]);
export const contentStatusSchema = z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]);
export const blogStatusSchema = z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]);
export const leadSourceSchema = z.enum(["CONSULTATION", "DEMO", "CONTACT", "WHATSAPP"]);
export const leadStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "NEGOTIATION",
  "CONVERTED",
  "LOST",
]);
export const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export const orderStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "ACTIVE",
  "CANCELLED",
  "REFUNDED",
  "EXPIRED",
]);
export const testimonialStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);

// ───────────────────────────── Auth ─────────────────────────────────────────

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const adminUserSchema = z.object({
  name: z.string().min(2).max(80),
  email: emailSchema,
  password: z.string().min(8).max(72).optional(), // optional on update
  role: adminRoleSchema.default("VIEWER"),
  avatar: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  permissions: z.array(z.string()).default([]),
});
export type AdminUserInput = z.infer<typeof adminUserSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(72),
    confirmPassword: z.string().min(8).max(72),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─────────────────────────── Settings ───────────────────────────────────────

/**
 * SEO defaults for the company settings carry the site-wide analytics IDs on
 * top of the standard SEO fields. Kept separate from the shared `seoSchema` so
 * products/services/etc. don't inherit the analytics keys.
 */
export const companySeoDefaultsSchema = seoSchema.extend({
  googleAnalyticsId: z.string().max(40).optional().or(z.literal("")),
  googleTagManagerId: z.string().max(40).optional().or(z.literal("")),
  facebookPixelId: z.string().max(40).optional().or(z.literal("")),
});

export const companySettingsSchema = z.object({
  companyName: z.string().min(1).max(120),
  tagline: z.string().max(200).optional(),
  logo: z.string().optional(),
  darkLogo: z.string().optional(),
  favicon: z.string().optional(),
  email: emailSchema.optional().or(z.literal("")),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.record(z.string(), z.unknown()).default({}),
  businessHours: z.record(z.string(), z.unknown()).default({}),
  socialLinks: z.record(z.string(), z.unknown()).default({}),
  seoDefaults: companySeoDefaultsSchema.default({}),
});

export const homepageSectionSchema = z.object({
  sectionKey: z.string().min(1).max(60),
  isActive: z.boolean().default(true),
  order: z.number().int().default(0),
  content: z.record(z.string(), z.unknown()).default({}),
});

/** PUT body for a single section — sectionKey comes from the URL, so it's omitted. */
export const homepageSectionUpdateSchema = homepageSectionSchema
  .omit({ sectionKey: true })
  .partial()
  .extend({
    content: z.record(z.string(), z.unknown()).optional(),
  });

/** Reorder payload: ordered list of section keys (index becomes the new order). */
export const homepageReorderSchema = z.object({
  order: z
    .array(z.string().min(1))
    .min(1, "Provide at least one section key"),
});

// ─────────────────────────── Legal pages ────────────────────────────────────

export const LEGAL_TYPES = [
  "terms",
  "privacy",
  "refund",
  "cookies",
  "shipping",
  "disclaimer",
] as const;

export const legalTypeSchema = z.enum(LEGAL_TYPES);
export type LegalType = (typeof LEGAL_TYPES)[number];

export const legalDocumentSchema = z.object({
  title: z.string().min(2).max(160),
  content: z.string().default(""),
  version: z.string().max(40).optional().or(z.literal("")),
  isPublished: z.boolean().default(true),
  effectiveAt: z.coerce.date().optional().nullable(),
  seo: seoSchema.default({}),
});

// ──────────────────────── Navigation & Footer ───────────────────────────────

const navLinkSchema = z.object({
  label: z.string().min(1).max(60),
  href: z.string().min(1).max(300),
});

const navItemSchema = navLinkSchema.extend({
  children: z.array(navLinkSchema).default([]),
});

export const navigationSchema = z.object({
  items: z.array(navItemSchema).default([]),
  ctaButton: z
    .object({
      label: z.string().max(60).optional(),
      href: z.string().max(300).optional(),
    })
    .default({}),
});

const footerColumnSchema = z.object({
  heading: z.string().min(1).max(60),
  links: z.array(navLinkSchema).default([]),
});

export const footerSchema = z.object({
  tagline: z.string().max(200).optional(),
  columns: z.array(footerColumnSchema).default([]),
  legalLinks: z.array(navLinkSchema).default([]),
  socialLinks: z.record(z.string(), z.unknown()).default({}),
  newsletter: z
    .object({
      enabled: z.boolean().optional(),
      heading: z.string().max(120).optional(),
      subtext: z.string().max(300).optional(),
    })
    .default({}),
  copyright: z.string().max(200).optional(),
});

// ───────────────────────────── Catalog ──────────────────────────────────────

/** Columns the catalog list endpoints allow sorting by (allowlist for safety). */
export const CATALOG_SORT_FIELDS = [
  "order",
  "name",
  "status",
  "createdAt",
  "updatedAt",
] as const;

/** Query params for catalog list endpoints (products/services/industries). */
export const catalogListQuerySchema = paginationSchema.extend({
  sort: z.enum(CATALOG_SORT_FIELDS).default("order"),
  status: contentStatusSchema.optional(),
  /** Include soft-deleted (ARCHIVED) records — admin only. */
  includeArchived: z
    .union([z.literal("true"), z.literal("false")])
    .transform((v) => v === "true")
    .default("false"),
});
export type CatalogListQuery = z.infer<typeof catalogListQuerySchema>;

/** Reorder payload shared by catalog modules: ordered list of slugs. */
export const reorderSchema = z.object({
  order: z.array(z.string().min(1)).min(1, "Provide at least one slug"),
});

export const productSchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema.default("DRAFT"),
  order: z.number().int().default(0),
  name: z.string().min(2).max(120),
  tagline: z.string().max(200).optional(),
  descriptions: z.record(z.string(), z.unknown()).default({}),
  icon: z.string().optional(),
  color: z.string().optional(),
  gradient: z.record(z.string(), z.unknown()).default({}),
  badge: z.string().optional(),
  hero: z.record(z.string(), z.unknown()).default({}),
  painPoints: z.array(z.unknown()).default([]),
  features: z.array(z.unknown()).default([]),
  modules: z.array(z.unknown()).default([]),
  screenshots: z.array(z.unknown()).default([]),
  benefits: z.array(z.unknown()).default([]),
  pricing: z.record(z.string(), z.unknown()).default({}),
  faqs: z.array(z.unknown()).default([]),
  integrations: z.array(z.unknown()).default([]),
  relatedProducts: z.array(z.string()).default([]),
  seo: seoSchema.default({}),
  urls: z.record(z.string(), z.unknown()).default({}),
});
export type ProductInput = z.infer<typeof productSchema>;

export const serviceSchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema.default("DRAFT"),
  order: z.number().int().default(0),
  name: z.string().min(2).max(120),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  hero: z.record(z.string(), z.unknown()).default({}),
  deliverables: z.array(z.unknown()).default([]),
  process: z.array(z.unknown()).default([]),
  technologies: z.array(z.string()).default([]),
  pricingModel: z.record(z.string(), z.unknown()).default({}),
  seo: seoSchema.default({}),
});

export const industrySchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema.default("DRAFT"),
  order: z.number().int().default(0),
  name: z.string().min(2).max(120),
  icon: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  hero: z.record(z.string(), z.unknown()).default({}),
  painPoints: z.array(z.unknown()).default([]),
  solutions: z.array(z.unknown()).default([]),
  workflow: z.array(z.unknown()).default([]),
  results: z.array(z.unknown()).default([]),
  testimonial: z.record(z.string(), z.unknown()).default({}),
  seo: seoSchema.default({}),
});

// ───────────────────────────── Blog ─────────────────────────────────────────

export const blogCategorySchema = z.object({
  slug: slugSchema,
  name: z.string().min(2).max(80),
  description: z.string().optional(),
  order: z.number().int().default(0),
});

export const blogPostSchema = z.object({
  slug: slugSchema,
  status: blogStatusSchema.default("DRAFT"),
  publishDate: z.coerce.date().optional().nullable(),
  title: z.string().min(3).max(160),
  excerpt: z.string().max(400).optional(),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  author: z.record(z.string(), z.unknown()).default({}),
  // readTime is computed server-side from `content`; any value sent is ignored.
  readTime: z.number().int().min(0).default(0),
  seo: seoSchema.default({}),
});
export type BlogPostInput = z.infer<typeof blogPostSchema>;

/** PUT body for a post — every field optional, slug renames allowed. */
export const blogPostUpdateSchema = blogPostSchema.partial();

export const BLOG_POST_SORT_FIELDS = [
  "createdAt",
  "updatedAt",
  "publishDate",
  "title",
  "views",
] as const;

/** Query params for the admin Blog posts list. */
export const blogPostListQuerySchema = paginationSchema.extend({
  sort: z.enum(BLOG_POST_SORT_FIELDS).default("createdAt"),
  status: blogStatusSchema.optional(),
  categoryId: z.string().optional(),
});
export type BlogPostListQuery = z.infer<typeof blogPostListQuerySchema>;

/** PUT body for a category. */
export const blogCategoryUpdateSchema = blogCategorySchema.partial();

/** Public blog feed query: published-only, paginated, category/tag filters. */
export const publicBlogListQuerySchema = paginationSchema.extend({
  /** Filter by category *slug* (friendlier for public URLs than id). */
  category: z.string().optional(),
  tag: z.string().optional(),
});
export type PublicBlogListQuery = z.infer<typeof publicBlogListQuerySchema>;

// ─────────────────────────── CRM / Sales ────────────────────────────────────

export const leadSchema = z.object({
  source: leadSourceSchema.default("CONTACT"),
  status: leadStatusSchema.default("NEW"),
  priority: prioritySchema.default("MEDIUM"),
  name: z.string().min(2).max(120),
  email: emailSchema.optional().or(z.literal("")),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  teamSize: z.string().optional(),
  interestedProducts: z.array(z.string()).default([]),
  description: z.string().max(2000).optional(),
  consultation: z.record(z.string(), z.unknown()).default({}),
  assignedTo: z.string().optional().nullable(),
  utm: z.record(z.string(), z.unknown()).default({}),
});
export type LeadInput = z.infer<typeof leadSchema>;

/** Public-facing lead capture (contact form, consultation booking). */
export const leadCaptureSchema = z.object({
  source: leadSourceSchema,
  name: z.string().min(2).max(120),
  email: emailSchema.optional().or(z.literal("")),
  phone: phoneSchema.optional(),
  whatsapp: z.string().optional(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  teamSize: z.string().optional(),
  interestedProducts: z.array(z.string()).default([]),
  description: z.string().max(2000).optional(),
  consultation: z.record(z.string(), z.unknown()).optional(),
  utm: z.record(z.string(), z.unknown()).optional(),
});

// ───────────────────── Public lead capture (per channel) ────────────────────

/** Details collected when a visitor books a consultation slot. */
export const consultationDetailsSchema = z.object({
  date: z.string().min(1, "Please pick a date"),
  time: z.string().max(20).optional(),
  mode: z.enum(["online", "phone", "in_person"]).default("online"),
  notes: z.string().max(1000).optional(),
});

/**
 * Fields common to every public enquiry form. `hp` is a honeypot — real users
 * never see it, so any non-empty value means a bot and fails validation.
 */
const publicLeadShape = {
  name: z.string().min(2, "Please enter your name").max(120),
  email: emailSchema.optional().or(z.literal("")),
  phone: phoneSchema.optional().or(z.literal("")),
  whatsapp: z.string().max(20).optional(),
  businessName: z.string().max(160).optional(),
  businessType: z.string().max(120).optional(),
  teamSize: z.string().max(40).optional(),
  interestedProducts: z.array(z.string()).default([]),
  description: z.string().max(2000).optional(),
  utm: z.record(z.string(), z.unknown()).optional(),
  hp: z.string().max(0, "Bot detected").optional(),
};

const hasContact = (d: { email?: string; phone?: string }) =>
  Boolean(d.email) || Boolean(d.phone);
const contactError = {
  message: "Provide an email or phone number so we can reach you",
  path: ["email"] as (string | number)[],
};

/** Contact form → LeadSource.CONTACT. Message (description) is required. */
export const contactFormSchema = z
  .object({
    ...publicLeadShape,
    description: z
      .string()
      .min(5, "Please tell us how we can help")
      .max(2000),
  })
  .refine(hasContact, contactError);
export type ContactFormInput = z.infer<typeof contactFormSchema>;

/** Demo request → LeadSource.DEMO. Email required for the invite. */
export const demoRequestSchema = z.object({
  ...publicLeadShape,
  email: emailSchema,
});
export type DemoRequestInput = z.infer<typeof demoRequestSchema>;

/** Consultation booking → LeadSource.CONSULTATION. */
export const consultationRequestSchema = z
  .object({
    ...publicLeadShape,
    consultation: consultationDetailsSchema,
  })
  .refine(hasContact, contactError);
export type ConsultationRequestInput = z.infer<typeof consultationRequestSchema>;

// ───────────────────── Admin lead management ────────────────────────────────

/** Free-form note appended to a lead's timeline. */
export const leadNoteSchema = z.object({
  text: z.string().min(1, "Note cannot be empty").max(2000),
});

/** Move a lead along the pipeline; optional note documents the reason. */
export const leadStatusUpdateSchema = z.object({
  status: leadStatusSchema,
  note: z.string().max(2000).optional(),
});

/** Assign (or unassign with null) a lead to an admin user. */
export const leadAssignSchema = z.object({
  assignedTo: z.string().min(1).nullable(),
});

/** Partial update of core lead fields from the detail page. */
export const leadUpdateSchema = leadSchema.partial();

export const LEAD_SORT_FIELDS = [
  "createdAt",
  "updatedAt",
  "priority",
  "status",
] as const;

/** Query params for the admin Leads inbox. */
export const leadListQuerySchema = paginationSchema.extend({
  sort: z.enum(LEAD_SORT_FIELDS).default("createdAt"),
  status: leadStatusSchema.optional(),
  /** Comma-separated statuses for multi-select filtering; OR'd together. */
  statuses: z.string().optional(),
  source: leadSourceSchema.optional(),
  priority: prioritySchema.optional(),
  businessType: z.string().optional(),
  assignedTo: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});
export type LeadListQuery = z.infer<typeof leadListQuerySchema>;

/** PUT /[id]/priority — move a lead up/down the queue. */
export const leadPriorityUpdateSchema = z.object({
  priority: prioritySchema,
});

/**
 * POST /[id]/communications — send (and log) an outbound message.
 * `call` is a logging-only channel (records a call summary, no outbound send).
 */
export const leadCommunicationSchema = z.object({
  channel: z.enum(["email", "whatsapp", "call"]),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, "Message is required").max(5000),
});

/** POST /[id]/convert — promote a lead to a customer. */
export const leadConvertSchema = z.object({
  // Customer.email is required + unique; fall back to the lead's email if blank.
  email: emailSchema.optional(),
  phone: z.string().optional(),
  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GSTIN",
    )
    .optional()
    .or(z.literal("")),
  address: z.record(z.string(), z.unknown()).optional(),
});

/** GET /export — same filters as the inbox, minus pagination. */
export const leadExportQuerySchema = z.object({
  status: leadStatusSchema.optional(),
  statuses: z.string().optional(),
  source: leadSourceSchema.optional(),
  priority: prioritySchema.optional(),
  businessType: z.string().optional(),
  assignedTo: z.string().optional(),
  search: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

export const customerSchema = z.object({
  name: z.string().min(2).max(120),
  email: emailSchema,
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  gstNumber: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN")
    .optional()
    .or(z.literal("")),
  address: z.record(z.string(), z.unknown()).default({}),
});

/** PUT body for a customer — all fields optional. */
export const customerUpdateSchema = customerSchema.partial();

export const CUSTOMER_SORT_FIELDS = [
  "createdAt",
  "updatedAt",
  "totalSpent",
  "ordersCount",
  "name",
] as const;

/** Query params for the admin Customers list (search spans name/email/phone). */
export const customerListQuerySchema = paginationSchema.extend({
  sort: z.enum(CUSTOMER_SORT_FIELDS).default("createdAt"),
});
export type CustomerListQuery = z.infer<typeof customerListQuerySchema>;

export const orderSchema = z.object({
  customerId: z.string().optional().nullable(),
  product: z.record(z.string(), z.unknown()).default({}),
  pricing: z.record(z.string(), z.unknown()).default({}),
  subscription: z.record(z.string(), z.unknown()).default({}),
  customerInfo: z.record(z.string(), z.unknown()).default({}),
  status: orderStatusSchema.default("PENDING"),
});

export const ORDER_SORT_FIELDS = ["createdAt", "updatedAt", "status"] as const;

/** Query params for the admin Orders list. */
export const orderListQuerySchema = paginationSchema.extend({
  sort: z.enum(ORDER_SORT_FIELDS).default("createdAt"),
  status: orderStatusSchema.optional(),
  customerId: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});
export type OrderListQuery = z.infer<typeof orderListQuerySchema>;

/** PUT /[id]/status — move an order along its lifecycle. */
export const orderStatusUpdateSchema = z.object({
  status: orderStatusSchema,
  note: z.string().max(2000).optional(),
});

/** POST /[id]/refund — full or partial refund. */
export const refundSchema = z.object({
  /** Amount in major units (₹). Omit for a full refund. */
  amount: z.number().positive().optional(),
  reason: z.string().max(500).optional(),
  speed: z.enum(["normal", "optimum"]).default("normal"),
});

/**
 * POST /api/public/orders — checkout. Creates a PENDING order + a Razorpay
 * order the client opens in the Razorpay checkout widget. `hp` is a honeypot.
 */
export const publicOrderCreateSchema = z.object({
  product: z.object({
    slug: slugSchema,
    name: z.string().min(1).max(160),
    plan: z.string().max(80).optional(),
    qty: z.number().int().min(1).max(999).default(1),
  }),
  pricing: z.object({
    subtotal: z.number().nonnegative(),
    tax: z.number().nonnegative().default(0),
    discount: z.number().nonnegative().default(0),
    total: z.number().positive("Order total must be greater than zero"),
    currency: z.string().length(3).default("INR"),
  }),
  subscription: z
    .object({
      interval: z.enum(["monthly", "yearly", "one_time"]).default("one_time"),
      autoRenew: z.boolean().default(false),
    })
    .optional(),
  customer: z.object({
    name: z.string().min(2).max(120),
    email: emailSchema,
    phone: phoneSchema.optional().or(z.literal("")),
    gstNumber: z.string().max(20).optional(),
    address: z.record(z.string(), z.unknown()).optional(),
  }),
  hp: z.string().max(0, "Bot detected").optional(),
});
export type PublicOrderInput = z.infer<typeof publicOrderCreateSchema>;

/**
 * POST /api/public/orders/verify — the Razorpay checkout success handler posts
 * these three fields back so we can confirm payment instantly (the webhook
 * reconciles independently and idempotently).
 */
export const paymentVerifySchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

// ───────────────────── Social proof & misc ──────────────────────────────────

export const testimonialSchema = z.object({
  status: testimonialStatusSchema.default("PENDING"),
  isDisplayed: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  quote: z.string().min(10).max(1000),
  name: z.string().min(2).max(120),
  role: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  rating: z.number().int().min(1).max(5).default(5),
  avatar: z.string().optional(),
});

/** PUT body for a testimonial — all fields optional. */
export const testimonialUpdateSchema = testimonialSchema.partial();

export const TESTIMONIAL_SORT_FIELDS = [
  "createdAt",
  "displayOrder",
  "rating",
] as const;

/** Query params for the admin Testimonials list. */
export const testimonialListQuerySchema = paginationSchema.extend({
  sort: z.enum(TESTIMONIAL_SORT_FIELDS).default("createdAt"),
  status: testimonialStatusSchema.optional(),
  isDisplayed: z
    .union([z.literal("true"), z.literal("false")])
    .transform((v) => v === "true")
    .optional(),
});
export type TestimonialListQuery = z.infer<typeof testimonialListQuerySchema>;

/** Approve / reject (or move back to pending). */
export const testimonialStatusSchema_update = z.object({
  status: testimonialStatusSchema,
});

/** Show / hide a testimonial on the public site. */
export const testimonialDisplaySchema = z.object({
  isDisplayed: z.boolean(),
});

/** Reorder payload: ordered list of testimonial ids → displayOrder = index. */
export const testimonialReorderSchema = z.object({
  order: z.array(z.string().min(1)).min(1, "Provide at least one id"),
});

export const caseStudySchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema.default("DRAFT"),
  title: z.string().min(3).max(160),
  client: z.record(z.string(), z.unknown()).default({}),
  challenge: z.string().optional(), // rich text (HTML / MDX)
  solution: z.string().optional(), // rich text (HTML / MDX)
  results: z.array(z.unknown()).default([]),
  productsUsed: z.array(z.string()).default([]),
  testimonial: z.record(z.string(), z.unknown()).default({}),
  featuredImage: z.string().optional(),
  seo: seoSchema.default({}),
});

/** PUT body for a case study — all fields optional, slug renames allowed. */
export const caseStudyUpdateSchema = caseStudySchema.partial();

export const CASE_STUDY_SORT_FIELDS = [
  "createdAt",
  "updatedAt",
  "title",
  "status",
] as const;

/** Query params for the admin Case Studies list. */
export const caseStudyListQuerySchema = paginationSchema.extend({
  sort: z.enum(CASE_STUDY_SORT_FIELDS).default("createdAt"),
  status: contentStatusSchema.optional(),
  /** Include soft-deleted (ARCHIVED) records — admin only. */
  includeArchived: z
    .union([z.literal("true"), z.literal("false")])
    .transform((v) => v === "true")
    .default("false"),
});
export type CaseStudyListQuery = z.infer<typeof caseStudyListQuerySchema>;

export const integrationSettingSchema = z.object({
  integrationKey: z.enum([
    "whatsapp",
    "email",
    "razorpay",
    "analytics",
    "sms",
    "cloudinary",
  ]),
  isActive: z.boolean().default(false),
  config: z.record(z.string(), z.unknown()).default({}),
});

export const notificationSettingSchema = z.object({
  event: z.string().min(1).max(60),
  channels: z.record(z.string(), z.unknown()).default({}),
});

// ───────────────────── Integrations (admin) ─────────────────────────────────

export const integrationKeySchema = z.enum([
  "whatsapp",
  "email",
  "razorpay",
  "analytics",
  "sms",
  "cloudinary",
]);
export type IntegrationKeyInput = z.infer<typeof integrationKeySchema>;

/**
 * PUT body for a single integration. `config` is a flat key→value map; secret
 * fields the client leaves as their masked placeholder (•••) are ignored and
 * the stored value is preserved (see `@/lib/admin/integrations`).
 */
export const integrationUpdateSchema = z.object({
  isActive: z.boolean().optional(),
  config: z.record(z.string(), z.unknown()).default({}),
});

/** Optional body for POST /test — an address to send a probe message to. */
export const integrationTestSchema = z
  .object({
    to: z.string().max(200).optional(),
  })
  .default({});

// ─────────────────────── Notification settings ──────────────────────────────

/** Events that can fan out to email / WhatsApp / SMS channels. */
export const NOTIFICATION_EVENTS = [
  "new_lead",
  "new_order",
  "payment_failed",
  "consultation_booked",
] as const;
export const notificationEventSchema = z.enum(NOTIFICATION_EVENTS);

const emailChannelSchema = z.object({
  enabled: z.boolean().default(false),
  recipients: z.array(z.string().max(200)).max(50).default([]),
});
const phoneChannelSchema = z.object({
  enabled: z.boolean().default(false),
  numbers: z.array(z.string().max(40)).max(50).default([]),
});

export const notificationChannelsSchema = z.object({
  email: emailChannelSchema.default({ enabled: false, recipients: [] }),
  whatsapp: phoneChannelSchema.default({ enabled: false, numbers: [] }),
  sms: phoneChannelSchema.default({ enabled: false, numbers: [] }),
});
export type NotificationChannels = z.infer<typeof notificationChannelsSchema>;

/** PUT body for a single notification event's channel config. */
export const notificationUpdateSchema = z.object({
  channels: notificationChannelsSchema,
});

// ───────────────────────────── Media ────────────────────────────────────────

export const MEDIA_SORT_FIELDS = ["createdAt", "size", "filename"] as const;

/** Query params for the admin Media library. */
export const mediaListQuerySchema = paginationSchema.extend({
  sort: z.enum(MEDIA_SORT_FIELDS).default("createdAt"),
  folder: z.string().max(120).optional(),
  /** Filter by mime prefix or exact type, e.g. `image/png` or `image`. */
  mimeType: z.string().max(60).optional(),
});
export type MediaListQuery = z.infer<typeof mediaListQuerySchema>;

/** PUT body for a media file — rename its folder / edit alt text. */
export const mediaUpdateSchema = z
  .object({
    alt: z.string().max(300).optional(),
    folder: z
      .string()
      .max(120)
      .regex(/^[a-zA-Z0-9_\-/]+$/, "Folder may contain letters, numbers, - _ /")
      .optional(),
  })
  .refine((d) => d.alt !== undefined || d.folder !== undefined, {
    message: "Provide alt text or a folder to update",
  });

// ───────────────────────────── Analytics ────────────────────────────────────

/** Window selector for analytics endpoints (defaults to the last 30 days). */
export const analyticsQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(365).default(30),
});
export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>;

// ─────────────────────────────── Team ───────────────────────────────────────

/** Create / invite a team member. Password optional → an invite is generated. */
export const teamInviteSchema = z.object({
  name: z.string().min(2).max(80),
  email: emailSchema,
  role: adminRoleSchema.default("VIEWER"),
  permissions: z.array(z.string()).default([]),
  password: z.string().min(8).max(72).optional(),
});
export type TeamInviteInput = z.infer<typeof teamInviteSchema>;

/** Update a team member's role / permissions / active flag. */
export const teamUpdateSchema = z
  .object({
    name: z.string().min(2).max(80).optional(),
    role: adminRoleSchema.optional(),
    permissions: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    avatar: z.string().url().optional().or(z.literal("")),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Provide at least one field to update",
  });

export const ACTIVITY_LOG_SORT_FIELDS = ["createdAt"] as const;

/** Query params for the activity log feed (Team → Activity). */
export const activityLogQuerySchema = paginationSchema.extend({
  sort: z.enum(ACTIVITY_LOG_SORT_FIELDS).default("createdAt"),
  module: z.string().max(60).optional(),
  action: z.string().max(60).optional(),
  userId: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});
export type ActivityLogQuery = z.infer<typeof activityLogQuerySchema>;

// ─────────────────────────────── System ─────────────────────────────────────

/** Toggle maintenance mode on/off with an optional public message. */
export const maintenanceSchema = z.object({
  enabled: z.boolean(),
  message: z.string().max(300).optional(),
  /** Optional ISO timestamp the maintenance window is expected to end. */
  until: z.coerce.date().optional().nullable(),
});

/** Cache clear / ISR revalidation request. */
export const cacheClearSchema = z
  .object({
    paths: z.array(z.string().min(1)).max(100).optional(),
    tags: z.array(z.string().min(1)).max(100).optional(),
    /** Revalidate the whole site layout (`/`, layout). */
    all: z.boolean().optional(),
  })
  .refine((d) => d.all || d.paths?.length || d.tags?.length, {
    message: "Provide paths, tags, or set all=true",
  });
