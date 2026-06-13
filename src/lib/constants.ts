/** Company-wide constants and metadata. */
export const SITE_CONFIG = {
  name: "Sai Computers and Refrigeration",
  shortName: "Sai Computers and Refrigeration",
  description:
    "CreativeDox builds ready-to-use business software and automation — CRM, GST accounting, attendance, WhatsApp marketing, and custom development for growing businesses across India.",
  tagline: "Business software & automation, engineered to scale.",
  url: "https://creativedox.com",
  email: "saiinfotechrewa@gmail.com",
  phone: "+91 9993496484",
  address: "B Block Shilpi Plaza, Rewa, Madhya Pradesh, India",
  ogImage: "/og.png",
  keywords: [
    "business software",
    "automation",
    "SaaS development",
    "workflow automation",
    "custom software",
    "CreativeDox",
  ],
} as const;

/** Social profiles and chat channels used in the footer. */
export const SOCIAL_LINKS = {
  linkedin: "https://linkedin.com/company/creativedox",
  twitter: "https://twitter.com/creativedox",
  youtube: "https://youtube.com/@creativedox",
  instagram: "https://instagram.com/creativedox",
  whatsapp: "https://wa.me/919993496484",
} as const;

/** Shared animation timing tokens for Framer Motion. */
export const MOTION = {
  ease: [0.16, 1, 0.3, 1] as const,
  duration: 0.6,
  stagger: 0.08,
} as const;
