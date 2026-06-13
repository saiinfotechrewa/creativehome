import type { ProductDetail } from "@/lib/types";

/**
 * Full content for every product detail page (/solutions/[slug]).
 * Pure data — pages and sections render entirely from this file, so
 * adding a product here automatically creates its page.
 */
export const PRODUCT_DETAILS: ProductDetail[] = [
  /* ---------------------------------------------------------------- */
  /*  Attendance Management                                            */
  /* ---------------------------------------------------------------- */
  {
    slug: "attendance-management",
    productId: "attendance",
    name: "CreativeDox Attendance",
    tagline: "Attendance, leave & payroll — finally on autopilot",
    heroDescription:
      "Track attendance from biometric devices, mobile GPS, or web — then turn it into payroll-ready reports in one click. Built for offices, factories, and field teams across India.",
    metaTitle: "Attendance Management Software with Payroll Integration",
    metaDescription:
      "Digital attendance software for Indian businesses — biometric & mobile GPS check-in, leave management, shift scheduling, and one-click payroll export. From ₹499/month.",
    color: "text-blue-400",
    hex: "#60a5fa",
    gradient: "from-blue-500 to-sky-600",
    painPointsHeading: "Still tracking attendance in registers and Excel?",
    painPoints: [
      {
        icon: "clock",
        title: "Hours lost every month",
        description:
          "HR spends 2–3 days each month collecting registers, chasing missing punches, and reconciling Excel sheets before salaries can be processed.",
      },
      {
        icon: "alert-triangle",
        title: "Proxy & buddy punching",
        description:
          "Paper registers and shared logins make it easy for one person to mark attendance for another — and you pay for hours never worked.",
      },
      {
        icon: "file-text",
        title: "Payroll errors & disputes",
        description:
          "Manual calculation of late marks, half days, and overtime leads to salary mistakes — and arguments with staff every payday.",
      },
      {
        icon: "map-pin",
        title: "No visibility on field staff",
        description:
          "Sales and service teams work outside the office. Without GPS check-in, you have no idea when or where they actually started their day.",
      },
    ],
    features: [
      {
        icon: "fingerprint",
        title: "Biometric Integration",
        description:
          "Connect fingerprint and face-recognition devices from all major brands. Punches sync to the cloud automatically — no manual download.",
      },
      {
        icon: "map-pin",
        title: "Mobile GPS Check-in",
        description:
          "Field staff mark attendance from their phone with GPS location and an optional selfie, so you know exactly where work started.",
      },
      {
        icon: "calendar-clock",
        title: "Leave Management",
        description:
          "Staff apply for leave in the app; managers approve in one tap. Balances, carry-forwards, and holiday calendars update themselves.",
      },
      {
        icon: "repeat",
        title: "Shift Scheduling",
        description:
          "Create day, night, and rotational shifts with grace periods. Assign by department or branch and handle week-offs automatically.",
      },
      {
        icon: "clock",
        title: "Overtime Tracking",
        description:
          "Overtime hours calculate automatically from punch data based on your rules — single rate, double rate, or compensatory off.",
      },
      {
        icon: "indian-rupee",
        title: "Payroll Integration",
        description:
          "Late marks, half days, leaves, and OT flow straight into a payroll-ready sheet. Export to Excel or push to your payroll system.",
      },
      {
        icon: "smartphone",
        title: "Mobile App for Staff",
        description:
          "Employees see their attendance, leave balance, and holidays in their own app — cutting HR queries to almost zero.",
      },
      {
        icon: "bar-chart",
        title: "Reports & Analytics",
        description:
          "Daily MIS, late-comer trends, department-wise absenteeism, and muster rolls — ready for audits and compliance, anytime.",
      },
      {
        icon: "building",
        title: "Multi-branch Support",
        description:
          "Manage every branch from one dashboard with branch-wise policies, devices, and reports — and one consolidated payroll sheet.",
      },
    ],
    modules: [
      {
        name: "Attendance Capture",
        description:
          "Biometric, mobile GPS, web punch, and manual regularization with an approval trail.",
      },
      {
        name: "Leave Management",
        description:
          "Leave types, policies, balances, carry-forward rules, and multi-level approvals.",
      },
      {
        name: "Shift & Roster",
        description:
          "Shift patterns, rotations, grace time, week-offs, and roster planning by team.",
      },
      {
        name: "Overtime & Late Rules",
        description:
          "Configurable OT slabs, late-mark penalties, and half-day rules applied automatically.",
      },
      {
        name: "Holiday Calendar",
        description:
          "Branch-wise and state-wise holiday lists with restricted/optional holiday support.",
      },
      {
        name: "Payroll Export",
        description:
          "One-click salary-input sheet with paid days, LOP, and OT — Excel and API output.",
      },
      {
        name: "Employee Self-Service",
        description:
          "Mobile app for punches, leave requests, balances, and attendance history.",
      },
      {
        name: "Reports & MIS",
        description:
          "Muster roll, daily MIS emails, late-comer and absenteeism analytics.",
      },
      {
        name: "Device Management",
        description:
          "Register, monitor, and sync biometric devices across all branches from the cloud.",
      },
      {
        name: "Roles & Permissions",
        description:
          "HR, manager, and branch-admin roles with data visibility limited to their teams.",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/attendance-dashboard.png",
        alt: "Attendance dashboard with live present/absent counts",
        caption: "Live dashboard — who's in, who's late, branch by branch",
      },
      {
        src: "/screenshots/attendance-mobile.png",
        alt: "Mobile GPS check-in screen",
        caption: "GPS + selfie check-in for field teams",
      },
      {
        src: "/screenshots/attendance-payroll.png",
        alt: "Payroll-ready attendance report",
        caption: "One-click payroll-ready monthly report",
      },
    ],
    benefits: [
      {
        before: "2–3 days of HR effort to close attendance every month",
        after: "Payroll-ready report generated in one click",
      },
      {
        before: "Proxy punching and inflated hours go unnoticed",
        after: "Biometric + GPS verification on every punch",
      },
      {
        before: "Salary disputes over late marks and leaves",
        after: "Transparent records staff can see in their own app",
      },
      {
        before: "No idea when field staff actually start work",
        after: "Live GPS check-ins with location and time stamps",
      },
      {
        before: "Branch registers reach head office days late",
        after: "Every branch visible on one live dashboard",
      },
    ],
    pricing: [
      {
        name: "Starter",
        priceMonthly: 499,
        priceAnnual: 399,
        description: "For small teams getting off paper registers.",
        features: [
          "Up to 25 employees",
          "Mobile + web attendance",
          "Basic leave management",
          "Monthly attendance reports",
          "Email support",
        ],
        ctaLabel: "Start with Starter",
      },
      {
        name: "Professional",
        priceMonthly: 999,
        priceAnnual: 799,
        description: "For growing businesses with shifts and field staff.",
        features: [
          "Up to 100 employees",
          "Biometric device integration",
          "GPS check-in with selfie",
          "Shift scheduling & overtime",
          "Payroll-ready export",
          "WhatsApp alerts",
          "Priority support",
        ],
        recommended: true,
        ctaLabel: "Get Professional",
      },
      {
        name: "Enterprise",
        priceMonthly: 1999,
        priceAnnual: 1599,
        description: "For multi-branch operations and compliance needs.",
        features: [
          "Unlimited employees",
          "Multi-branch dashboard",
          "Payroll system API integration",
          "Custom policies & approval flows",
          "Audit-ready compliance reports",
          "Dedicated account manager",
        ],
        ctaLabel: "Talk to Sales",
      },
    ],
    faqs: [
      {
        question: "Which biometric devices are supported?",
        answer:
          "We support fingerprint and face-recognition devices from all major brands sold in India, including eSSL, Realtime, ZKTeco, and Matrix. Punches sync to the cloud automatically — no manual data download needed.",
      },
      {
        question: "Can field staff mark attendance without coming to office?",
        answer:
          "Yes. The mobile app lets staff check in with GPS location and an optional selfie. You can also restrict check-ins to a geo-fence around client sites or territories.",
      },
      {
        question: "How does payroll integration work?",
        answer:
          "At month end, the system applies your late, half-day, leave, and overtime rules to generate a salary-input sheet with paid days and LOP. You can export it to Excel, import it into Tally, or push it to your payroll software via API.",
      },
      {
        question: "Can I manage multiple branches?",
        answer:
          "Yes. Each branch gets its own devices, shift rules, and holiday calendar, while head office sees a consolidated live dashboard and combined payroll export.",
      },
      {
        question: "What happens if the internet goes down at a branch?",
        answer:
          "Biometric devices store punches locally and sync automatically when the connection returns. Mobile check-ins also queue offline and upload once the phone is back online.",
      },
      {
        question: "How long does setup take?",
        answer:
          "Most businesses go live in 2–3 days. We help you import your employee list from Excel, connect your devices, and configure leave and shift policies as part of onboarding.",
      },
      {
        question: "Can employees see their own attendance?",
        answer:
          "Yes. The employee app shows daily punches, monthly summary, leave balance, and holiday list — which eliminates most attendance queries to HR.",
      },
      {
        question: "Is my attendance data secure?",
        answer:
          "Data is stored on cloud servers in India with daily backups, encrypted in transit, and accessible only through role-based logins you control.",
      },
      {
        question: "Do you support night shifts that cross midnight?",
        answer:
          "Yes. Night shifts are handled natively — a punch-out after midnight is counted against the previous day's shift, with overtime calculated correctly.",
      },
      {
        question: "Can I try it before buying?",
        answer:
          "Absolutely. Book a free demo and we'll set up a trial account with your own data so you can evaluate it with your actual team for 14 days.",
      },
    ],
    integrations: [
      "Tally",
      "eSSL Biometric",
      "ZKTeco Biometric",
      "Realtime Biometric",
      "WhatsApp",
      "Payroll Systems (API)",
      "Excel Import/Export",
    ],
    relatedProducts: ["crm-software", "accounting-inventory", "erp-solutions"],
  },

  /* ---------------------------------------------------------------- */
  /*  CRM Software                                                     */
  /* ---------------------------------------------------------------- */
  {
    slug: "crm-software",
    productId: "crm",
    name: "CreativeDox CRM",
    tagline: "Every lead worked. Every deal tracked. Nothing slips.",
    heroDescription:
      "Capture enquiries from Facebook, Google, IndiaMART, and your website into one pipeline — auto-assigned to your team, followed up on WhatsApp, and tracked to closure.",
    metaTitle: "CRM Software for Sales Teams — Lead Management & WhatsApp",
    metaDescription:
      "CRM software for Indian businesses — auto lead capture, visual sales pipeline, WhatsApp follow-ups, and team performance reports. From ₹699/month.",
    color: "text-emerald-400",
    hex: "#34d399",
    gradient: "from-green-500 to-emerald-600",
    painPointsHeading: "Leads coming in, but deals slipping away?",
    painPoints: [
      {
        icon: "filter",
        title: "Leads scattered everywhere",
        description:
          "Enquiries arrive on Facebook, IndiaMART, WhatsApp, and phone calls — noted in diaries and personal phones, then forgotten.",
      },
      {
        icon: "clock",
        title: "Follow-ups happen too late",
        description:
          "Studies show responding within 5 minutes multiplies conversion — but without reminders, most leads hear back days later, if at all.",
      },
      {
        icon: "users",
        title: "Zero visibility on the team",
        description:
          "You can't see who called which lead, what was promised, or why a deal went cold — until the month's numbers disappoint.",
      },
      {
        icon: "alert-triangle",
        title: "Leads walk out with salespeople",
        description:
          "When a salesperson leaves, their diary and phone contacts leave too. Your hard-earned pipeline belongs to them, not your business.",
      },
    ],
    features: [
      {
        icon: "filter",
        title: "Auto Lead Capture",
        description:
          "Facebook, Google, IndiaMART, website forms, and missed calls flow into one inbox automatically — no copy-pasting from anywhere.",
      },
      {
        icon: "workflow",
        title: "Pipeline Management",
        description:
          "Drag deals across stages on a visual Kanban pipeline. See exactly how much business sits at each stage, at all times.",
      },
      {
        icon: "users",
        title: "Contact Management",
        description:
          "Every customer's calls, WhatsApp chats, quotes, and notes in one timeline — full history at a glance before every conversation.",
      },
      {
        icon: "zap",
        title: "Task Automation",
        description:
          "New leads auto-assign by source or territory, follow-up tasks create themselves, and idle leads escalate to managers.",
      },
      {
        icon: "mail",
        title: "Email Integration",
        description:
          "Send quotes and proposals from the CRM with templates. Opens and replies log against the lead automatically.",
      },
      {
        icon: "message-circle",
        title: "WhatsApp Integration",
        description:
          "Send brochures, quotes, and follow-ups on WhatsApp directly from the lead card — every message saved to the timeline.",
      },
      {
        icon: "bar-chart",
        title: "Reports Dashboard",
        description:
          "Conversion funnel, lead-source ROI, lost-reason analysis, and sales forecasts — live, not at month-end.",
      },
      {
        icon: "user-check",
        title: "Team Management",
        description:
          "Targets, call counts, and closures per salesperson. Leaderboards keep the team competitive and accountable.",
      },
      {
        icon: "smartphone",
        title: "Mobile CRM",
        description:
          "Your team updates leads, logs calls, and checks tasks from the field. Works on any Android or iPhone.",
      },
    ],
    modules: [
      {
        name: "Lead Inbox",
        description:
          "All sources in one queue with duplicate detection and source tagging.",
      },
      {
        name: "Deal Pipeline",
        description:
          "Customizable stages, Kanban view, deal value, and expected close dates.",
      },
      {
        name: "Contact & Account Manager",
        description:
          "Companies, contacts, and complete interaction timelines.",
      },
      {
        name: "Follow-up & Task Engine",
        description:
          "Auto-created tasks, reminders, and overdue escalations to managers.",
      },
      {
        name: "WhatsApp & Email Messaging",
        description:
          "Template-based messaging from inside the lead card with full logging.",
      },
      {
        name: "Quotation Builder",
        description:
          "Branded quotes generated from the deal and sent in one click.",
      },
      {
        name: "Sales Reports & Forecasts",
        description:
          "Funnel, source ROI, team performance, and pipeline forecast reports.",
      },
      {
        name: "Territory & Assignment Rules",
        description:
          "Round-robin or rule-based lead routing by area, product, or source.",
      },
      {
        name: "Mobile App",
        description:
          "Field-ready app with call logging, check-ins, and offline notes.",
      },
      {
        name: "Roles & Data Security",
        description:
          "Role-based access so salespeople see only their own leads.",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/crm-pipeline.png",
        alt: "Visual sales pipeline with deal cards",
        caption: "Drag-and-drop pipeline — every deal, every stage",
      },
      {
        src: "/screenshots/crm-lead.png",
        alt: "Lead timeline with WhatsApp messages",
        caption: "Full lead timeline with WhatsApp built in",
      },
      {
        src: "/screenshots/crm-reports.png",
        alt: "Sales performance dashboard",
        caption: "Team performance and source ROI, live",
      },
    ],
    benefits: [
      {
        before: "Leads noted in diaries and personal phones",
        after: "Every enquiry captured automatically in one system",
      },
      {
        before: "Follow-ups depend on memory",
        after: "Auto-reminders ensure no lead waits more than a day",
      },
      {
        before: "No idea why deals are lost",
        after: "Lost-reason reports show exactly where to improve",
      },
      {
        before: "Pipeline leaves with departing salespeople",
        after: "All leads and history stay with your business",
      },
      {
        before: "Month-end surprises on sales numbers",
        after: "Live dashboard shows pipeline and forecast daily",
      },
    ],
    pricing: [
      {
        name: "Starter",
        priceMonthly: 699,
        priceAnnual: 559,
        description: "For small teams organizing their first pipeline.",
        features: [
          "Up to 3 users",
          "1,000 leads/month",
          "Visual pipeline & tasks",
          "Mobile app",
          "Email support",
        ],
        ctaLabel: "Start with Starter",
      },
      {
        name: "Professional",
        priceMonthly: 1499,
        priceAnnual: 1199,
        description: "For sales teams that live on follow-ups.",
        features: [
          "Up to 10 users",
          "Unlimited leads",
          "Auto lead capture (FB, Google, IndiaMART)",
          "WhatsApp integration",
          "Quotation builder",
          "Team reports & leaderboards",
          "Priority support",
        ],
        recommended: true,
        ctaLabel: "Get Professional",
      },
      {
        name: "Enterprise",
        priceMonthly: 2999,
        priceAnnual: 2399,
        description: "For multi-team, multi-branch sales operations.",
        features: [
          "Unlimited users",
          "Territory & routing rules",
          "Custom fields & workflows",
          "API access & integrations",
          "Advanced forecasting",
          "Dedicated account manager",
        ],
        ctaLabel: "Talk to Sales",
      },
    ],
    faqs: [
      {
        question: "Which lead sources can be connected?",
        answer:
          "Facebook Lead Ads, Google Ads, IndiaMART, JustDial, your website forms, and missed-call numbers connect natively. Anything else can push leads via our API or email parser.",
      },
      {
        question: "How does WhatsApp work inside the CRM?",
        answer:
          "You can send templates, brochures, and quotes from the lead card using the WhatsApp Business API. Incoming replies attach to the same lead, so the whole conversation lives in one timeline.",
      },
      {
        question: "Can I control what my salespeople see?",
        answer:
          "Yes. Role-based access means each salesperson sees only their own leads, managers see their team, and admins see everything. Export rights can be restricted too.",
      },
      {
        question: "Will my team actually use it?",
        answer:
          "The mobile app is built for field salespeople — logging a call takes two taps. Most teams are fully active within the first week because managers review the CRM, not WhatsApp groups.",
      },
      {
        question: "Can I import my existing leads from Excel?",
        answer:
          "Yes. Upload your Excel sheet and map columns once — leads, contacts, and even past notes import with duplicate checking.",
      },
      {
        question: "Does it work for service businesses, not just sales?",
        answer:
          "Yes. Pipelines are fully customizable, so you can track service requests, site visits, or AMC renewals the same way you track deals.",
      },
      {
        question: "What reports do managers get?",
        answer:
          "Daily activity reports, conversion funnel, lead-source ROI, lost-reason analysis, and a live pipeline forecast — on dashboard, email, or WhatsApp summary.",
      },
      {
        question: "Is there a minimum contract?",
        answer:
          "No lock-in on monthly plans. Annual billing saves around 20% and most customers switch to it after the first couple of months.",
      },
      {
        question: "Can it integrate with my accounting software?",
        answer:
          "Won deals can push customer and order details to CreativeDox Accounting or Tally, so billing starts without re-entry.",
      },
      {
        question: "How fast can we go live?",
        answer:
          "Same week. We import your leads, connect your sources, and train your team — most businesses run their first full pipeline review within 7 days.",
      },
    ],
    integrations: [
      "WhatsApp Business API",
      "Facebook Lead Ads",
      "Google Ads",
      "IndiaMART",
      "Google Workspace",
      "Payment Gateways",
      "Tally",
    ],
    relatedProducts: [
      "whatsapp-automation",
      "marketing-automation",
      "accounting-inventory",
    ],
  },

  /* ---------------------------------------------------------------- */
  /*  Accounting & Inventory                                           */
  /* ---------------------------------------------------------------- */
  {
    slug: "accounting-inventory",
    productId: "accounting",
    name: "CreativeDox Accounting",
    tagline: "GST billing & stock control your CA will love",
    heroDescription:
      "GST-compliant invoices, e-way bills, multi-godown inventory, and GSTR-ready reports — with Tally import/export so your CA's workflow never breaks.",
    metaTitle: "GST Accounting & Inventory Software for Indian Businesses",
    metaDescription:
      "GST billing software with inventory — e-invoices, e-way bills, barcode POS, multi-godown stock, GSTR-1/3B reports, and Tally sync. From ₹599/month.",
    color: "text-amber-400",
    hex: "#fbbf24",
    gradient: "from-amber-500 to-orange-600",
    painPointsHeading: "Billing in one place, stock in another, GST in a third?",
    painPoints: [
      {
        icon: "alert-triangle",
        title: "GST filing is a monthly scramble",
        description:
          "Invoices in one system, purchases in another — your CA spends days reconciling before GSTR-1 and 3B can be filed.",
      },
      {
        icon: "boxes",
        title: "Stock numbers are never right",
        description:
          "Physical stock never matches the register. Dead stock piles up while fast movers run out at the worst time.",
      },
      {
        icon: "indian-rupee",
        title: "Money stuck in receivables",
        description:
          "Without ageing reports and reminders, customers pay when they feel like it — and you find out about overdue bills too late.",
      },
      {
        icon: "file-text",
        title: "Billing errors cost real money",
        description:
          "Wrong tax rates, missed HSN codes, and manual calculation slips trigger notices and eat margins invoice by invoice.",
      },
    ],
    features: [
      {
        icon: "receipt-text",
        title: "GST Invoicing",
        description:
          "Professional invoices with correct HSN/SAC codes and tax rates. E-invoice and e-way bill generation built in.",
      },
      {
        icon: "boxes",
        title: "Multi-godown Inventory",
        description:
          "Live stock across warehouses with transfers, batch/expiry tracking, and low-stock alerts before you run out.",
      },
      {
        icon: "scan-line",
        title: "Barcode Billing & POS",
        description:
          "Fast counter billing with barcode scanning, thermal printer support, and cash/UPI/card settlement tracking.",
      },
      {
        icon: "file-text",
        title: "GSTR-Ready Reports",
        description:
          "GSTR-1, GSTR-3B, and HSN summary export in the exact format your CA needs — filing prep drops from days to minutes.",
      },
      {
        icon: "wallet",
        title: "Receivables & Payables",
        description:
          "Party-wise outstanding, ageing buckets, and automatic WhatsApp payment reminders that actually get bills paid.",
      },
      {
        icon: "repeat",
        title: "Tally Import / Export",
        description:
          "Two-way Tally sync keeps your CA's existing workflow intact — no double entry, no migration drama.",
      },
      {
        icon: "bar-chart",
        title: "Financial Reports",
        description:
          "P&L, balance sheet, day book, cash flow, and stock valuation — live, not after month-end closing.",
      },
      {
        icon: "smartphone",
        title: "Mobile Billing App",
        description:
          "Create invoices, check stock, and view outstanding from your phone — for owners who aren't at the counter.",
      },
      {
        icon: "users",
        title: "Multi-user with Roles",
        description:
          "Cashiers bill, accountants reconcile, owners see everything. Every entry carries a user trail.",
      },
    ],
    modules: [
      {
        name: "Sales & Invoicing",
        description:
          "Invoices, quotations, delivery challans, credit notes, and e-invoices.",
      },
      {
        name: "Purchase Management",
        description:
          "Purchase orders, GRNs, bills, and supplier outstanding tracking.",
      },
      {
        name: "Inventory Control",
        description:
          "Multi-godown stock, transfers, batch/expiry, and stock adjustment audits.",
      },
      {
        name: "POS & Barcode",
        description:
          "Counter billing with barcode scan, holds, and day-end cash summary.",
      },
      {
        name: "GST & Compliance",
        description:
          "GSTR-1/3B reports, HSN summary, e-way bills, and TDS/TCS handling.",
      },
      {
        name: "Receivables & Payables",
        description: "Ageing, payment reminders, and receipt/payment entries.",
      },
      {
        name: "Banking & Reconciliation",
        description:
          "Bank entries, cheque tracking, and statement reconciliation.",
      },
      {
        name: "Financial Reports",
        description:
          "P&L, balance sheet, trial balance, cash flow, and stock valuation.",
      },
      {
        name: "Expense & Petty Cash",
        description:
          "Expense categories, petty cash book, and recurring expense entries.",
      },
      {
        name: "Users, Roles & Audit",
        description:
          "Role-based access with edit logs and a complete user-wise audit trail.",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/accounting-invoice.png",
        alt: "GST invoice creation screen",
        caption: "GST invoice with HSN lookup in seconds",
      },
      {
        src: "/screenshots/accounting-stock.png",
        alt: "Multi-godown stock dashboard",
        caption: "Live stock across every godown",
      },
      {
        src: "/screenshots/accounting-gstr.png",
        alt: "GSTR-1 report export",
        caption: "GSTR-1/3B ready for filing",
      },
    ],
    benefits: [
      {
        before: "Days of reconciliation before every GST filing",
        after: "GSTR-1/3B reports export-ready in minutes",
      },
      {
        before: "Stock register never matches the shelf",
        after: "Live multi-godown stock with audit trail",
      },
      {
        before: "Overdue payments discovered months later",
        after: "Ageing dashboard + automatic WhatsApp reminders",
      },
      {
        before: "CA needs data re-entered into Tally",
        after: "Two-way Tally sync, zero double entry",
      },
      {
        before: "Billing stops when you're away from the shop",
        after: "Invoice and check stock from the mobile app",
      },
    ],
    pricing: [
      {
        name: "Starter",
        priceMonthly: 599,
        priceAnnual: 479,
        description: "For shops and traders starting digital billing.",
        features: [
          "Single user, single godown",
          "GST invoicing & quotations",
          "Basic inventory",
          "GSTR-1/3B reports",
          "Email support",
        ],
        ctaLabel: "Start with Starter",
      },
      {
        name: "Professional",
        priceMonthly: 1299,
        priceAnnual: 1039,
        description: "For growing businesses with stock and credit cycles.",
        features: [
          "Up to 5 users",
          "Multi-godown inventory",
          "Barcode POS billing",
          "E-way bill & e-invoice",
          "WhatsApp payment reminders",
          "Tally import/export",
          "Priority support",
        ],
        recommended: true,
        ctaLabel: "Get Professional",
      },
      {
        name: "Enterprise",
        priceMonthly: 2499,
        priceAnnual: 1999,
        description: "For multi-branch trading and distribution.",
        features: [
          "Unlimited users & branches",
          "Branch-wise P&L",
          "Batch/expiry & serial tracking",
          "API access",
          "Custom report builder",
          "Dedicated account manager",
        ],
        ctaLabel: "Talk to Sales",
      },
    ],
    faqs: [
      {
        question: "Is it GST compliant?",
        answer:
          "Fully. Invoices follow the GST format with HSN/SAC codes, e-invoicing and e-way bills are built in, and GSTR-1/3B reports export in the format your CA or filing portal expects.",
      },
      {
        question: "Can my CA keep working in Tally?",
        answer:
          "Yes. Two-way Tally import/export means you bill and manage stock here while your CA continues in Tally — no double entry on either side.",
      },
      {
        question: "Does it support barcode billing?",
        answer:
          "Yes. The POS screen supports barcode scanners, thermal printers, item-wise discounts, and cash/UPI/card settlement with a day-end summary.",
      },
      {
        question: "Can I track stock across multiple godowns?",
        answer:
          "Yes. Stock is tracked godown-wise with transfer entries, batch and expiry support, and alerts when any item drops below its reorder level.",
      },
      {
        question: "How do payment reminders work?",
        answer:
          "The system tracks party-wise outstanding with ageing buckets and can send polite WhatsApp/SMS reminders automatically on a schedule you set.",
      },
      {
        question: "Can I migrate from my existing software?",
        answer:
          "Yes. We import masters, opening balances, stock, and outstanding from Excel or Tally as part of free onboarding.",
      },
      {
        question: "Does it work offline?",
        answer:
          "Billing continues during internet outages on the desktop app and syncs to the cloud once you're back online.",
      },
      {
        question: "Is my financial data safe?",
        answer:
          "Data lives on Indian cloud servers with daily automated backups, encryption in transit, and role-based access you control.",
      },
      {
        question: "Can I print invoices in my own format?",
        answer:
          "Yes. Invoice templates support your logo, colors, custom fields, and terms — and print on A4, A5, or thermal paper sizes for counter billing.",
      },
      {
        question: "Can I manage multiple firms or financial years?",
        answer:
          "Yes. You can run multiple companies under one login and switch between unlimited financial years, with year-end closing handled automatically.",
      },
    ],
    integrations: [
      "Tally",
      "E-invoice (IRP)",
      "E-way Bill Portal",
      "WhatsApp",
      "Barcode Scanners",
      "Thermal Printers",
      "Payment Gateways",
    ],
    relatedProducts: ["erp-solutions", "crm-software", "attendance-management"],
  },

  /* ---------------------------------------------------------------- */
  /*  WhatsApp Automation                                              */
  /* ---------------------------------------------------------------- */
  {
    slug: "whatsapp-automation",
    productId: "whatsapp",
    name: "CreativeDox WhatsApp",
    tagline: "Campaigns, chatbots & team inbox on the official API",
    heroDescription:
      "Send personalized broadcasts to thousands, answer instantly with no-code chatbots, and manage every customer chat in one shared team inbox — all on the official WhatsApp Business API.",
    metaTitle: "WhatsApp Business API — Broadcasts, Chatbots & Team Inbox",
    metaDescription:
      "WhatsApp automation on the official Business API — bulk personalized broadcasts, no-code chatbots, shared team inbox, and delivery analytics. From ₹999/month.",
    color: "text-green-400",
    hex: "#25d366",
    gradient: "from-[#25d366] to-green-600",
    painPointsHeading: "Running your business on a personal WhatsApp number?",
    painPoints: [
      {
        icon: "alert-triangle",
        title: "One ban away from disaster",
        description:
          "Bulk forwards from a normal WhatsApp number get it blocked — taking years of customer chats down with it.",
      },
      {
        icon: "clock",
        title: "Customers wait hours for replies",
        description:
          "Enquiries arrive at all hours, but answers come only when someone checks the phone. By then, the customer has bought elsewhere.",
      },
      {
        icon: "users",
        title: "One phone, whole team blind",
        description:
          "The business number lives on one device. Nobody else can see chats, and conversations vanish when that person is away.",
      },
      {
        icon: "bar-chart",
        title: "No idea what's working",
        description:
          "You broadcast offers but can't see deliveries, reads, or replies — so every campaign is a shot in the dark.",
      },
    ],
    features: [
      {
        icon: "shield-check",
        title: "Official Business API",
        description:
          "Verified green-tick eligible account on Meta's official API — no bans, no third-party hacks, fully compliant.",
      },
      {
        icon: "send",
        title: "Bulk Personalized Broadcasts",
        description:
          "Send approved template messages to thousands with names, amounts, and dates merged per customer.",
      },
      {
        icon: "bot",
        title: "No-code Chatbot Builder",
        description:
          "Drag-and-drop flows answer FAQs, qualify leads, and collect orders 24×7 — handing off to humans when needed.",
      },
      {
        icon: "inbox",
        title: "Shared Team Inbox",
        description:
          "Your whole team answers from one number with assignment, internal notes, and labels — on web and mobile.",
      },
      {
        icon: "bar-chart",
        title: "Campaign Analytics",
        description:
          "Delivered, read, replied, and clicked — per campaign and per agent, so you double down on what works.",
      },
      {
        icon: "zap",
        title: "Automated Notifications",
        description:
          "Order confirmations, payment reminders, and delivery updates trigger automatically from your systems via API.",
      },
      {
        icon: "list-checks",
        title: "Catalogs & Quick Replies",
        description:
          "Share product catalogs, list messages, and button replies that make buying on WhatsApp effortless.",
      },
      {
        icon: "users",
        title: "Contact Segmentation",
        description:
          "Tag and segment audiences by behavior, purchase history, or source — send relevant offers, not spam.",
      },
      {
        icon: "plug",
        title: "CRM & API Integrations",
        description:
          "Connects natively with CreativeDox CRM and to anything else through REST APIs and webhooks.",
      },
    ],
    modules: [
      {
        name: "Broadcast Campaigns",
        description:
          "Template management, audience selection, scheduling, and retries.",
      },
      {
        name: "Chatbot Studio",
        description:
          "Visual flow builder with conditions, forms, and human handoff.",
      },
      {
        name: "Team Inbox",
        description:
          "Multi-agent inbox with assignment, notes, labels, and SLAs.",
      },
      {
        name: "Contacts & Segments",
        description: "Tags, custom attributes, and behavior-based segments.",
      },
      {
        name: "Automation & Triggers",
        description:
          "API/webhook-triggered notifications and drip sequences.",
      },
      {
        name: "Commerce Tools",
        description: "Catalogs, carts, list messages, and payment links.",
      },
      {
        name: "Analytics & Reports",
        description:
          "Campaign funnels, agent response times, and conversation volumes.",
      },
      {
        name: "Number & Template Manager",
        description:
          "Green-tick application help, template approvals, and quality monitoring.",
      },
      {
        name: "Opt-in & Consent Manager",
        description:
          "Collect, track, and honor opt-ins/opt-outs to protect your quality rating.",
      },
      {
        name: "WhatsApp Forms & Flows",
        description:
          "Native in-chat forms for bookings, feedback, and lead qualification.",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/whatsapp-campaign.png",
        alt: "Broadcast campaign builder",
        caption: "Personalized broadcast to thousands in minutes",
      },
      {
        src: "/screenshots/whatsapp-bot.png",
        alt: "Drag-and-drop chatbot flow builder",
        caption: "No-code chatbot flows for instant replies",
      },
      {
        src: "/screenshots/whatsapp-inbox.png",
        alt: "Shared team inbox",
        caption: "Whole team on one number, fully visible",
      },
    ],
    benefits: [
      {
        before: "Risky bulk forwards from a personal number",
        after: "Compliant broadcasts on the official API",
      },
      {
        before: "Enquiries answered hours later",
        after: "Chatbot replies in seconds, 24×7",
      },
      {
        before: "Chats locked inside one employee's phone",
        after: "Shared inbox with full team visibility",
      },
      {
        before: "Campaigns with zero measurement",
        after: "Delivery, read, and reply analytics per campaign",
      },
      {
        before: "Offers blasted blindly to the full list",
        after: "Segmented sends that protect your quality score",
      },
    ],
    pricing: [
      {
        name: "Starter",
        priceMonthly: 999,
        priceAnnual: 799,
        description: "For businesses moving to the official API.",
        features: [
          "Official API setup",
          "2 agent seats",
          "Broadcasts up to 5,000/month",
          "Basic chatbot (FAQ flows)",
          "Email support",
        ],
        ctaLabel: "Start with Starter",
      },
      {
        name: "Professional",
        priceMonthly: 1999,
        priceAnnual: 1599,
        description: "For teams running campaigns every week.",
        features: [
          "5 agent seats",
          "Unlimited broadcasts*",
          "Full chatbot studio",
          "Segments & drip sequences",
          "Campaign analytics",
          "CRM integration",
          "Priority support",
        ],
        recommended: true,
        ctaLabel: "Get Professional",
      },
      {
        name: "Enterprise",
        priceMonthly: 3999,
        priceAnnual: 3199,
        description: "For high-volume, multi-team operations.",
        features: [
          "Unlimited agent seats",
          "Multiple numbers",
          "API & webhook automation",
          "Custom chatbot development",
          "SLA reports & audit logs",
          "Dedicated account manager",
        ],
        ctaLabel: "Talk to Sales",
      },
    ],
    faqs: [
      {
        question: "Is this the official WhatsApp Business API?",
        answer:
          "Yes — we provision your number on Meta's official Business API. That means no risk of bans for bulk messaging, plus eligibility for the verified green tick.",
      },
      {
        question: "What do WhatsApp conversation charges cost?",
        answer:
          "Meta charges per 24-hour conversation, billed at actuals on top of your plan. Marketing, utility, and service conversations have different rates — we show a live cost dashboard so there are no surprises.",
      },
      {
        question: "Can I use my existing WhatsApp number?",
        answer:
          "Yes, your current business number can be migrated to the API. Note that API numbers use our inbox instead of the regular WhatsApp app — we guide you through the switch.",
      },
      {
        question: "How fast are broadcast messages delivered?",
        answer:
          "Thousands of messages go out within minutes. Delivery speed scales with your number's quality rating, which our dashboard helps you protect.",
      },
      {
        question: "Can the chatbot hand over to a human?",
        answer:
          "Yes. Flows can transfer to a live agent on any trigger — a keyword, a failed answer, or a button press — with full conversation context.",
      },
      {
        question: "Do message templates need approval?",
        answer:
          "Yes, Meta approves templates before use — usually within minutes to a few hours. We provide pre-approved template libraries for common use cases to get you started fast.",
      },
      {
        question: "Can it send automatic order and payment updates?",
        answer:
          "Yes. Connect your billing or e-commerce system via API/webhooks and notifications like order confirmed, payment received, or out for delivery go out automatically.",
      },
      {
        question: "How do I avoid getting marked as spam?",
        answer:
          "Send only to opted-in contacts, use segments for relevance, and watch the quality score in your dashboard. We alert you before quality issues become blocking issues.",
      },
      {
        question: "Can I get the verified green tick?",
        answer:
          "We assist with Meta's verification process as part of onboarding. Approval depends on Meta's criteria — an established business presence and website help — but API access and all features work even without the badge.",
      },
      {
        question: "Can multiple team members reply from the same number?",
        answer:
          "Yes — that's exactly what the team inbox is for. Any number of agents (per your plan) work the same number simultaneously, with chats assigned so two people never answer the same customer.",
      },
    ],
    integrations: [
      "CreativeDox CRM",
      "Facebook Lead Ads",
      "Shopify / WooCommerce",
      "Payment Gateways",
      "Google Sheets",
      "REST API & Webhooks",
    ],
    relatedProducts: [
      "crm-software",
      "marketing-automation",
      "accounting-inventory",
    ],
  },

  /* ---------------------------------------------------------------- */
  /*  Marketing Automation                                             */
  /* ---------------------------------------------------------------- */
  {
    slug: "marketing-automation",
    productId: "marketing",
    name: "CreativeDox Marketing",
    tagline: "WhatsApp, SMS & email journeys that actually convert",
    heroDescription:
      "Run coordinated campaigns across WhatsApp, SMS, and email from one dashboard — with landing pages, behavior-based lead scoring, and ROI you can finally see.",
    metaTitle: "Marketing Automation — WhatsApp, SMS & Email Campaigns",
    metaDescription:
      "Multi-channel marketing automation for Indian businesses — WhatsApp, SMS, and email journeys, landing page builder, lead scoring, and ROI analytics. From ₹799/month.",
    color: "text-purple-400",
    hex: "#a78bfa",
    gradient: "from-purple-500 to-violet-600",
    painPointsHeading: "Spending on marketing but can't see what returns?",
    painPoints: [
      {
        icon: "indian-rupee",
        title: "Ad spend with invisible ROI",
        description:
          "Money goes into ads and bulk SMS every month, but nobody can say which campaign actually produced paying customers.",
      },
      {
        icon: "clock",
        title: "Leads go cold without nurturing",
        description:
          "Most prospects aren't ready to buy today. Without automated follow-up journeys, they forget you by the time they are.",
      },
      {
        icon: "layers",
        title: "Channels working in silos",
        description:
          "WhatsApp from one tool, email from another, SMS from a third — no shared audience, no coordinated story.",
      },
      {
        icon: "target",
        title: "Same message blasted to everyone",
        description:
          "New leads, old customers, and dead enquiries all get the same broadcast — so engagement keeps falling.",
      },
    ],
    features: [
      {
        icon: "workflow",
        title: "Multi-channel Journeys",
        description:
          "Visual journey builder sequences WhatsApp, SMS, and email together — day 1 welcome, day 3 offer, day 7 nudge.",
      },
      {
        icon: "target",
        title: "Behavior-based Lead Scoring",
        description:
          "Opens, clicks, replies, and page visits raise a lead's score — sales gets alerted the moment someone turns hot.",
      },
      {
        icon: "globe",
        title: "Landing Page & Form Builder",
        description:
          "Launch campaign landing pages and lead forms in minutes with drag-and-drop blocks — no developer needed.",
      },
      {
        icon: "users",
        title: "Audience Segmentation",
        description:
          "Segment by source, behavior, purchase history, or custom fields — every message lands on the right list.",
      },
      {
        icon: "bar-chart",
        title: "Campaign ROI Analytics",
        description:
          "Track every campaign from send to sale. See cost, conversions, and revenue per channel in one report.",
      },
      {
        icon: "zap",
        title: "Trigger Automations",
        description:
          "Form fills, link clicks, and purchases trigger instant follow-ups — strike while interest is hottest.",
      },
      {
        icon: "mail",
        title: "Email Campaigns",
        description:
          "Branded email blasts and drips with templates, A/B subject testing, and open/click tracking.",
      },
      {
        icon: "message-circle",
        title: "WhatsApp & SMS Native",
        description:
          "Official WhatsApp API and DLT-compliant SMS built in — no juggling separate vendors.",
      },
      {
        icon: "repeat",
        title: "Re-engagement Campaigns",
        description:
          "Automatically win back inactive customers and revive cold leads with scheduled reactivation journeys.",
      },
    ],
    modules: [
      {
        name: "Journey Builder",
        description:
          "Drag-and-drop multi-step, multi-channel automation flows.",
      },
      {
        name: "Campaign Manager",
        description:
          "One-off broadcasts across WhatsApp, SMS, and email with scheduling.",
      },
      {
        name: "Landing Pages & Forms",
        description:
          "Block-based builder with templates, custom domains, and lead capture.",
      },
      {
        name: "Lead Scoring Engine",
        description:
          "Configurable scoring rules with hot-lead alerts to sales.",
      },
      {
        name: "Segments & Lists",
        description:
          "Dynamic segments that update as behavior and attributes change.",
      },
      {
        name: "ROI & Attribution Reports",
        description:
          "Channel-wise cost, conversion, and revenue attribution.",
      },
      {
        name: "Template Library",
        description:
          "Ready-made WhatsApp, SMS, and email templates by industry.",
      },
      {
        name: "Integrations Hub",
        description: "CRM sync, webhooks, and pixel/UTM tracking.",
      },
      {
        name: "A/B Testing",
        description:
          "Test subject lines, creatives, and send times; winners send automatically.",
      },
      {
        name: "Report Scheduler & Alerts",
        description:
          "Weekly performance emails and KPI alerts when campaigns over/under-perform.",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/marketing-journey.png",
        alt: "Visual journey builder",
        caption: "Multi-channel journeys on one canvas",
      },
      {
        src: "/screenshots/marketing-landing.png",
        alt: "Landing page builder",
        caption: "Campaign landing pages in minutes",
      },
      {
        src: "/screenshots/marketing-roi.png",
        alt: "Campaign ROI dashboard",
        caption: "Cost-to-revenue ROI per campaign",
      },
    ],
    benefits: [
      {
        before: "No idea which campaigns make money",
        after: "Revenue attribution per campaign and channel",
      },
      {
        before: "Leads contacted once, then forgotten",
        after: "Automated journeys nurture every lead for weeks",
      },
      {
        before: "Three separate tools for three channels",
        after: "WhatsApp, SMS & email from one dashboard",
      },
      {
        before: "Generic blasts to the whole database",
        after: "Segmented, behavior-targeted messaging",
      },
      {
        before: "Campaign decisions based on gut feel",
        after: "A/B-tested sends that improve every cycle",
      },
    ],
    pricing: [
      {
        name: "Starter",
        priceMonthly: 799,
        priceAnnual: 639,
        description: "For businesses starting structured campaigns.",
        features: [
          "5,000 contacts",
          "Email + SMS campaigns",
          "3 landing pages",
          "Basic segments",
          "Email support",
        ],
        ctaLabel: "Start with Starter",
      },
      {
        name: "Professional",
        priceMonthly: 1699,
        priceAnnual: 1359,
        description: "For marketers running always-on journeys.",
        features: [
          "25,000 contacts",
          "WhatsApp API channel",
          "Journey builder & triggers",
          "Lead scoring + hot-lead alerts",
          "Unlimited landing pages",
          "ROI attribution reports",
          "Priority support",
        ],
        recommended: true,
        ctaLabel: "Get Professional",
      },
      {
        name: "Enterprise",
        priceMonthly: 3499,
        priceAnnual: 2799,
        description: "For high-volume, multi-brand marketing teams.",
        features: [
          "Unlimited contacts",
          "Multi-brand workspaces",
          "API & custom integrations",
          "Custom attribution models",
          "Campaign strategy support",
          "Dedicated account manager",
        ],
        ctaLabel: "Talk to Sales",
      },
    ],
    faqs: [
      {
        question: "Which channels are supported?",
        answer:
          "WhatsApp (official Business API), SMS (DLT-compliant Indian routes), and email — all sendable from one journey, one audience, one report.",
      },
      {
        question: "Are message/SMS costs included in the plan?",
        answer:
          "Plans include the platform; WhatsApp conversation charges and SMS credits are billed at transparent actuals. Email sending is included up to your contact limit.",
      },
      {
        question: "How does lead scoring help my sales team?",
        answer:
          "Every open, click, reply, and page visit adds points. When a lead crosses your threshold, sales gets an instant alert with the full activity history — so they call hot leads first.",
      },
      {
        question: "Do I need a developer for landing pages?",
        answer:
          "No. The drag-and-drop builder includes templates, mobile-responsive blocks, and form widgets. Connect your own domain in a few clicks.",
      },
      {
        question: "Can it sync with my CRM?",
        answer:
          "CreativeDox CRM syncs natively — leads, scores, and campaign history flow both ways. Other CRMs connect via API and webhooks.",
      },
      {
        question: "Is SMS DLT-compliant?",
        answer:
          "Yes. We help register your headers and templates on the DLT portal, and the platform only sends through compliant approved routes.",
      },
      {
        question: "How is ROI actually calculated?",
        answer:
          "UTM and pixel tracking tie form fills and purchases back to the originating campaign. The report shows spend, leads, conversions, and revenue per campaign.",
      },
      {
        question: "Can you help us plan campaigns?",
        answer:
          "Professional plans include onboarding with ready journey templates; Enterprise includes quarterly campaign strategy sessions with our team.",
      },
      {
        question: "Can new leads enter a drip sequence automatically?",
        answer:
          "Yes. A form fill, ad lead, or CRM entry can trigger a journey instantly — welcome message in minutes, follow-ups on your schedule, and an automatic stop the moment they convert.",
      },
      {
        question: "Does it show which ads bring paying customers?",
        answer:
          "Yes. UTM and pixel tracking follow each lead from first click to final payment, so the ROI report shows revenue against every ad campaign — not just clicks and leads.",
      },
    ],
    integrations: [
      "WhatsApp Business API",
      "DLT SMS Gateways",
      "CreativeDox CRM",
      "Facebook & Google Ads",
      "Google Analytics",
      "Payment Gateways",
      "REST API & Webhooks",
    ],
    relatedProducts: ["whatsapp-automation", "crm-software", "erp-solutions"],
  },

  /* ---------------------------------------------------------------- */
  /*  Cable TV Management                                              */
  /* ---------------------------------------------------------------- */
  {
    slug: "cable-tv-management",
    productId: "cable-tv",
    name: "CreativeDox Cable TV",
    tagline: "Subscriber billing & field collections, live",
    heroDescription:
      "Manage subscribers, set-top boxes, packages, and monthly billing in one app — while agents mark collections in the field and your dues update area by area, in real time.",
    metaTitle: "Cable TV Management Software — Billing & Collections",
    metaDescription:
      "Cable TV operator software — subscriber & STB management, auto monthly billing, agent-wise field collections, and WhatsApp due reminders. From ₹599/month.",
    color: "text-cyan-400",
    hex: "#22d3ee",
    gradient: "from-cyan-500 to-sky-600",
    painPointsHeading: "Still running collections on diaries and trust?",
    painPoints: [
      {
        icon: "file-text",
        title: "Dues live in agents' diaries",
        description:
          "Who paid, who didn't, and how much is pending exists only in field diaries — you learn the truth weeks later, if ever.",
      },
      {
        icon: "indian-rupee",
        title: "Collection leakage every month",
        description:
          "Cash collected but not deposited, customers marked paid without receipts — small leaks add up to serious money.",
      },
      {
        icon: "tv",
        title: "STB inventory chaos",
        description:
          "Boxes issued, replaced, and returned with no proper record — until recovery time, when nobody knows where they went.",
      },
      {
        icon: "clock",
        title: "Manual billing eats your month",
        description:
          "Generating bills for thousands of subscribers by hand means errors, missed renewals, and revenue left on the table.",
      },
    ],
    features: [
      {
        icon: "users",
        title: "Subscriber Management",
        description:
          "Complete subscriber records — connection details, packages, STB info, and payment history — searchable in seconds.",
      },
      {
        icon: "tv",
        title: "STB & Inventory Tracking",
        description:
          "Track every set-top box from purchase to issue, replacement, and return — with serial-number history.",
      },
      {
        icon: "receipt-text",
        title: "Auto Monthly Billing",
        description:
          "Bills generate automatically by package on the 1st — pro-rated for mid-month activations and plan changes.",
      },
      {
        icon: "map-pin",
        title: "Agent Collection App",
        description:
          "Agents see their area's dues, collect, and issue digital receipts on the spot — every rupee tracked to the agent.",
      },
      {
        icon: "message-circle",
        title: "WhatsApp Due Reminders",
        description:
          "Automatic payment reminders and receipts on WhatsApp cut door-knocking and improve on-time collection.",
      },
      {
        icon: "bar-chart",
        title: "Area-wise Dashboards",
        description:
          "Collections, dues, and disconnections by area and agent — know exactly where revenue is stuck.",
      },
      {
        icon: "credit-card",
        title: "Online Payments",
        description:
          "Subscribers pay via UPI/payment links; entries post automatically with instant receipts.",
      },
      {
        icon: "wallet",
        title: "Expense & Profit Tracking",
        description:
          "Track broadcaster payments, salaries, and expenses against collections for true area-wise profitability.",
      },
      {
        icon: "settings",
        title: "Package & Plan Manager",
        description:
          "Create packages, bouquets, and pricing tiers; plan changes apply to billing automatically.",
      },
    ],
    modules: [
      {
        name: "Subscriber Registry",
        description:
          "Profiles, addresses, areas, connection status, and history.",
      },
      {
        name: "Billing Engine",
        description:
          "Auto monthly invoicing, pro-rating, and adjustment entries.",
      },
      {
        name: "Collections & Receipts",
        description:
          "Field app collections, digital receipts, and deposit reconciliation.",
      },
      {
        name: "STB Inventory",
        description: "Serial-wise stock, issue/return, and repair tracking.",
      },
      {
        name: "Reminders & Notifications",
        description: "WhatsApp/SMS dues, receipts, and disconnection notices.",
      },
      {
        name: "Area & Agent Management",
        description:
          "Territory mapping, agent targets, and commission reports.",
      },
      {
        name: "Online Payment Portal",
        description: "UPI/payment-link collections with auto-posting.",
      },
      {
        name: "Reports & MIS",
        description:
          "Collection summary, outstanding ageing, and profitability reports.",
      },
      {
        name: "Complaints & Service Requests",
        description:
          "Log, assign, and close complaints with turnaround-time tracking.",
      },
      {
        name: "Broadcaster & Package Costing",
        description:
          "Pay-channel costs tracked against package revenue for true margins.",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/cabletv-dashboard.png",
        alt: "Area-wise collection dashboard",
        caption: "Live dues and collections, area by area",
      },
      {
        src: "/screenshots/cabletv-agent.png",
        alt: "Agent collection mobile app",
        caption: "Agents collect and issue receipts in the field",
      },
      {
        src: "/screenshots/cabletv-subscriber.png",
        alt: "Subscriber profile with STB details",
        caption: "Every subscriber and STB, fully traceable",
      },
    ],
    benefits: [
      {
        before: "Dues tracked in agent diaries",
        after: "Live area-wise outstanding on your dashboard",
      },
      {
        before: "Cash leakage between field and office",
        after: "Every collection logged to an agent with receipt",
      },
      {
        before: "STBs lost with no recovery trail",
        after: "Serial-wise box history from issue to return",
      },
      {
        before: "Days spent generating monthly bills",
        after: "Automatic billing for all subscribers on day 1",
      },
      {
        before: "Complaints lost in phone calls and memory",
        after: "Every complaint logged and tracked to closure",
      },
    ],
    pricing: [
      {
        name: "Starter",
        priceMonthly: 599,
        priceAnnual: 479,
        description: "For local operators up to 1,000 subscribers.",
        features: [
          "Up to 1,000 subscribers",
          "Auto monthly billing",
          "2 agent logins",
          "Collection app & receipts",
          "Email support",
        ],
        ctaLabel: "Start with Starter",
      },
      {
        name: "Professional",
        priceMonthly: 1299,
        priceAnnual: 1039,
        description: "For growing operators and MSO franchises.",
        features: [
          "Up to 5,000 subscribers",
          "Unlimited agents",
          "STB inventory tracking",
          "WhatsApp reminders & receipts",
          "Online payment links",
          "Area profitability reports",
          "Priority support",
        ],
        recommended: true,
        ctaLabel: "Get Professional",
      },
      {
        name: "Enterprise",
        priceMonthly: 2499,
        priceAnnual: 1999,
        description: "For MSOs and multi-city networks.",
        features: [
          "Unlimited subscribers",
          "Multi-operator hierarchy",
          "Broadcaster payout tracking",
          "API access",
          "Custom reports",
          "Dedicated account manager",
        ],
        ctaLabel: "Talk to Sales",
      },
    ],
    faqs: [
      {
        question: "Does it work for internet/broadband operators too?",
        answer:
          "Yes. The same subscriber-billing-collection engine handles broadband plans, and many of our operators run cable and internet on one system.",
      },
      {
        question: "How does the agent app prevent collection leakage?",
        answer:
          "Agents can only mark a due paid by issuing a digital receipt, which the subscriber gets on WhatsApp/SMS instantly. Daily deposit reconciliation flags any gap between collected and deposited cash.",
      },
      {
        question: "Can subscribers pay online?",
        answer:
          "Yes. WhatsApp reminders include a UPI payment link; payments post automatically against the subscriber with an instant receipt.",
      },
      {
        question: "How is mid-month activation billed?",
        answer:
          "Pro-rated automatically. Connect a subscriber on the 18th and their first bill charges only the remaining days of the month.",
      },
      {
        question: "Can I import my existing subscriber list?",
        answer:
          "Yes — we import subscribers, areas, packages, STB serials, and opening dues from Excel during free onboarding.",
      },
      {
        question: "Does the agent app work without internet?",
        answer:
          "Yes. Agents can collect offline in low-network areas; receipts and entries sync automatically when the connection returns.",
      },
      {
        question: "Can I track set-top box repairs and returns?",
        answer:
          "Every STB has a serial-wise lifecycle — in stock, issued, in repair, returned, or scrapped — so recovery and warranty claims are painless.",
      },
      {
        question: "What reports do I get as an owner?",
        answer:
          "Daily collection summary by agent, area-wise outstanding ageing, disconnection lists, and monthly profitability after broadcaster and operating costs.",
      },
      {
        question: "Can an MSO manage multiple LCOs under one account?",
        answer:
          "Yes. The Enterprise plan supports an operator hierarchy — each LCO runs their own subscribers and collections while the MSO sees consolidated dashboards and settlements.",
      },
      {
        question: "Does it support both prepaid and postpaid billing?",
        answer:
          "Yes. Postpaid subscribers bill monthly with dues tracking, while prepaid subscribers pay in advance and the balance adjusts automatically against each cycle.",
      },
    ],
    integrations: [
      "WhatsApp",
      "UPI / Payment Gateways",
      "SMS Gateways",
      "Excel Import/Export",
      "Tally",
    ],
    relatedProducts: [
      "accounting-inventory",
      "whatsapp-automation",
      "crm-software",
    ],
  },

  /* ---------------------------------------------------------------- */
  /*  School Management                                                */
  /* ---------------------------------------------------------------- */
  {
    slug: "school-management",
    productId: "school",
    name: "CreativeDox School",
    tagline: "Fees, attendance & exams — with parents in the loop",
    heroDescription:
      "Run admissions, daily attendance, fee collection, and exams from one system — while parents get instant updates, receipts, and report cards on their phone.",
    metaTitle: "School Management Software — Fees, Attendance & Parent App",
    metaDescription:
      "School management software for Indian schools — online fee collection, class-wise attendance, exams & report cards, and a parent mobile portal. From ₹899/month.",
    color: "text-indigo-400",
    hex: "#818cf8",
    gradient: "from-indigo-500 to-blue-600",
    painPointsHeading: "Office buried in registers, parents in the dark?",
    painPoints: [
      {
        icon: "indian-rupee",
        title: "Fee dues nobody can total",
        description:
          "Defaulter lists take days to compile from registers, and reminders go out so late that dues pile up term after term.",
      },
      {
        icon: "clock",
        title: "Staff time lost to paperwork",
        description:
          "Attendance registers, fee receipts, marksheets, and certificates — all handwritten, all duplicated, all error-prone.",
      },
      {
        icon: "users",
        title: "Parents always out of the loop",
        description:
          "Circulars get lost in school bags. Parents learn about absences, dues, and results weeks late — then call the office, all at once.",
      },
      {
        icon: "file-text",
        title: "Report cards take weeks",
        description:
          "Teachers compute totals and grades by hand for every student, every term — slow, stressful, and full of mistakes.",
      },
    ],
    features: [
      {
        icon: "indian-rupee",
        title: "Online Fee Collection",
        description:
          "Parents pay via UPI/cards from the app; receipts generate instantly and dues update in real time.",
      },
      {
        icon: "calendar-clock",
        title: "Class-wise Attendance",
        description:
          "Teachers mark attendance in seconds from their phone; absent students' parents get an instant notification.",
      },
      {
        icon: "graduation-cap",
        title: "Exams & Report Cards",
        description:
          "Enter marks once — totals, grades, and beautifully formatted report cards generate for the whole class automatically.",
      },
      {
        icon: "smartphone",
        title: "Parent Mobile Portal",
        description:
          "Attendance, homework, dues, circulars, and results in the parent's pocket — in Hindi or English.",
      },
      {
        icon: "user-check",
        title: "Admissions Management",
        description:
          "Enquiry to admission pipeline with online forms, document collection, and follow-up tracking.",
      },
      {
        icon: "bell",
        title: "Notices & Communication",
        description:
          "Send circulars, homework, and emergency alerts to the whole school, a class, or one parent — on app and WhatsApp.",
      },
      {
        icon: "truck",
        title: "Transport Management",
        description:
          "Routes, stops, and vehicle assignment with transport-fee billing tied into the fee module.",
      },
      {
        icon: "book-open",
        title: "Timetable & Homework",
        description:
          "Class timetables, substitutions, and daily homework shared straight to the parent app.",
      },
      {
        icon: "bar-chart",
        title: "Management Dashboards",
        description:
          "Fee collection status, attendance trends, and admission funnel — the whole school on one screen.",
      },
    ],
    modules: [
      {
        name: "Student Information System",
        description:
          "Profiles, documents, siblings, and academic history.",
      },
      {
        name: "Fee Management",
        description:
          "Fee structures, concessions, online payments, receipts, and defaulter tracking.",
      },
      {
        name: "Attendance",
        description: "Class-wise daily marking with parent notifications.",
      },
      {
        name: "Examination & Report Cards",
        description:
          "Exam schedules, marks entry, grading schemes, and report card designer.",
      },
      {
        name: "Parent & Student App",
        description:
          "Dues, attendance, homework, results, and circulars on mobile.",
      },
      {
        name: "Admissions CRM",
        description: "Enquiry pipeline, follow-ups, and online admission forms.",
      },
      {
        name: "Transport",
        description: "Routes, stops, drivers, and transport fee integration.",
      },
      {
        name: "Staff & Payroll Basics",
        description:
          "Staff records, leave, and salary-input from staff attendance.",
      },
      {
        name: "Certificates & ID Cards",
        description:
          "TC, bonafide, and character certificates plus ID card printing.",
      },
      {
        name: "Reports & MIS",
        description:
          "Collection reports, class strength, attendance, and audit registers.",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/school-dashboard.png",
        alt: "School management dashboard",
        caption: "Fees, attendance, and admissions on one screen",
      },
      {
        src: "/screenshots/school-parent.png",
        alt: "Parent mobile app",
        caption: "Parents see everything — dues to report cards",
      },
      {
        src: "/screenshots/school-reportcard.png",
        alt: "Auto-generated report card",
        caption: "Report cards for the whole class in minutes",
      },
    ],
    benefits: [
      {
        before: "Defaulter lists compiled over days",
        after: "Live dues dashboard with one-tap reminders",
      },
      {
        before: "Circulars lost in school bags",
        after: "Instant app + WhatsApp notices to every parent",
      },
      {
        before: "Report cards handwritten over weeks",
        after: "Auto-calculated report cards in minutes",
      },
      {
        before: "Office queues on fee day",
        after: "Parents pay online, receipts auto-generated",
      },
      {
        before: "Parents discover absences weeks later",
        after: "Same-moment absent alerts to parents",
      },
    ],
    pricing: [
      {
        name: "Starter",
        priceMonthly: 899,
        priceAnnual: 719,
        description: "For schools up to 300 students.",
        features: [
          "Up to 300 students",
          "Fee management & receipts",
          "Class-wise attendance",
          "Parent app",
          "Email support",
        ],
        ctaLabel: "Start with Starter",
      },
      {
        name: "Professional",
        priceMonthly: 1799,
        priceAnnual: 1439,
        description: "For schools that want everything digital.",
        features: [
          "Up to 1,500 students",
          "Online fee payments (UPI/cards)",
          "Exams & report card designer",
          "Admissions CRM",
          "Transport module",
          "WhatsApp notifications",
          "Priority support",
        ],
        recommended: true,
        ctaLabel: "Get Professional",
      },
      {
        name: "Enterprise",
        priceMonthly: 3499,
        priceAnnual: 2799,
        description: "For school groups and large campuses.",
        features: [
          "Unlimited students",
          "Multi-school dashboard",
          "Custom report cards & certificates",
          "Biometric/RFID integration",
          "API access",
          "Dedicated account manager",
        ],
        ctaLabel: "Talk to Sales",
      },
    ],
    faqs: [
      {
        question: "How do online fee payments work?",
        answer:
          "Parents pay through UPI, cards, or net banking in the parent app. The receipt generates instantly, dues update live, and settlements reach the school's bank account directly.",
      },
      {
        question: "Is the parent app available in Hindi?",
        answer:
          "Yes — parents can switch between Hindi and English. Notices can be sent in any language you type.",
      },
      {
        question: "Can report card formats match our school's design?",
        answer:
          "Yes. The report card designer supports CBSE, state board, and fully custom formats with your logo, grading scheme, and co-scholastic areas.",
      },
      {
        question: "What if parents don't install the app?",
        answer:
          "Every notification can also go on WhatsApp/SMS, so parents without the app still get fee reminders, absence alerts, and circulars.",
      },
      {
        question: "Can we migrate mid-session?",
        answer:
          "Yes. We import students, fee structures, paid/pending dues, and even past attendance from your registers or Excel — schools commonly switch mid-term.",
      },
      {
        question: "Does it handle sibling and staff concessions?",
        answer:
          "Yes — concession rules (sibling, staff ward, scholarship, custom) apply automatically to fee structures and show transparently on receipts.",
      },
      {
        question: "Is training included for our office staff and teachers?",
        answer:
          "Yes. Onboarding includes live training sessions for office staff and teachers, plus Hindi/English help videos inside the app.",
      },
      {
        question: "Can the school track transport fees with routes?",
        answer:
          "Yes. Students map to routes and stops, and route-wise transport fees bill together with tuition in a single receipt.",
      },
      {
        question: "Can one account manage multiple branches or schools?",
        answer:
          "Yes. The Enterprise plan gives each branch its own setup — classes, fees, staff — while management sees consolidated dashboards across all campuses.",
      },
      {
        question: "What happens to our data if we stop using the software?",
        answer:
          "Your data is always yours. You can export every record — students, fees, attendance, results — to Excel/PDF anytime, and we provide a full final export on request.",
      },
    ],
    integrations: [
      "UPI / Payment Gateways",
      "WhatsApp",
      "SMS Gateways",
      "Biometric / RFID Devices",
      "Tally",
      "Excel Import/Export",
    ],
    relatedProducts: [
      "attendance-management",
      "accounting-inventory",
      "whatsapp-automation",
    ],
  },

  /* ---------------------------------------------------------------- */
  /*  ERP Solutions                                                    */
  /* ---------------------------------------------------------------- */
  {
    slug: "erp-solutions",
    productId: "erp",
    name: "CreativeDox ERP",
    tagline: "Purchase to dispatch — one system, one truth",
    heroDescription:
      "Connect purchase, production, inventory, sales, and accounts so every department works from the same live numbers — and you finally see the whole business on one screen.",
    metaTitle: "ERP Software for SMEs — Purchase, Production, Inventory & Sales",
    metaDescription:
      "ERP for growing Indian businesses — purchase & vendor management, production planning with BOM, inventory control, sales, and custom MIS dashboards. From ₹1,499/month.",
    color: "text-rose-400",
    hex: "#fb7185",
    gradient: "from-rose-500 to-pink-600",
    painPointsHeading: "Every department on its own Excel island?",
    painPoints: [
      {
        icon: "layers",
        title: "Departments don't talk",
        description:
          "Purchase, stores, production, and accounts each keep their own files. The same question gets three different answers.",
      },
      {
        icon: "boxes",
        title: "Inventory eats working capital",
        description:
          "Raw material over-ordered here, stock-outs there — without live consumption data, money sleeps in the godown.",
      },
      {
        icon: "clock",
        title: "Decisions wait for month-end",
        description:
          "Job costing, pending orders, and profitability arrive weeks late — long after the time to act has passed.",
      },
      {
        icon: "alert-triangle",
        title: "Production runs on memory",
        description:
          "What to make, what's needed, and what's pending lives in the supervisor's head — and breaks the day they're absent.",
      },
    ],
    features: [
      {
        icon: "briefcase",
        title: "Purchase & Vendor Management",
        description:
          "Indents to POs to GRNs with vendor rate comparison, approval flows, and pending-PO tracking.",
      },
      {
        icon: "factory",
        title: "Production Planning & BOM",
        description:
          "Multi-level BOMs, work orders, and stage-wise production tracking with wastage and yield analysis.",
      },
      {
        icon: "boxes",
        title: "Inventory & Warehouse",
        description:
          "Live raw material, WIP, and finished goods across godowns with batch, serial, and reorder control.",
      },
      {
        icon: "receipt-text",
        title: "Sales & Dispatch",
        description:
          "Sales orders, schedules, dispatch planning, e-invoices, and e-way bills — order to delivery, tracked.",
      },
      {
        icon: "indian-rupee",
        title: "Integrated Accounts",
        description:
          "Every transaction posts to accounts automatically — GST-ready books without re-entry, with Tally sync.",
      },
      {
        icon: "pie-chart",
        title: "Job & Order Costing",
        description:
          "Actual material, labour, and overhead cost per job or order — know your real margin before quoting the next one.",
      },
      {
        icon: "bar-chart",
        title: "Custom MIS Dashboards",
        description:
          "Owner, production, and sales dashboards built around the KPIs you actually run the business on.",
      },
      {
        icon: "user-check",
        title: "Approvals & Audit Trail",
        description:
          "Multi-level approvals on POs, rates, and payments — with a complete who-did-what trail.",
      },
      {
        icon: "plug",
        title: "Integrations & API",
        description:
          "Connects with Tally, weighbridges, barcode systems, and your existing tools via REST API.",
      },
    ],
    modules: [
      {
        name: "Purchase & Procurement",
        description:
          "Indents, RFQs, POs, GRNs, and vendor performance tracking.",
      },
      {
        name: "Production & BOM",
        description:
          "Work orders, multi-level BOMs, stage tracking, and wastage analysis.",
      },
      {
        name: "Inventory & Stores",
        description:
          "Raw material, WIP, FG stock with batch/serial and godown control.",
      },
      {
        name: "Sales & Dispatch",
        description:
          "Orders, schedules, dispatch, e-invoice, and e-way bill generation.",
      },
      {
        name: "Accounts & GST",
        description:
          "Auto-posted ledgers, receivables/payables, and GSTR-ready reports.",
      },
      {
        name: "Costing & Profitability",
        description:
          "Job costing, order-wise margin, and product profitability.",
      },
      {
        name: "Quality Control",
        description: "Inward and stage-wise QC checks with rejection logging.",
      },
      {
        name: "MIS & Dashboards",
        description:
          "Role-based dashboards and scheduled report emails to owners.",
      },
      {
        name: "User Roles & Approvals",
        description:
          "Department-wise access, approval matrices, and audit logs.",
      },
      {
        name: "Asset & Maintenance",
        description:
          "Machine registry, AMC schedules, and breakdown logging.",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/erp-dashboard.png",
        alt: "ERP owner dashboard",
        caption: "The whole business — one live screen",
      },
      {
        src: "/screenshots/erp-production.png",
        alt: "Production work order tracking",
        caption: "Work orders and BOM consumption, stage by stage",
      },
      {
        src: "/screenshots/erp-costing.png",
        alt: "Job costing report",
        caption: "Real margin per job, before month-end",
      },
    ],
    benefits: [
      {
        before: "Each department on separate Excel files",
        after: "One system, one live version of the truth",
      },
      {
        before: "Stock-outs and over-ordering together",
        after: "Reorder alerts driven by live consumption",
      },
      {
        before: "Job profitability known at month-end",
        after: "Live costing per order, while it runs",
      },
      {
        before: "Production knowledge locked in people",
        after: "BOMs and work orders anyone can follow",
      },
      {
        before: "Accounts re-enter every transaction",
        after: "Auto-posted, GST-ready books with Tally sync",
      },
    ],
    pricing: [
      {
        name: "Starter",
        priceMonthly: 1499,
        priceAnnual: 1199,
        description: "For traders and small units connecting departments.",
        features: [
          "Up to 5 users",
          "Purchase, inventory & sales",
          "Integrated accounts & GST",
          "Standard reports",
          "Email support",
        ],
        ctaLabel: "Start with Starter",
      },
      {
        name: "Professional",
        priceMonthly: 2999,
        priceAnnual: 2399,
        description: "For manufacturers who need production control.",
        features: [
          "Up to 15 users",
          "Production planning & BOM",
          "Job costing",
          "Quality control",
          "Approval workflows",
          "Custom MIS dashboards",
          "Priority support",
        ],
        recommended: true,
        ctaLabel: "Get Professional",
      },
      {
        name: "Enterprise",
        priceMonthly: 5999,
        priceAnnual: 4799,
        description: "For multi-unit operations with custom processes.",
        features: [
          "Unlimited users",
          "Multi-unit & multi-company",
          "Custom module development",
          "API & device integrations",
          "On-site implementation",
          "Dedicated account manager",
        ],
        ctaLabel: "Talk to Sales",
      },
    ],
    faqs: [
      {
        question: "Is this ERP suitable for small manufacturers?",
        answer:
          "Yes — it's built for SMEs, not enterprises with IT departments. You start with the modules you need (say purchase + inventory + accounts) and switch on production or QC when you're ready.",
      },
      {
        question: "How long does ERP implementation take?",
        answer:
          "Typically 2–6 weeks depending on modules. We map your processes, migrate masters and opening balances, configure approvals, and train each department before go-live.",
      },
      {
        question: "Can it handle multi-level BOMs?",
        answer:
          "Yes. BOMs can nest sub-assemblies to any depth, and work orders explode them automatically for material requirement and consumption tracking.",
      },
      {
        question: "Do accounts still need Tally?",
        answer:
          "Books are maintained inside the ERP with GST-ready reports, and two-way Tally sync is available if your CA prefers to finalize in Tally.",
      },
      {
        question: "Can the ERP be customized to our process?",
        answer:
          "Yes. Fields, approval flows, print formats, and dashboards are configurable on all plans; Enterprise includes custom module development for unique processes.",
      },
      {
        question: "How does job costing work?",
        answer:
          "Material issues, labour entries, and overhead allocations post against each work order — so every job shows its actual cost and margin in real time.",
      },
      {
        question: "What about data security and backups?",
        answer:
          "Role-based access limits each user to their department, every action is audit-logged, and cloud data is backed up daily on Indian servers. On-premise deployment is available for Enterprise.",
      },
      {
        question: "Can we start with a few modules and expand?",
        answer:
          "That's the recommended path. Most customers go live with purchase-inventory-sales-accounts, then add production, QC, and costing in phase two.",
      },
      {
        question: "Does it work for trading businesses without manufacturing?",
        answer:
          "Yes. Distributors and traders simply skip the production modules and run purchase, inventory, sales, dispatch, and accounts — with the same costing and MIS dashboards.",
      },
      {
        question: "Can field and warehouse staff use it on mobile?",
        answer:
          "Yes. The mobile app covers approvals, stock checks, sales order entry, and dashboards — so owners and field teams stay connected without a desktop.",
      },
    ],
    integrations: [
      "Tally",
      "E-invoice & E-way Bill",
      "Barcode / QR Systems",
      "Weighbridge Devices",
      "WhatsApp",
      "Biometric Attendance",
      "REST API",
    ],
    relatedProducts: [
      "accounting-inventory",
      "attendance-management",
      "crm-software",
    ],
  },

  /* ---------------------------------------------------------------- */
  /*  Lead Management                                                  */
  /* ---------------------------------------------------------------- */
  {
    slug: "lead-management",
    productId: "lead-management",
    name: "CreativeDox Leads",
    tagline: "Capture every enquiry. Work every lead. Convert more.",
    heroDescription:
      "Enquiries from Facebook, Google, your website, and walk-ins land in one queue — auto-assigned to the right salesperson, followed up on WhatsApp, and tracked to conversion. Built for Indian sales teams that live on their phones.",
    metaTitle: "Lead Management Software — Capture, Track & Convert Leads",
    metaDescription:
      "Lead management software for Indian businesses — sync Facebook & Google leads, auto-assign to your team, nurture on WhatsApp, and track source-wise ROI. From ₹599/month.",
    color: "text-fuchsia-400",
    hex: "#e879f9",
    gradient: "from-fuchsia-500 to-purple-600",
    painPointsHeading: "Leads coming in, but slipping through the cracks?",
    painPoints: [
      {
        icon: "clock",
        title: "Slow follow-up loses the sale",
        description:
          "An enquiry that isn't answered in the first few minutes usually goes to whoever called back first. Manual lists mean leads sit untouched for hours.",
      },
      {
        icon: "inbox",
        title: "Leads scattered everywhere",
        description:
          "Facebook forms, Google ads, website enquiries, IndiaMART, and walk-ins live in five different places — so leads get missed, duplicated, or forgotten.",
      },
      {
        icon: "user-check",
        title: "No accountability on the team",
        description:
          "Without assignment and tracking, you never know who owns a lead, whether they followed up, or why a hot prospect went cold.",
      },
      {
        icon: "bar-chart",
        title: "No idea what's actually working",
        description:
          "You spend on ads across channels but can't tell which source brings leads that convert — so the marketing budget is mostly guesswork.",
      },
    ],
    features: [
      {
        icon: "filter",
        title: "Multi-channel Capture",
        description:
          "Facebook & Instagram lead ads, Google forms, your website, landing pages, and QR codes flow into one inbox automatically — no copy-paste.",
      },
      {
        icon: "repeat",
        title: "Auto Lead Assignment",
        description:
          "Round-robin, territory, or product-based rules route each new lead to the right salesperson the instant it arrives.",
      },
      {
        icon: "message-circle",
        title: "WhatsApp Nurture",
        description:
          "Trigger instant WhatsApp welcomes and drip sequences so every enquiry gets a reply within a minute, day or night.",
      },
      {
        icon: "bell",
        title: "Follow-up Reminders",
        description:
          "Scheduled callbacks, tasks, and overdue alerts make sure no lead is ever forgotten or followed up too late.",
      },
      {
        icon: "scan-line",
        title: "Duplicate Detection",
        description:
          "Matching phone and email across sources merges duplicate enquiries so two reps never chase the same person.",
      },
      {
        icon: "trending-up",
        title: "Lead Scoring",
        description:
          "Score leads by source, budget, and engagement so your team always calls the hottest prospects first.",
      },
      {
        icon: "indian-rupee",
        title: "Source ROI Tracking",
        description:
          "See cost-per-lead and conversion rate for every channel and campaign — and put your budget where it actually pays back.",
      },
      {
        icon: "smartphone",
        title: "Mobile Sales App",
        description:
          "Reps work their pipeline, log calls, and update statuses from their phone — with click-to-call and WhatsApp built in.",
      },
      {
        icon: "bar-chart",
        title: "Funnel & Team Reports",
        description:
          "Visual conversion funnels, rep-wise performance, and stage drop-off reports give you a live read on your sales engine.",
      },
    ],
    modules: [
      {
        name: "Lead Inbox",
        description:
          "Unified capture from Facebook, Google, website, QR, IndiaMART, and manual entry with instant de-duplication.",
      },
      {
        name: "Assignment Rules",
        description:
          "Round-robin, territory, product, and load-based routing with reassignment and escalation.",
      },
      {
        name: "Pipeline & Stages",
        description:
          "Customizable stages from New to Won/Lost with drag-and-drop pipeline and reason-for-loss capture.",
      },
      {
        name: "WhatsApp Sequences",
        description:
          "Instant auto-replies plus multi-step nurture drips on the official WhatsApp Business API.",
      },
      {
        name: "Tasks & Reminders",
        description:
          "Callbacks, meetings, and follow-up tasks with overdue alerts and a daily agenda per rep.",
      },
      {
        name: "Lead Scoring",
        description:
          "Rule-based scoring on source, budget, and activity to surface sales-ready leads automatically.",
      },
      {
        name: "Call Logging",
        description:
          "Click-to-call, call outcomes, and notes logged against each lead from the mobile app.",
      },
      {
        name: "Source & Campaign ROI",
        description:
          "Cost-per-lead, conversion, and revenue attribution by channel, campaign, and ad set.",
      },
      {
        name: "Reports & Funnels",
        description:
          "Conversion funnels, rep leaderboards, stage drop-off, and aging-lead reports.",
      },
      {
        name: "Roles & Permissions",
        description:
          "Manager, team-lead, and rep roles with data visibility limited to their own leads and teams.",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/leads-pipeline.png",
        alt: "Lead pipeline board with drag-and-drop stages",
        caption: "Visual pipeline — every lead, every stage, at a glance",
      },
      {
        src: "/screenshots/leads-inbox.png",
        alt: "Unified multi-channel lead inbox",
        caption: "One inbox for Facebook, Google, website, and walk-in leads",
      },
      {
        src: "/screenshots/leads-roi.png",
        alt: "Source-wise lead ROI report",
        caption: "See which channel actually converts — and what it costs",
      },
    ],
    benefits: [
      {
        before: "Leads sit unanswered for hours and go to a competitor",
        after: "Instant WhatsApp reply and assignment within a minute",
      },
      {
        before: "Enquiries scattered across five platforms and notebooks",
        after: "Every lead from every source in one organized queue",
      },
      {
        before: "No one knows who owns a lead or if it was followed up",
        after: "Clear ownership, reminders, and a full activity trail",
      },
      {
        before: "Ad budget spread blindly across channels",
        after: "Source-wise ROI shows exactly where to spend more",
      },
      {
        before: "Hot prospects forgotten among hundreds of cold ones",
        after: "Lead scoring puts the best opportunities on top",
      },
    ],
    pricing: [
      {
        name: "Starter",
        priceMonthly: 599,
        priceAnnual: 479,
        description: "For small teams getting leads organized for the first time.",
        features: [
          "Up to 3 users",
          "Website & manual lead capture",
          "Visual pipeline & stages",
          "Follow-up reminders",
          "Email support",
        ],
        ctaLabel: "Start with Starter",
      },
      {
        name: "Professional",
        priceMonthly: 1299,
        priceAnnual: 1039,
        description: "For growing sales teams running ads across channels.",
        features: [
          "Up to 15 users",
          "Facebook & Google lead sync",
          "Auto-assignment rules",
          "WhatsApp nurture sequences",
          "Lead scoring & source ROI",
          "Mobile app with click-to-call",
          "Priority support",
        ],
        recommended: true,
        ctaLabel: "Get Professional",
      },
      {
        name: "Enterprise",
        priceMonthly: 2999,
        priceAnnual: 2399,
        description: "For multi-team operations with custom workflows.",
        features: [
          "Unlimited users",
          "Custom stages & scoring models",
          "Territory & multi-team routing",
          "API & CRM/ERP integration",
          "Advanced attribution reports",
          "Dedicated account manager",
        ],
        ctaLabel: "Talk to Sales",
      },
    ],
    faqs: [
      {
        question: "Which lead sources can you connect?",
        answer:
          "Facebook & Instagram lead ads, Google lead-form extensions, your website and landing-page forms, QR codes, and IndiaMART — plus manual and bulk Excel entry. New leads appear in one inbox in real time.",
      },
      {
        question: "How fast can leads get a response?",
        answer:
          "Instantly. The moment a lead is captured, an auto-reply can go out on WhatsApp and the lead is assigned to a rep with a follow-up task — so first response happens within a minute, even after hours.",
      },
      {
        question: "How does auto-assignment work?",
        answer:
          "You set rules — round-robin for fairness, or routing by territory, product, or current workload. Leads can also escalate or reassign automatically if a rep doesn't act within your chosen time window.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes. Reps get a full mobile app to view their pipeline, log calls with click-to-call, send WhatsApp messages, and update lead status on the go — no desktop required.",
      },
      {
        question: "Will it stop duplicate leads?",
        answer:
          "Yes. We match on phone and email across every source, so a person who enquires twice is merged into one lead — two reps never end up calling the same prospect.",
      },
      {
        question: "Can I see which ad channel actually converts?",
        answer:
          "Absolutely. Source and campaign reports show cost-per-lead, conversion rate, and revenue by channel and ad set, so you can shift budget to what genuinely pays back.",
      },
      {
        question: "Can it connect to my existing CRM or ERP?",
        answer:
          "Yes. On the Enterprise plan we integrate via API so qualified leads and won deals sync to your CRM, ERP, or accounting system without double entry.",
      },
      {
        question: "How long does setup take?",
        answer:
          "Most teams go live in 1–2 days. We connect your lead sources, import existing leads from Excel, set up assignment rules, and train your team as part of onboarding.",
      },
      {
        question: "Is my lead data secure?",
        answer:
          "Data is stored on cloud servers in India with daily backups, encrypted in transit, and accessible only through role-based logins — reps see only their own leads.",
      },
      {
        question: "Can I try it before buying?",
        answer:
          "Yes. Book a free demo and we'll set up a trial with your own lead sources so you can evaluate it with your actual team before committing.",
      },
    ],
    integrations: [
      "Facebook Lead Ads",
      "Google Ads",
      "WhatsApp",
      "IndiaMART",
      "Website Forms",
      "Razorpay",
      "Excel Import/Export",
    ],
    relatedProducts: ["crm-software", "marketing-automation", "whatsapp-automation"],
  },
];

/** Look up a product detail page by its slug. */
export function getProductDetail(slug: string): ProductDetail | undefined {
  return PRODUCT_DETAILS.find((detail) => detail.slug === slug);
}

/** All product page slugs — used by generateStaticParams. */
export function getProductSlugs(): string[] {
  return PRODUCT_DETAILS.map((detail) => detail.slug);
}
