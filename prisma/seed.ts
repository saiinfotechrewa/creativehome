/**
 * Database seed for the CreativeDox admin panel.
 *
 *   npm run db:seed            (runs `prisma db seed` → tsx prisma/seed.ts)
 *
 * Idempotent: every record is upserted, so re-running won't create duplicates.
 * Source-of-truth marketing content is imported from the existing `src/data/*`
 * files so the database mirrors what the public site already renders.
 *
 * NOTE: the data files use `import type` for their shapes, so those `@/...`
 * imports are erased at runtime — tsx doesn't need tsconfig path resolution.
 */
import { PrismaClient, Prisma, type ContentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

import { PRODUCTS } from "../src/data/products";
import { STATS } from "../src/data/stats";
import { PROCESS_STEPS } from "../src/data/process";
import { ADVANTAGES } from "../src/data/advantages";
import { SOLUTIONS } from "../src/data/solutions";
import { TESTIMONIALS } from "../src/data/testimonials";

const prisma = new PrismaClient();

/**
 * Round-trip a value through JSON so TypeScript sees plain JSON-compatible
 * types. The `src/data` files export richly-typed interface arrays which don't
 * structurally satisfy Prisma's `InputJsonValue` (missing index signature);
 * cloning erases the nominal type while keeping the runtime data identical.
 */
function toJson<T>(value: T): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

// ───────────────────────────── 1. Super admin ───────────────────────────────

async function seedSuperAdmin() {
  const email = "admin@creativedox.com";
  const password = await bcrypt.hash("Admin@123", 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { role: "SUPERADMIN", isActive: true },
    create: {
      name: "Super Admin",
      email,
      password,
      role: "SUPERADMIN",
      isActive: true,
      permissions: [], // SUPERADMIN gets all permissions via role resolution
    },
  });

  console.log(`✔ Super admin ready: ${email} / Admin@123`);
}

// ────────────────────────── 2. Company settings ─────────────────────────────

async function seedCompanySettings() {
  await prisma.companySettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      companyName: "CreativeDox",
      tagline: "Business software & automation, built for Bharat.",
      email: "hello@creativedox.com",
      phone: "+91 90000 00000",
      whatsapp: "+91 90000 00000",
      address: {
        line1: "CreativeDox HQ",
        city: "Rewa",
        state: "Madhya Pradesh",
        pincode: "486001",
        country: "India",
      },
      businessHours: {
        mon: "9:30 AM – 6:30 PM",
        tue: "9:30 AM – 6:30 PM",
        wed: "9:30 AM – 6:30 PM",
        thu: "9:30 AM – 6:30 PM",
        fri: "9:30 AM – 6:30 PM",
        sat: "10:00 AM – 4:00 PM",
        sun: "Closed",
      },
      socialLinks: {
        facebook: "https://facebook.com/creativedox",
        instagram: "https://instagram.com/creativedox",
        linkedin: "https://linkedin.com/company/creativedox",
        youtube: "https://youtube.com/@creativedox",
        twitter: "https://x.com/creativedox",
      },
      seoDefaults: {
        title: "CreativeDox — Business Software & Automation",
        description:
          "Ready-to-use business software and custom automation for Indian SMBs — CRM, attendance, accounting, WhatsApp and more.",
        keywords: ["business software", "automation", "CRM", "GST billing", "India"],
        ogImage: "/og/default.png",
      },
    },
  });

  console.log("✔ Company settings seeded");
}

// ───────────────────────── 3. Homepage sections ─────────────────────────────

async function seedHomepageSections() {
  const sections: Array<{
    sectionKey: string;
    order: number;
    content: Prisma.InputJsonValue;
  }> = [
    {
      sectionKey: "hero",
      order: 0,
      content: toJson({
        eyebrow: "Business software & automation",
        title: "Run your entire business on one platform",
        subtitle:
          "Ready-to-use software and custom automation that saves Indian businesses hours every day.",
        ctaPrimary: { label: "Book a free consultation", href: "/book-consultation" },
        ctaSecondary: { label: "Explore products", href: "/#products" },
      }),
    },
    { sectionKey: "stats", order: 1, content: toJson({ items: STATS }) },
    { sectionKey: "solutions", order: 2, content: toJson({ items: SOLUTIONS }) },
    { sectionKey: "products", order: 3, content: toJson({ items: PRODUCTS }) },
    { sectionKey: "process", order: 4, content: toJson({ steps: PROCESS_STEPS }) },
    { sectionKey: "whyChooseUs", order: 5, content: toJson({ items: ADVANTAGES }) },
    { sectionKey: "testimonials", order: 6, content: toJson({ items: TESTIMONIALS }) },
    {
      sectionKey: "finalCta",
      order: 7,
      content: toJson({
        title: "Ready to automate your business?",
        subtitle: "Talk to our team and get a tailored recommendation — free.",
        cta: { label: "Book a free consultation", href: "/book-consultation" },
      }),
    },
  ];

  for (const section of sections) {
    await prisma.homepageSection.upsert({
      where: { sectionKey: section.sectionKey },
      update: { order: section.order, content: section.content },
      create: { ...section, isActive: true },
    });
  }

  console.log(`✔ ${sections.length} homepage sections seeded`);
}

// ───────────────────────────── 4. Products ──────────────────────────────────

async function seedProducts() {
  for (const [index, p] of PRODUCTS.entries()) {
    // Map the public `from-x to-y` gradient string into a {from,to} object.
    const gradientParts = (p.gradient ?? "").split(/\s+/);
    const gradient = {
      from: gradientParts.find((s) => s.startsWith("from-")) ?? "",
      to: gradientParts.find((s) => s.startsWith("to-")) ?? "",
      raw: p.gradient ?? "",
    };

    await prisma.product.upsert({
      where: { slug: p.id },
      update: {
        status: "ACTIVE" as ContentStatus,
        order: index,
        name: p.name,
        tagline: p.tagline,
        descriptions: { short: p.tagline, long: p.description },
        icon: p.icon,
        gradient,
        badge: p.badge ?? null,
        features: (p.features ?? []).map((f) => ({ title: f })),
        pricing: {
          label: p.pricing,
          monthly: p.priceMonthly,
          currency: "INR",
        },
        urls: { demo: p.demoUrl, login: p.loginUrl, buy: p.buyUrl },
        screenshots: p.screenshot ? [{ url: p.screenshot, alt: p.name }] : [],
      },
      create: {
        slug: p.id,
        status: "ACTIVE" as ContentStatus,
        order: index,
        name: p.name,
        tagline: p.tagline,
        descriptions: { short: p.tagline, long: p.description },
        icon: p.icon,
        gradient,
        badge: p.badge ?? null,
        features: (p.features ?? []).map((f) => ({ title: f })),
        pricing: {
          label: p.pricing,
          monthly: p.priceMonthly,
          currency: "INR",
        },
        urls: { demo: p.demoUrl, login: p.loginUrl, buy: p.buyUrl },
        screenshots: p.screenshot ? [{ url: p.screenshot, alt: p.name }] : [],
        seo: {
          title: `${p.name} — CreativeDox`,
          description: p.description,
        },
      },
    });
  }

  console.log(`✔ ${PRODUCTS.length} products seeded`);
}

// ─────────────────────────── 5. Testimonials ────────────────────────────────

async function seedTestimonials() {
  for (const [index, t] of TESTIMONIALS.entries()) {
    // Stable id derived from the source data so re-seeding is idempotent.
    const id = `seed-${t.id}`;
    await prisma.testimonial.upsert({
      where: { id },
      update: {},
      create: {
        id,
        status: "APPROVED",
        isDisplayed: true,
        displayOrder: index,
        quote: t.quote,
        name: t.name,
        role: t.role,
        company: t.company,
        industry: t.industry,
        rating: t.rating,
        avatar: t.avatar,
      },
    });
  }

  console.log(`✔ ${TESTIMONIALS.length} testimonials seeded`);
}

// ───────────────────── 6. Integration settings (inactive) ───────────────────

async function seedIntegrations() {
  const keys = ["whatsapp", "email", "razorpay", "analytics", "sms", "cloudinary"];

  for (const integrationKey of keys) {
    await prisma.integrationSetting.upsert({
      where: { integrationKey },
      update: {},
      create: { integrationKey, isActive: false, config: {} },
    });
  }

  console.log(`✔ ${keys.length} integration settings seeded (all inactive)`);
}

// ─────────────────────── 7. Notification settings ───────────────────────────

async function seedNotifications() {
  const events = [
    "new_lead",
    "new_order",
    "payment_success",
    "testimonial_submitted",
    "consultation_booked",
  ];

  for (const event of events) {
    await prisma.notificationSetting.upsert({
      where: { event },
      update: {},
      create: {
        event,
        channels: { email: true, whatsapp: false, inApp: true, recipients: [] },
      },
    });
  }

  console.log(`✔ ${events.length} notification settings seeded`);
}

// ───────────────────────────── 8. Blog category ─────────────────────────────

async function seedBlogCategories() {
  const categories = [
    { slug: "product-updates", name: "Product Updates", order: 0 },
    { slug: "business-automation", name: "Business Automation", order: 1 },
    { slug: "guides", name: "Guides & How-tos", order: 2 },
  ];

  for (const c of categories) {
    await prisma.blogCategory.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  console.log(`✔ ${categories.length} blog categories seeded`);
}

// ─────────────────────────────── Runner ─────────────────────────────────────

async function main() {
  console.log("🌱 Seeding CreativeDox admin database…\n");
  await seedSuperAdmin();
  await seedCompanySettings();
  await seedHomepageSections();
  await seedProducts();
  await seedTestimonials();
  await seedBlogCategories();
  await seedIntegrations();
  await seedNotifications();
  console.log("\n✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
