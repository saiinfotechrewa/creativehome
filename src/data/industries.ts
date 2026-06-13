import type { Industry } from "@/lib/types";

/** Industry verticals CreativeDox serves, with their best-fit solutions. */
export const INDUSTRIES: Industry[] = [
  {
    id: "retail-shops",
    name: "Retail & Shops",
    href: "/industries/retail",
    icon: "store",
    description:
      "Billing counters that never queue up — GST invoicing, barcode POS, stock alerts, and WhatsApp offers that bring customers back.",
    relevantSolutions: [
      "accounting-inventory",
      "whatsapp-automation",
      "crm-software",
    ],
    color: "text-orange-400",
    hex: "#fb923c",
    gradient: "from-orange-500 to-amber-600",
  },
  {
    id: "schools-education",
    name: "Schools & Education",
    href: "/industries/schools-education",
    icon: "graduation-cap",
    description:
      "From admission enquiry to report card — fees, attendance, exams, and a parent portal that keeps families in the loop.",
    relevantSolutions: [
      "school-management",
      "attendance-management",
      "lead-management",
    ],
    color: "text-indigo-400",
    hex: "#818cf8",
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    id: "cable-tv-operators",
    name: "Cable TV Operators",
    href: "/industries/cable-tv-operators",
    icon: "tv",
    description:
      "Subscriber packages, monthly billing, and agent-wise collection tracking — know exactly who's paid and who's due, area by area.",
    relevantSolutions: [
      "cable-tv-management",
      "whatsapp-automation",
      "accounting-inventory",
    ],
    color: "text-rose-400",
    hex: "#fb7185",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    href: "/industries/manufacturing",
    icon: "factory",
    description:
      "Purchase to production to dispatch on one system — BOM, godown stock, worker attendance, and MIS your management can act on.",
    relevantSolutions: [
      "erp-solutions",
      "attendance-management",
      "accounting-inventory",
    ],
    color: "text-cyan-400",
    hex: "#22d3ee",
    gradient: "from-cyan-500 to-sky-600",
  },
  {
    id: "agencies",
    name: "Agencies",
    href: "/industries/agencies",
    icon: "briefcase",
    description:
      "Capture every client enquiry, run multi-channel campaigns for your customers, and report results without spreadsheet gymnastics.",
    relevantSolutions: [
      "marketing-automation",
      "lead-management",
      "crm-software",
    ],
    color: "text-fuchsia-400",
    hex: "#e879f9",
    gradient: "from-fuchsia-500 to-purple-600",
  },
  {
    id: "service-providers",
    name: "Service Providers",
    href: "/industries/service-providers",
    icon: "wrench",
    description:
      "Bookings, field staff attendance, AMC reminders, and payment follow-ups — run the whole service business from your phone.",
    relevantSolutions: [
      "crm-software",
      "attendance-management",
      "whatsapp-automation",
    ],
    color: "text-emerald-400",
    hex: "#34d399",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "startups",
    name: "Startups",
    href: "/industries/startups",
    icon: "rocket",
    description:
      "Move fast without duct-tape tooling — custom MVPs, automations, and integrations built by a team that ships in weeks, not quarters.",
    relevantSolutions: [
      "custom-development",
      "marketing-automation",
      "erp-solutions",
    ],
    color: "text-violet-400",
    hex: "#a78bfa",
    gradient: "from-violet-500 to-purple-600",
  },
];
