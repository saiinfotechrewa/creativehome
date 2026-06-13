import type { IndustryDetail } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Industry landing pages (/industries/[slug])                        */
/*                                                                     */
/*  Colors, icons, and gradients mirror the overview entries in        */
/*  data/industries.ts so the brand stays consistent. Each `solutions` */
/*  slug resolves against data/solutions.ts → /solutions/[slug], and   */
/*  `testimonialId` against data/testimonials.ts.                      */
/* ------------------------------------------------------------------ */

export const INDUSTRY_DETAILS: IndustryDetail[] = [
  {
    slug: "retail",
    name: "Retail & Shops",
    shortName: "Retail",
    eyebrow: "Retail & Commerce",
    heroDescription:
      "From the billing counter to the back office — GST invoicing, barcode POS, live stock, and WhatsApp offers that bring customers back. Run your shop on one system instead of six registers.",
    metaTitle: "Retail Billing, POS & Inventory Software for Shops",
    metaDescription:
      "CreativeDox builds GST billing, barcode POS, inventory, and WhatsApp marketing software for retail shops and supermarkets in India. Faster checkout, accurate stock, fewer billing errors.",
    icon: "store",
    color: "text-orange-400",
    hex: "#fb923c",
    gradient: "from-orange-500 to-amber-600",
    cardDescription:
      "GST billing, barcode POS, stock alerts, and WhatsApp offers — one system for the whole shop.",
    highlight: "80% fewer billing errors",
    painPoints: [
      {
        icon: "clock",
        title: "Long queues at the counter",
        description:
          "Manual billing slows checkout to a crawl during rush hours, and customers walk out of long lines.",
      },
      {
        icon: "package",
        title: "Stock you can't trust",
        description:
          "Nobody knows what's really on the shelf — fast movers run out while slow stock ties up cash.",
      },
      {
        icon: "receipt-text",
        title: "GST filing chaos",
        description:
          "Returns mean nights of reconciling paper bills, and a single mismatch invites a notice.",
      },
      {
        icon: "users",
        title: "Customers who don't return",
        description:
          "Without a way to reach buyers, every sale is a one-time sale and festival footfall is left to luck.",
      },
    ],
    solutions: ["accounting-inventory", "whatsapp-automation", "crm-software"],
    workflow: [
      {
        step: 1,
        icon: "scan-line",
        title: "Bill in seconds",
        description:
          "Scan a barcode, apply GST automatically, and print or WhatsApp the invoice before the customer reaches for their wallet.",
      },
      {
        step: 2,
        icon: "package",
        title: "Stock updates itself",
        description:
          "Every sale and purchase adjusts inventory live, with low-stock alerts so best-sellers never run dry.",
      },
      {
        step: 3,
        icon: "megaphone",
        title: "Bring customers back",
        description:
          "Auto-send offers, festival greetings, and new-arrival alerts to your buyer list on WhatsApp.",
      },
      {
        step: 4,
        icon: "pie-chart",
        title: "Know your numbers",
        description:
          "See daily sales, top products, and GST-ready reports from your phone — file returns in a click.",
      },
    ],
    results: [
      { value: "80%", label: "Fewer billing errors" },
      { value: "3x", label: "Faster checkout at the counter" },
      { value: "25%", label: "Repeat customers from WhatsApp offers" },
    ],
    testimonialId: "ramesh-agarwal",
  },
  {
    slug: "schools-education",
    name: "Schools & Education",
    shortName: "Schools & Education",
    eyebrow: "Education",
    heroDescription:
      "From admission enquiry to report card — fees, attendance, exams, and a parent portal that keeps families in the loop. Give your staff their evenings back and parents the updates they ask for.",
    metaTitle: "School Management Software — Fees, Attendance & Exams",
    metaDescription:
      "CreativeDox school management software handles admissions, fee collection, attendance, exams, and parent communication for schools and coaching institutes across India.",
    icon: "graduation-cap",
    color: "text-indigo-400",
    hex: "#818cf8",
    gradient: "from-indigo-500 to-blue-600",
    cardDescription:
      "Admissions, fees, attendance, exams, and a parent portal that keeps families in the loop.",
    highlight: "Fees collected on time",
    painPoints: [
      {
        icon: "wallet",
        title: "Fees that arrive late",
        description:
          "Chasing pending fees by phone burns staff time, and term-end shortfalls strain the budget.",
      },
      {
        icon: "clock",
        title: "Attendance eats teaching time",
        description:
          "Roll-call registers take 15 minutes a class and the data never reaches parents or the office.",
      },
      {
        icon: "message-circle",
        title: "Parents left in the dark",
        description:
          "Calls and printed circulars don't scale — families miss fee dues, holidays, and results.",
      },
      {
        icon: "file-text",
        title: "Exams and report cards by hand",
        description:
          "Tabulating marks across sections is error-prone and report cards take weeks to finalize.",
      },
      {
        icon: "users",
        title: "Admission enquiries slip away",
        description:
          "Walk-in and call enquiries live in a diary, so genuine prospects go un-followed-up.",
      },
    ],
    solutions: ["school-management", "attendance-management", "lead-management"],
    workflow: [
      {
        step: 1,
        icon: "user-check",
        title: "Capture every enquiry",
        description:
          "Log admission enquiries with automatic follow-up reminders so no prospective family is forgotten.",
      },
      {
        step: 2,
        icon: "scan-line",
        title: "Mark attendance in seconds",
        description:
          "Biometric or app-based attendance for students and staff — parents get an instant alert if a child is absent.",
      },
      {
        step: 3,
        icon: "indian-rupee",
        title: "Collect fees online",
        description:
          "Auto-generate fee receipts, accept online payments, and send gentle WhatsApp reminders before the due date.",
      },
      {
        step: 4,
        icon: "file-text",
        title: "Exams to report cards",
        description:
          "Enter marks once and generate grade-wise report cards and analytics for the whole school instantly.",
      },
    ],
    results: [
      { value: "30s", label: "To mark a full class attendance" },
      { value: "40%", label: "Faster fee collection" },
      { value: "100%", label: "Parents reached on every update" },
    ],
    testimonialId: "sunita-deshmukh",
  },
  {
    slug: "cable-tv-operators",
    name: "Cable TV Operators",
    shortName: "Cable TV Operators",
    eyebrow: "Broadband & Cable",
    heroDescription:
      "Subscriber packages, monthly billing, and agent-wise collection tracking — know exactly who's paid and who's due, area by area. Stop the revenue leaks that month-end guesswork hides.",
    metaTitle: "Cable TV & Broadband Billing & Subscriber Management Software",
    metaDescription:
      "CreativeDox cable TV management software handles subscriber packages, monthly billing, agent collections, and WhatsApp due reminders for cable operators and ISPs in India.",
    icon: "tv",
    color: "text-rose-400",
    hex: "#fb7185",
    gradient: "from-rose-500 to-pink-600",
    cardDescription:
      "Subscriber packages, monthly billing, and agent-wise collection — know who's paid, area by area.",
    highlight: "40% better collection rate",
    painPoints: [
      {
        icon: "indian-rupee",
        title: "Outstanding you can't see",
        description:
          "With thousands of subscribers across areas, real dues only surface at month-end — if at all.",
      },
      {
        icon: "users",
        title: "Agent collections go untracked",
        description:
          "Cash collected in the field is hard to reconcile, and leakage is impossible to prove.",
      },
      {
        icon: "repeat",
        title: "Renewals fall through cracks",
        description:
          "Package expiries aren't flagged, so disconnections and re-activations happen late and lose revenue.",
      },
      {
        icon: "bell",
        title: "Reminders cost a fortune",
        description:
          "Calling every due subscriber is impossible, and silence means payments simply slip another month.",
      },
    ],
    solutions: [
      "cable-tv-management",
      "whatsapp-automation",
      "accounting-inventory",
    ],
    workflow: [
      {
        step: 1,
        icon: "list-checks",
        title: "Set up packages & subscribers",
        description:
          "Define plans and map every subscriber to an area and agent — your whole base in one place.",
      },
      {
        step: 2,
        icon: "smartphone",
        title: "Agents collect on the app",
        description:
          "Field agents mark payments on their phone; collections post to the right subscriber instantly.",
      },
      {
        step: 3,
        icon: "send",
        title: "Auto WhatsApp reminders",
        description:
          "Due and overdue subscribers get automatic WhatsApp reminders — collection without a single phone call.",
      },
      {
        step: 4,
        icon: "bar-chart",
        title: "See dues live, area-wise",
        description:
          "Track collection by area and agent in real time, and act on outstanding before it ages.",
      },
    ],
    results: [
      { value: "40%", label: "Improvement in collection rate" },
      { value: "100%", label: "Visibility into agent collections" },
      { value: "0", label: "Phone calls to chase routine dues" },
    ],
    testimonialId: "anil-kushwaha",
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    shortName: "Manufacturing",
    eyebrow: "Manufacturing & Production",
    heroDescription:
      "Purchase to production to dispatch on one system — BOM, godown stock, worker attendance, and MIS your management can act on. Replace disconnected registers with a shop floor you can see.",
    metaTitle: "Manufacturing ERP — Production, Inventory & MIS Software",
    metaDescription:
      "CreativeDox manufacturing ERP connects purchase, BOM, production, godown inventory, worker attendance, and management MIS for small and mid-size manufacturers in India.",
    icon: "factory",
    color: "text-cyan-400",
    hex: "#22d3ee",
    gradient: "from-cyan-500 to-sky-600",
    cardDescription:
      "Purchase, BOM, production, godown stock, and worker attendance — one shop floor you can see.",
    highlight: "Real-time stock & MIS",
    painPoints: [
      {
        icon: "layers",
        title: "Production runs on guesswork",
        description:
          "Without live BOM and stock, planning is reactive — lines stall waiting on materials that weren't ordered.",
      },
      {
        icon: "package",
        title: "Godown stock is a black box",
        description:
          "Raw material and finished goods counts drift from reality, leading to over-buying and dead stock.",
      },
      {
        icon: "user-check",
        title: "Worker attendance & wages",
        description:
          "Manual muster rolls make shift tracking and wage calculation slow and prone to disputes.",
      },
      {
        icon: "bar-chart",
        title: "Management flies blind",
        description:
          "By the time MIS reports are compiled by hand, the numbers are a week old and decisions are late.",
      },
    ],
    solutions: ["erp-solutions", "attendance-management", "accounting-inventory"],
    workflow: [
      {
        step: 1,
        icon: "inbox",
        title: "Purchase & material in",
        description:
          "Raise POs, receive raw material into godowns, and update stock the moment goods arrive.",
      },
      {
        step: 2,
        icon: "settings",
        title: "Plan production with BOM",
        description:
          "Define bills of material, issue stock to production, and track work-in-progress against orders.",
      },
      {
        step: 3,
        icon: "user-check",
        title: "Track workers & shifts",
        description:
          "Capture worker attendance and shifts digitally, feeding accurate hours into wage calculation.",
      },
      {
        step: 4,
        icon: "truck",
        title: "Dispatch & report",
        description:
          "Generate dispatch documents, update finished-goods stock, and surface live MIS to management.",
      },
    ],
    results: [
      { value: "20%", label: "Less raw-material wastage" },
      { value: "100%", label: "Live stock & production visibility" },
      { value: "1 day", label: "MIS in real time, not week-old" },
    ],
    testimonialId: "vikram-mehta",
  },
  {
    slug: "agencies",
    name: "Agencies",
    shortName: "Agencies",
    eyebrow: "Marketing & Creative Agencies",
    heroDescription:
      "Capture every client enquiry, run multi-channel campaigns for your customers, and report results without spreadsheet gymnastics. Spend your hours on creative, not on chasing data.",
    metaTitle: "Agency CRM & Marketing Automation Software",
    metaDescription:
      "CreativeDox gives marketing and creative agencies a CRM, lead management, and marketing automation to capture enquiries, run client campaigns, and report results in one place.",
    icon: "briefcase",
    color: "text-fuchsia-400",
    hex: "#e879f9",
    gradient: "from-fuchsia-500 to-purple-600",
    cardDescription:
      "Capture enquiries, run multi-channel client campaigns, and report results without spreadsheets.",
    highlight: "Campaigns & reporting in one place",
    painPoints: [
      {
        icon: "filter",
        title: "Leads scattered everywhere",
        description:
          "Enquiries arrive on forms, DMs, and calls with no single pipeline — and good leads go cold.",
      },
      {
        icon: "repeat",
        title: "Campaigns run by hand",
        description:
          "Sending client campaigns across channels manually doesn't scale as the roster grows.",
      },
      {
        icon: "file-text",
        title: "Reporting eats billable hours",
        description:
          "Pulling numbers into decks every month steals time that should go to creative work.",
      },
      {
        icon: "users",
        title: "Client visibility gaps",
        description:
          "Clients want to see progress; without a shared view, status updates become a recurring meeting.",
      },
    ],
    solutions: ["marketing-automation", "lead-management", "crm-software"],
    workflow: [
      {
        step: 1,
        icon: "inbox",
        title: "Centralize every lead",
        description:
          "Funnel website forms, ads, and DMs into one pipeline with owners and follow-up reminders.",
      },
      {
        step: 2,
        icon: "megaphone",
        title: "Automate client campaigns",
        description:
          "Build and schedule multi-channel campaigns — email, WhatsApp, and SMS — for each client at once.",
      },
      {
        step: 3,
        icon: "target",
        title: "Nurture and convert",
        description:
          "Trigger drip sequences on lead behavior so prospects move down the funnel without manual nudging.",
      },
      {
        step: 4,
        icon: "bar-chart",
        title: "Report automatically",
        description:
          "Live dashboards turn campaign results into client-ready reports — no more month-end spreadsheet nights.",
      },
    ],
    results: [
      { value: "2x", label: "More leads worked per month" },
      { value: "60%", label: "Less time spent on reporting" },
      { value: "35%", label: "Higher lead-to-client conversion" },
    ],
    testimonialId: "neha-kapoor",
  },
  {
    slug: "service-providers",
    name: "Service Providers",
    shortName: "Service Providers",
    eyebrow: "Field & Service Business",
    heroDescription:
      "Bookings, field staff attendance, AMC reminders, and payment follow-ups — run the whole service business from your phone. Close more calls without dropping a single follow-up.",
    metaTitle: "Service Business Software — Bookings, Field Staff & AMC",
    metaDescription:
      "CreativeDox software for service providers manages bookings, field-staff attendance, AMC renewal reminders, and payment follow-ups over WhatsApp — run your service business from your phone.",
    icon: "wrench",
    color: "text-emerald-400",
    hex: "#34d399",
    gradient: "from-emerald-500 to-teal-600",
    cardDescription:
      "Bookings, field-staff attendance, AMC reminders, and payment follow-ups — run it from your phone.",
    highlight: "30% more service calls",
    painPoints: [
      {
        icon: "calendar-clock",
        title: "Bookings on paper and phone",
        description:
          "Jobs live in a diary and WhatsApp threads, so double-bookings and missed visits are common.",
      },
      {
        icon: "map-pin",
        title: "No line of sight on field staff",
        description:
          "You can't tell who's on-site, who's free, or whether a job was actually completed.",
      },
      {
        icon: "repeat",
        title: "AMC renewals forgotten",
        description:
          "Annual contracts lapse silently because nobody is tracking renewal dates — recurring revenue lost.",
      },
      {
        icon: "indian-rupee",
        title: "Payments chased manually",
        description:
          "Following up on invoices by phone is slow, and payments routinely slip past their due date.",
      },
    ],
    solutions: ["crm-software", "attendance-management", "whatsapp-automation"],
    workflow: [
      {
        step: 1,
        icon: "calendar-clock",
        title: "Book and assign jobs",
        description:
          "Log service requests and assign them to the right technician with date, time, and location.",
      },
      {
        step: 2,
        icon: "smartphone",
        title: "Field staff on the app",
        description:
          "Technicians mark attendance, check in on-site, and close jobs with notes and proof from their phone.",
      },
      {
        step: 3,
        icon: "bell",
        title: "Auto AMC reminders",
        description:
          "Renewals and service-due dates trigger automatic WhatsApp reminders to customers — and to you.",
      },
      {
        step: 4,
        icon: "indian-rupee",
        title: "Invoice & follow up",
        description:
          "Raise invoices on job completion and send payment reminders automatically until they're settled.",
      },
    ],
    results: [
      { value: "30%", label: "More service calls per month" },
      { value: "100%", label: "AMC renewals tracked, none lapsed" },
      { value: "45%", label: "Faster payment collection" },
    ],
    testimonialId: "farhan-qureshi",
  },
  {
    slug: "startups",
    name: "Startups",
    shortName: "Startups",
    eyebrow: "Startups & Founders",
    heroDescription:
      "Move fast without duct-tape tooling — custom MVPs, automations, and integrations built by a team that ships in weeks, not quarters. Get to your investor demo with software you actually own.",
    metaTitle: "MVP Development & Custom Software for Startups",
    metaDescription:
      "CreativeDox builds MVPs, custom software, automations, and integrations for startups in India — ship investor-ready products in weeks with a team that works like co-founders.",
    icon: "rocket",
    color: "text-violet-400",
    hex: "#a78bfa",
    gradient: "from-violet-500 to-purple-600",
    cardDescription:
      "Custom MVPs, automations, and integrations from a team that ships in weeks, not quarters.",
    highlight: "MVP shipped in weeks",
    painPoints: [
      {
        icon: "clock",
        title: "Months to a first version",
        description:
          "Traditional agencies quote quarters, and the runway burns before the product ever reaches users.",
      },
      {
        icon: "puzzle",
        title: "Duct-tape tool stack",
        description:
          "A patchwork of no-code tools breaks under real usage and can't bend to your actual workflow.",
      },
      {
        icon: "plug",
        title: "Nothing talks to anything",
        description:
          "Payments, CRM, and ops live in silos, so the team copies data between tabs all day.",
      },
      {
        icon: "trending-up",
        title: "Built to demo, not to scale",
        description:
          "Quick hacks impress investors then buckle the moment real customers and load arrive.",
      },
    ],
    solutions: ["custom-development", "marketing-automation", "erp-solutions"],
    workflow: [
      {
        step: 1,
        icon: "target",
        title: "Scope the MVP",
        description:
          "We pin down the core flow that proves your idea and cut everything that doesn't earn its place.",
      },
      {
        step: 2,
        icon: "rocket",
        title: "Ship in weekly sprints",
        description:
          "You see working software every week and steer the build — no black-box, no quarter-long waits.",
      },
      {
        step: 3,
        icon: "plug",
        title: "Wire up your stack",
        description:
          "Payments, auth, CRM, and ops integrated into one product so data flows instead of being copied.",
      },
      {
        step: 4,
        icon: "trending-up",
        title: "Scale past the demo",
        description:
          "Built on a production-grade foundation that holds up as real users and load arrive.",
      },
    ],
    results: [
      { value: "3", label: "Weeks to an investor-ready MVP", description: "weeks" },
      { value: "1", label: "Unified product instead of glued-together tools" },
      { value: "100%", label: "Code and IP you fully own" },
    ],
    testimonialId: "arjun-malhotra",
  },
];

/** All industry landing-page slugs, for `generateStaticParams`-style use. */
export function getIndustrySlugs(): string[] {
  return INDUSTRY_DETAILS.map((industry) => industry.slug);
}

/** Look up an industry landing page by slug. */
export function getIndustryDetail(slug: string): IndustryDetail | undefined {
  return INDUSTRY_DETAILS.find((industry) => industry.slug === slug);
}
