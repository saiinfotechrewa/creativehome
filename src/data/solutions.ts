import type { Solution } from "@/lib/types";

/** The complete catalog of business solutions CreativeDox offers. */
export const SOLUTIONS: Solution[] = [
  {
    id: "attendance-management",
    title: "Attendance Management",
    shortDescription:
      "Biometric and mobile attendance with leave and payroll built in.",
    longDescription:
      "Track every punch-in across branches with biometric, GPS, and selfie check-ins. Automate leave approvals, shift rosters, and overtime — then push everything straight into payroll.",
    icon: "calendar-clock",
    features: [
      "Biometric & mobile GPS check-in",
      "Shift scheduling & rosters",
      "Leave & holiday management",
      "Overtime & late-mark rules",
      "Payroll integration",
      "Geo-fenced field staff tracking",
      "Monthly attendance reports",
      "Employee self-service app",
    ],
    href: "/solutions/attendance-management",
    color: "text-sky-400",
    hex: "#38bdf8",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    id: "crm-software",
    title: "CRM Software",
    shortDescription:
      "Every lead, customer, and deal in one organized pipeline.",
    longDescription:
      "Capture leads from every channel, assign them to the right salesperson, and follow each deal through a visual pipeline. Reminders, call logs, and WhatsApp follow-ups keep nothing from slipping.",
    icon: "users",
    features: [
      "Multi-channel lead capture",
      "Visual deal pipeline",
      "Auto lead assignment",
      "Follow-up reminders & tasks",
      "Call & meeting logs",
      "WhatsApp & email follow-ups",
      "Sales team performance reports",
      "Customer history timeline",
    ],
    href: "/solutions/crm-software",
    color: "text-violet-400",
    hex: "#a78bfa",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "accounting-inventory",
    title: "Accounting & Inventory",
    shortDescription:
      "GST billing, stock control, and financial reports in one place.",
    longDescription:
      "Create GST-compliant invoices in seconds, track stock across godowns in real time, and close your books with ready-made P&L, balance sheet, and GSTR reports. Tally import/export included.",
    icon: "calculator",
    features: [
      "GST invoicing & e-way bills",
      "GSTR-1 / GSTR-3B reports",
      "Multi-godown stock tracking",
      "Low-stock alerts & reorder points",
      "Barcode billing & POS",
      "Outstanding & payment reminders",
      "P&L, balance sheet & ledgers",
      "Tally import / export",
    ],
    href: "/solutions/accounting-inventory",
    color: "text-emerald-400",
    hex: "#34d399",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "whatsapp-automation",
    title: "WhatsApp Automation",
    shortDescription:
      "Bulk campaigns, auto-replies, and customer engagement on WhatsApp.",
    longDescription:
      "Reach thousands of customers with personalized broadcast campaigns on the official WhatsApp Business API. Auto-replies, chatbots, and catalog messages turn chats into orders.",
    icon: "message-circle",
    features: [
      "Official WhatsApp Business API",
      "Bulk broadcast campaigns",
      "Personalized message templates",
      "Chatbot & auto-replies",
      "Catalog & payment messages",
      "Drip & festival campaigns",
      "Delivery & read analytics",
      "Shared team inbox",
    ],
    href: "/solutions/whatsapp-automation",
    color: "text-green-400",
    hex: "#4ade80",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: "marketing-automation",
    title: "Marketing Automation",
    shortDescription:
      "Multi-channel campaigns with lead scoring and clear analytics.",
    longDescription:
      "Run coordinated campaigns across WhatsApp, SMS, and email from one dashboard. Score leads automatically by behavior so your sales team always calls the hottest prospects first.",
    icon: "megaphone",
    features: [
      "WhatsApp, SMS & email campaigns",
      "Drag-and-drop journey builder",
      "Behavior-based lead scoring",
      "Audience segmentation",
      "Landing page & form builder",
      "A/B testing",
      "Campaign ROI analytics",
      "CRM sync",
    ],
    href: "/solutions/marketing-automation",
    color: "text-orange-400",
    hex: "#fb923c",
    gradient: "from-orange-500 to-amber-600",
  },
  {
    id: "cable-tv-management",
    title: "Cable TV Management",
    shortDescription:
      "Subscriber billing and collection tracking for cable operators.",
    longDescription:
      "Manage your entire subscriber base — packages, set-top boxes, and monthly billing — from one app. Collection agents mark payments in the field and you see dues update live.",
    icon: "tv",
    features: [
      "Subscriber & STB management",
      "Package & plan billing",
      "Agent-wise collection tracking",
      "Auto monthly invoice generation",
      "Due & payment reminders on WhatsApp",
      "Area / locality-wise reports",
      "Online payment collection",
      "Complaint management",
    ],
    href: "/solutions/cable-tv-management",
    color: "text-rose-400",
    hex: "#fb7185",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: "school-management",
    title: "School Management",
    shortDescription:
      "Attendance, fees, exams, and a parent portal — all connected.",
    longDescription:
      "Run admissions, daily attendance, fee collection, and exams from a single system. Parents get instant updates, report cards, and fee receipts on their phone.",
    icon: "graduation-cap",
    features: [
      "Student admissions & records",
      "Class-wise daily attendance",
      "Fee structure & online collection",
      "Exam scheduling & report cards",
      "Parent mobile portal",
      "SMS / WhatsApp notifications",
      "Transport & route management",
      "Staff & timetable management",
    ],
    href: "/solutions/school-management",
    color: "text-indigo-400",
    hex: "#818cf8",
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    id: "erp-solutions",
    title: "ERP Solutions",
    shortDescription:
      "End-to-end operations — purchase to production to dispatch.",
    longDescription:
      "Connect purchase, production, inventory, sales, and accounts into one system so every department works from the same live numbers. Built module by module around how your business actually runs.",
    icon: "network",
    features: [
      "Purchase & vendor management",
      "Production planning & BOM",
      "Inventory & warehouse control",
      "Sales & dispatch management",
      "Integrated accounting",
      "Role-based approvals",
      "Branch-wise operations",
      "Custom MIS dashboards",
    ],
    href: "/solutions/erp-solutions",
    color: "text-cyan-400",
    hex: "#22d3ee",
    gradient: "from-cyan-500 to-sky-600",
  },
  {
    id: "lead-management",
    title: "Lead Management",
    shortDescription: "Capture, track, nurture, and convert every enquiry.",
    longDescription:
      "Pull enquiries from Facebook, Google, your website, and walk-ins into one queue. Automatic assignment, timely follow-ups, and nurture sequences make sure every lead gets worked.",
    icon: "filter",
    features: [
      "Facebook & Google lead sync",
      "Website & QR enquiry forms",
      "Round-robin lead assignment",
      "Follow-up scheduling & alerts",
      "WhatsApp nurture sequences",
      "Lead source ROI tracking",
      "Duplicate detection",
      "Conversion funnel reports",
    ],
    href: "/solutions/lead-management",
    color: "text-fuchsia-400",
    hex: "#e879f9",
    gradient: "from-fuchsia-500 to-purple-600",
  },
  {
    id: "custom-development",
    title: "Custom Development",
    shortDescription: "Tailor-made software built around your exact workflows.",
    longDescription:
      "When off-the-shelf doesn't fit, we design and build it: web apps, mobile apps, portals, and integrations. You own the roadmap; we handle architecture, delivery, and support.",
    icon: "code",
    features: [
      "Web & mobile app development",
      "Requirement workshops & prototyping",
      "API & third-party integrations",
      "Cloud hosting & DevOps",
      "Legacy software modernization",
      "Dedicated delivery team",
      "Training & documentation",
      "Long-term support & AMC",
    ],
    href: "/solutions/custom-development",
    color: "text-amber-400",
    hex: "#fbbf24",
    gradient: "from-amber-500 to-orange-600",
  },
];

/** Look up a solution by its slug. */
export function getSolution(id: string): Solution | undefined {
  return SOLUTIONS.find((solution) => solution.id === id);
}
