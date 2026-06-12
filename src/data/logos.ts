import type { PartnerLogo } from "@/lib/types";

/**
 * Tech & integration partners shown in the logo marquee. Rendered as
 * text wordmarks until real logo assets are added. The marquee splits
 * these across two counter-scrolling rows.
 */
export const PARTNER_LOGOS: PartnerLogo[] = [
  { id: "google-cloud", name: "Google Cloud" },
  { id: "aws", name: "AWS" },
  { id: "whatsapp-business", name: "WhatsApp Business" },
  { id: "razorpay", name: "Razorpay" },
  { id: "meta", name: "Meta" },
  { id: "tally", name: "Tally" },
  { id: "twilio", name: "Twilio" },
  { id: "stripe", name: "Stripe" },
  { id: "mongodb", name: "MongoDB" },
  { id: "react", name: "React" },
  { id: "nodejs", name: "Node.js" },
  { id: "postgresql", name: "PostgreSQL" },
  { id: "redis", name: "Redis" },
  { id: "vercel", name: "Vercel" },
  { id: "digitalocean", name: "DigitalOcean" },
];
