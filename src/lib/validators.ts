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
  seoDefaults: seoSchema.default({}),
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
  readTime: z.number().int().min(0).default(0),
  seo: seoSchema.default({}),
});
export type BlogPostInput = z.infer<typeof blogPostSchema>;

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
  source: leadSourceSchema.optional(),
  priority: prioritySchema.optional(),
  assignedTo: z.string().optional(),
});
export type LeadListQuery = z.infer<typeof leadListQuerySchema>;

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

export const orderSchema = z.object({
  customerId: z.string().optional().nullable(),
  product: z.record(z.string(), z.unknown()).default({}),
  pricing: z.record(z.string(), z.unknown()).default({}),
  subscription: z.record(z.string(), z.unknown()).default({}),
  customerInfo: z.record(z.string(), z.unknown()).default({}),
  status: orderStatusSchema.default("PENDING"),
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

export const caseStudySchema = z.object({
  slug: slugSchema,
  status: contentStatusSchema.default("DRAFT"),
  title: z.string().min(3).max(160),
  client: z.record(z.string(), z.unknown()).default({}),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  results: z.array(z.unknown()).default([]),
  productsUsed: z.array(z.string()).default([]),
  testimonial: z.record(z.string(), z.unknown()).default({}),
  featuredImage: z.string().optional(),
  seo: seoSchema.default({}),
});

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
