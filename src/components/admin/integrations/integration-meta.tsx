import {
  MessageCircle,
  Mail,
  CreditCard,
  BarChart3,
  Smartphone,
  HardDrive,
  Webhook,
  BellRing,
  type LucideIcon,
} from "lucide-react";

import type { IntegrationKey } from "@/lib/admin/integrations-client";

/** Display metadata for every hub destination (real keys + stub sections). */
export interface HubEntry {
  /** Integration key, or a virtual section id for non-integration pages. */
  id: IntegrationKey | "webhooks" | "notifications";
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent: string;
  /** False for sections that have no live backend yet (front-end preview). */
  backed: boolean;
}

export const HUB_ENTRIES: HubEntry[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Twilio / Meta / Wati messaging.",
    href: "/admin/integrations/whatsapp",
    icon: MessageCircle,
    accent: "text-emerald-400",
    backed: true,
  },
  {
    id: "email",
    label: "Email",
    description: "SendGrid, SMTP or Amazon SES.",
    href: "/admin/integrations/email",
    icon: Mail,
    accent: "text-blue-400",
    backed: true,
  },
  {
    id: "razorpay",
    label: "Razorpay",
    description: "Payments, refunds & webhooks.",
    href: "/admin/integrations/razorpay",
    icon: CreditCard,
    accent: "text-indigo-400",
    backed: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "GA4, GTM, Pixel, Hotjar, Clarity.",
    href: "/admin/integrations/analytics",
    icon: BarChart3,
    accent: "text-violet-400",
    backed: true,
  },
  {
    id: "sms",
    label: "SMS",
    description: "Transactional text messages.",
    href: "/admin/integrations/sms",
    icon: Smartphone,
    accent: "text-amber-400",
    backed: true,
  },
  {
    id: "cloudinary",
    label: "Storage",
    description: "Cloudinary or S3 media storage.",
    href: "/admin/integrations/storage",
    icon: HardDrive,
    accent: "text-cyan-400",
    backed: true,
  },
  {
    id: "webhooks",
    label: "Webhooks",
    description: "Custom outbound webhooks.",
    href: "/admin/integrations/webhooks",
    icon: Webhook,
    accent: "text-rose-400",
    backed: false,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Per-event channel routing.",
    href: "/admin/integrations/notifications",
    icon: BellRing,
    accent: "text-pink-400",
    backed: true,
  },
];

export const HUB_BY_KEY = new Map(HUB_ENTRIES.map((e) => [e.id, e]));
