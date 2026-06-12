import type { ServiceCard, ServiceDetail } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Overview grid (/services)                                          */
/* ------------------------------------------------------------------ */

/**
 * Six cards on the services overview page. The first five link to a
 * dedicated detail page; the sixth routes to the consultation flow.
 */
export const SERVICE_CARDS: ServiceCard[] = [
  {
    id: "custom-web-development",
    title: "Custom Web Development",
    description:
      "Production-grade web apps, portals, and dashboards engineered around your exact workflows.",
    icon: "code",
    color: "text-sky-400",
    hex: "#38bdf8",
    gradient: "from-sky-500 to-blue-600",
    href: "/services/custom-web-development",
    cta: "Explore service",
  },
  {
    id: "saas-development",
    title: "SaaS Development",
    description:
      "Multi-tenant platforms with billing, auth, and analytics — built to onboard customers from day one.",
    icon: "boxes",
    color: "text-violet-400",
    hex: "#a78bfa",
    gradient: "from-violet-500 to-purple-600",
    href: "/services/saas-development",
    cta: "Explore service",
  },
  {
    id: "business-automation",
    title: "Business Automation",
    description:
      "Replace manual, repetitive operations with reliable workflows that run themselves around the clock.",
    icon: "workflow",
    color: "text-emerald-400",
    hex: "#34d399",
    gradient: "from-emerald-500 to-teal-600",
    href: "/services/business-automation",
    cta: "Explore service",
  },
  {
    id: "api-integration",
    title: "API & Integrations",
    description:
      "Connect Tally, payment gateways, WhatsApp, and CRMs into one synchronized source of truth.",
    icon: "plug",
    color: "text-orange-400",
    hex: "#fb923c",
    gradient: "from-orange-500 to-amber-600",
    href: "/services/api-integration",
    cta: "Explore service",
  },
  {
    id: "ai-integration",
    title: "AI Integration",
    description:
      "Bring chat assistants, document intelligence, and predictive insights into your existing tools.",
    icon: "bot",
    color: "text-fuchsia-400",
    hex: "#e879f9",
    gradient: "from-fuchsia-500 to-pink-600",
    href: "/services/ai-integration",
    cta: "Explore service",
  },
  {
    id: "dedicated-team",
    title: "Dedicated Product Team",
    description:
      "Need ongoing capacity? Embed a vetted squad of engineers and designers that ships every sprint.",
    icon: "users",
    color: "text-rose-400",
    hex: "#fb7185",
    gradient: "from-rose-500 to-red-600",
    href: "/book-consultation",
    cta: "Talk to us",
  },
];

/* ------------------------------------------------------------------ */
/*  Service detail pages                                               */
/* ------------------------------------------------------------------ */

export const SERVICE_DETAILS: ServiceDetail[] = [
  /* ----------------------------- Custom Web Development ----------- */
  {
    slug: "custom-web-development",
    title: "Custom Web Development",
    eyebrow: "Custom Web Development",
    headline: "Web apps built around the way you actually work",
    heroDescription:
      "From internal operations portals to customer-facing platforms, we design and engineer fast, secure web applications that fit your processes instead of forcing you to fit theirs.",
    metaTitle: "Custom Web Development Services",
    metaDescription:
      "CreativeDox builds production-grade custom web applications, portals, and dashboards engineered around your workflows — fast, secure, and scalable.",
    icon: "code",
    color: "text-sky-400",
    hex: "#38bdf8",
    gradient: "from-sky-500 to-blue-600",
    deliverables: [
      {
        icon: "layers",
        title: "Operations Portals",
        description:
          "Role-based internal dashboards that replace scattered spreadsheets with one reliable system.",
      },
      {
        icon: "users",
        title: "Customer Portals",
        description:
          "Self-service portals where your clients track orders, invoices, and support in real time.",
      },
      {
        icon: "bar-chart",
        title: "Analytics Dashboards",
        description:
          "Live reporting surfaces that turn raw operational data into decisions leadership can act on.",
      },
      {
        icon: "store",
        title: "Booking & Commerce",
        description:
          "Catalogs, scheduling, and checkout flows with payments wired in and inventory kept in sync.",
      },
      {
        icon: "smartphone",
        title: "Progressive Web Apps",
        description:
          "Installable, offline-capable apps that feel native on every device without an app store.",
      },
      {
        icon: "shield-check",
        title: "Secure Auth Systems",
        description:
          "SSO, granular permissions, and audit trails so the right people see exactly the right data.",
      },
    ],
    process: [
      {
        step: 1,
        icon: "search",
        title: "Discovery & Scoping",
        description:
          "We map your workflows, users, and edge cases, then lock a clear scope with milestones and a fixed estimate.",
      },
      {
        step: 2,
        icon: "drafting-compass",
        title: "UX & Architecture",
        description:
          "Wireframes and a technical architecture are signed off before a single production line is written.",
      },
      {
        step: 3,
        icon: "pen-tool",
        title: "UI Design",
        description:
          "We design a polished, on-brand interface with a component system that stays consistent as you grow.",
      },
      {
        step: 4,
        icon: "code",
        title: "Build & Iterate",
        description:
          "Two-week sprints ship working features you can review continuously — no big-bang surprises at the end.",
      },
      {
        step: 5,
        icon: "shield-check",
        title: "QA & Hardening",
        description:
          "Automated tests, security review, and load testing make sure it holds up before launch day.",
      },
      {
        step: 6,
        icon: "rocket",
        title: "Launch & Support",
        description:
          "We deploy, monitor, and stay on call — with a clear AMC plan for everything that comes next.",
      },
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Prisma",
      "Tailwind CSS",
      "AWS",
    ],
    caseStudy: {
      client: "A regional distribution business",
      industry: "Wholesale & Distribution",
      challenge:
        "Order tracking lived across WhatsApp, paper, and three disconnected spreadsheets, so nobody trusted the numbers.",
      outcome:
        "We built a single operations portal with live order status, role-based access, and automated invoicing — adopted by the whole team in under a month.",
      metrics: [
        { value: "60%", label: "Less manual data entry" },
        { value: "4 weeks", label: "From kickoff to launch" },
        { value: "99.9%", label: "Uptime since go-live" },
      ],
    },
    pricing: [
      {
        id: "fixed",
        label: "Fixed Price",
        icon: "wallet",
        price: "From ₹1.5L",
        unit: "/ project",
        description:
          "Best when scope is well defined. One price, clear milestones, no surprises.",
        features: [
          "Locked scope & timeline",
          "Milestone-based payments",
          "Fixed delivery estimate",
          "30 days post-launch support",
        ],
        recommended: true,
      },
      {
        id: "hourly",
        label: "Hourly",
        icon: "clock",
        price: "₹1,800",
        unit: "/ hour",
        description:
          "Ideal for evolving scope or smaller enhancements to an existing build.",
        features: [
          "Pay only for time used",
          "Weekly time reports",
          "Flexible priorities",
          "Start in days, not weeks",
        ],
      },
      {
        id: "retainer",
        label: "Retainer",
        icon: "repeat",
        price: "From ₹80k",
        unit: "/ month",
        description:
          "A dedicated allocation each month for continuous product development.",
        features: [
          "Reserved engineering capacity",
          "Roadmap planning included",
          "Priority response SLA",
          "Cancel anytime",
        ],
      },
    ],
  },

  /* ----------------------------- SaaS Development ----------------- */
  {
    slug: "saas-development",
    title: "SaaS Development",
    eyebrow: "SaaS Development",
    headline: "Launch a SaaS product your customers can sign up for today",
    heroDescription:
      "We build complete multi-tenant platforms — authentication, subscription billing, admin tooling, and analytics — so you can go from idea to paying customers without stitching a dozen tools together.",
    metaTitle: "SaaS Development Services",
    metaDescription:
      "CreativeDox builds multi-tenant SaaS platforms with billing, authentication, and analytics built in — engineered to onboard paying customers from day one.",
    icon: "boxes",
    color: "text-violet-400",
    hex: "#a78bfa",
    gradient: "from-violet-500 to-purple-600",
    deliverables: [
      {
        icon: "building",
        title: "Multi-Tenant Architecture",
        description:
          "Isolated, secure workspaces per customer with shared infrastructure that scales economically.",
      },
      {
        icon: "credit-card",
        title: "Subscription Billing",
        description:
          "Plans, trials, proration, and invoicing wired to Razorpay or Stripe with dunning handled.",
      },
      {
        icon: "fingerprint",
        title: "Auth & Teams",
        description:
          "Sign-up, SSO, roles, and team invites so organizations can self-serve from the first click.",
      },
      {
        icon: "bar-chart",
        title: "Admin & Analytics",
        description:
          "Internal admin consoles plus product analytics to track activation, retention, and churn.",
      },
      {
        icon: "plug",
        title: "Public API & Webhooks",
        description:
          "A documented API and webhook system so customers can integrate your product into theirs.",
      },
      {
        icon: "bell",
        title: "Notifications & Email",
        description:
          "Transactional email, in-app alerts, and digests that keep users coming back to the product.",
      },
    ],
    process: [
      {
        step: 1,
        icon: "target",
        title: "Product Definition",
        description:
          "We pin down the core jobs-to-be-done and a lean MVP scope that gets you to market fastest.",
      },
      {
        step: 2,
        icon: "drafting-compass",
        title: "Platform Architecture",
        description:
          "Tenancy model, billing flows, and data design are mapped so the foundation scales cleanly.",
      },
      {
        step: 3,
        icon: "pen-tool",
        title: "Design System",
        description:
          "A reusable component library and onboarding flow built for conversion and quick activation.",
      },
      {
        step: 4,
        icon: "code",
        title: "Iterative Build",
        description:
          "Sprint by sprint we ship the core loop, then billing, admin, and analytics on top of it.",
      },
      {
        step: 5,
        icon: "rocket",
        title: "Beta & Launch",
        description:
          "We ship to early users, instrument feedback, and harden the platform for public launch.",
      },
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Stripe",
      "Razorpay",
      "Docker",
    ],
    caseStudy: {
      client: "An early-stage edtech founder",
      industry: "Education Technology",
      challenge:
        "They had a validated idea and design but no way to charge customers or manage schools as separate tenants.",
      outcome:
        "We delivered a multi-tenant platform with self-serve onboarding and subscription billing, and the product signed its first paying schools within weeks of launch.",
      metrics: [
        { value: "10 weeks", label: "Idea to public beta" },
        { value: "3 tiers", label: "Live subscription plans" },
        { value: "0 → 1", label: "First paying cohort" },
      ],
    },
    pricing: [
      {
        id: "fixed",
        label: "Fixed Price",
        icon: "wallet",
        price: "From ₹4L",
        unit: "/ MVP",
        description:
          "A defined MVP build that takes you from zero to a launchable product.",
        features: [
          "Scoped MVP feature set",
          "Billing & auth included",
          "Milestone payments",
          "Launch support window",
        ],
      },
      {
        id: "hourly",
        label: "Hourly",
        icon: "clock",
        price: "₹2,200",
        unit: "/ hour",
        description:
          "For evolving roadmaps where requirements shift sprint to sprint.",
        features: [
          "Pay for time used",
          "Weekly reporting",
          "Reprioritize anytime",
          "Senior engineers only",
        ],
      },
      {
        id: "retainer",
        label: "Retainer",
        icon: "repeat",
        price: "From ₹1.5L",
        unit: "/ month",
        description:
          "A dedicated squad that ships your roadmap continuously after launch.",
        features: [
          "Reserved team capacity",
          "Product & roadmap planning",
          "Priority SLA",
          "Scale up or down monthly",
        ],
        recommended: true,
      },
    ],
  },

  /* ----------------------------- Business Automation ------------- */
  {
    slug: "business-automation",
    title: "Business Automation",
    eyebrow: "Business Automation",
    headline: "Put your busywork on autopilot",
    heroDescription:
      "We identify the repetitive, error-prone tasks draining your team and replace them with dependable automated workflows — so data flows, reminders fire, and reports build themselves, every single day.",
    metaTitle: "Business Process Automation Services",
    metaDescription:
      "CreativeDox automates repetitive business operations with reliable workflows — data sync, reminders, approvals, and reporting that run themselves around the clock.",
    icon: "workflow",
    color: "text-emerald-400",
    hex: "#34d399",
    gradient: "from-emerald-500 to-teal-600",
    deliverables: [
      {
        icon: "repeat",
        title: "Workflow Automation",
        description:
          "Trigger-based flows that move work between systems without anyone copying and pasting.",
      },
      {
        icon: "file-text",
        title: "Document Generation",
        description:
          "Invoices, quotes, and reports generated and dispatched automatically from your live data.",
      },
      {
        icon: "bell",
        title: "Smart Reminders",
        description:
          "Payment, renewal, and follow-up nudges over WhatsApp, SMS, and email — never missed again.",
      },
      {
        icon: "list-checks",
        title: "Approval Pipelines",
        description:
          "Multi-step approvals with audit trails that keep things moving while staying accountable.",
      },
      {
        icon: "database",
        title: "Data Sync Jobs",
        description:
          "Scheduled jobs that reconcile data between Tally, sheets, and your apps overnight.",
      },
      {
        icon: "bar-chart",
        title: "Automated Reporting",
        description:
          "Daily and weekly dashboards delivered to inboxes — no one assembling them by hand.",
      },
    ],
    process: [
      {
        step: 1,
        icon: "search",
        title: "Process Audit",
        description:
          "We shadow how work happens today and pinpoint the highest-leverage tasks to automate first.",
      },
      {
        step: 2,
        icon: "drafting-compass",
        title: "Workflow Design",
        description:
          "Each automation is mapped end to end — triggers, conditions, and fallbacks — before we build.",
      },
      {
        step: 3,
        icon: "zap",
        title: "Build & Connect",
        description:
          "We wire your tools together with reliable, monitored automations and clear error handling.",
      },
      {
        step: 4,
        icon: "shield-check",
        title: "Test & Validate",
        description:
          "We run automations against real cases in parallel until you trust them to take over.",
      },
      {
        step: 5,
        icon: "trending-up",
        title: "Monitor & Optimize",
        description:
          "Dashboards track every run, and we tune the flows as your volume and processes evolve.",
      },
    ],
    technologies: [
      "Node.js",
      "Python",
      "n8n",
      "PostgreSQL",
      "Redis",
      "WhatsApp API",
      "Tally",
      "AWS Lambda",
    ],
    caseStudy: {
      client: "A multi-branch services company",
      industry: "Professional Services",
      challenge:
        "Staff spent hours every day chasing payments and rebuilding the same reports by hand across branches.",
      outcome:
        "We automated payment reminders over WhatsApp and built scheduled reporting jobs, freeing the team to focus on customers instead of spreadsheets.",
      metrics: [
        { value: "25 hrs", label: "Saved per week" },
        { value: "3x", label: "Faster collections" },
        { value: "0", label: "Reports built by hand" },
      ],
    },
    pricing: [
      {
        id: "fixed",
        label: "Fixed Price",
        icon: "wallet",
        price: "From ₹60k",
        unit: "/ workflow set",
        description:
          "A defined bundle of automations scoped, built, and handed over.",
        features: [
          "Scoped workflow set",
          "Documentation & handover",
          "30 days tuning support",
          "Monitoring dashboard",
        ],
        recommended: true,
      },
      {
        id: "hourly",
        label: "Hourly",
        icon: "clock",
        price: "₹1,600",
        unit: "/ hour",
        description:
          "For one-off automations or quick fixes to existing flows.",
        features: [
          "Pay for time used",
          "Fast turnaround",
          "No minimum commitment",
          "Transparent logs",
        ],
      },
      {
        id: "retainer",
        label: "Retainer",
        icon: "repeat",
        price: "From ₹40k",
        unit: "/ month",
        description:
          "Ongoing automation and monitoring as your operations expand.",
        features: [
          "Continuous new workflows",
          "Proactive monitoring",
          "Priority fixes",
          "Monthly optimization review",
        ],
      },
    ],
  },

  /* ----------------------------- API & Integration --------------- */
  {
    slug: "api-integration",
    title: "API & Integration",
    eyebrow: "API & Integrations",
    headline: "Make your tools finally talk to each other",
    heroDescription:
      "Accounting, payments, messaging, logistics, and your CRM should share one source of truth. We design APIs and integrations that connect your stack so data moves instantly and reliably between every system.",
    metaTitle: "API Development & Integration Services",
    metaDescription:
      "CreativeDox connects Tally, payment gateways, WhatsApp, CRMs, and more with robust APIs and integrations — one synchronized source of truth across your stack.",
    icon: "plug",
    color: "text-orange-400",
    hex: "#fb923c",
    gradient: "from-orange-500 to-amber-600",
    deliverables: [
      {
        icon: "network",
        title: "Third-Party Integrations",
        description:
          "Connect Tally, Razorpay, Shiprocket, WhatsApp, and CRMs into one coordinated flow.",
      },
      {
        icon: "code",
        title: "Custom REST APIs",
        description:
          "Well-documented, versioned APIs that expose your data securely to partners and apps.",
      },
      {
        icon: "repeat",
        title: "Webhooks & Events",
        description:
          "Event-driven pipelines that react the moment something changes — no polling, no lag.",
      },
      {
        icon: "database",
        title: "Data Migration",
        description:
          "Clean, validated migrations between platforms with zero data loss and full audit logs.",
      },
      {
        icon: "shield-check",
        title: "Secure Middleware",
        description:
          "Auth, rate limiting, and retries that keep integrations resilient under real-world load.",
      },
      {
        icon: "scan-line",
        title: "Sync Engines",
        description:
          "Two-way sync that keeps inventory, contacts, and orders consistent across every tool.",
      },
    ],
    process: [
      {
        step: 1,
        icon: "search",
        title: "Systems Mapping",
        description:
          "We inventory every system, its API limits, and the data that needs to move between them.",
      },
      {
        step: 2,
        icon: "drafting-compass",
        title: "Integration Design",
        description:
          "We design the contracts, auth, and failure handling so the integration is robust by design.",
      },
      {
        step: 3,
        icon: "plug",
        title: "Build & Connect",
        description:
          "We implement the middleware and endpoints with logging and retries baked in from the start.",
      },
      {
        step: 4,
        icon: "shield-check",
        title: "Test & Reconcile",
        description:
          "We validate against edge cases and reconcile records to guarantee nothing is dropped.",
      },
      {
        step: 5,
        icon: "trending-up",
        title: "Monitor & Maintain",
        description:
          "Alerting catches API changes and outages early, and we keep the connections healthy.",
      },
    ],
    technologies: [
      "Node.js",
      "TypeScript",
      "REST",
      "GraphQL",
      "Webhooks",
      "Razorpay",
      "Tally",
      "WhatsApp API",
    ],
    caseStudy: {
      client: "A growing D2C retailer",
      industry: "E-commerce & Retail",
      challenge:
        "Orders, accounting, and shipping lived in separate tools, so stock and invoices were constantly out of sync.",
      outcome:
        "We built a sync engine connecting their store, Tally, and courier partner, giving them one accurate view of inventory and finances in real time.",
      metrics: [
        { value: "5 tools", label: "Unified into one flow" },
        { value: "Real-time", label: "Inventory accuracy" },
        { value: "90%", label: "Fewer sync errors" },
      ],
    },
    pricing: [
      {
        id: "fixed",
        label: "Fixed Price",
        icon: "wallet",
        price: "From ₹75k",
        unit: "/ integration",
        description:
          "A defined integration scoped, built, tested, and documented end to end.",
        features: [
          "Scoped integration",
          "Full documentation",
          "Reconciliation testing",
          "30 days support",
        ],
        recommended: true,
      },
      {
        id: "hourly",
        label: "Hourly",
        icon: "clock",
        price: "₹2,000",
        unit: "/ hour",
        description:
          "For smaller connectors or tweaks to integrations you already run.",
        features: [
          "Pay for time used",
          "Quick turnaround",
          "Flexible scope",
          "Detailed logs",
        ],
      },
      {
        id: "retainer",
        label: "Retainer",
        icon: "repeat",
        price: "From ₹50k",
        unit: "/ month",
        description:
          "Ongoing maintenance and new connectors as your stack keeps growing.",
        features: [
          "Continuous new connectors",
          "API change monitoring",
          "Priority incident response",
          "Monthly health review",
        ],
      },
    ],
  },

  /* ----------------------------- AI Integration ------------------ */
  {
    slug: "ai-integration",
    title: "AI Integration",
    eyebrow: "AI Integration",
    headline: "Add real AI to the tools your team already uses",
    heroDescription:
      "Beyond the hype, we ship practical AI — assistants that answer from your own data, document intelligence that ends manual entry, and predictive insights that help you act sooner. Grounded, measured, and built to last.",
    metaTitle: "AI Integration & Automation Services",
    metaDescription:
      "CreativeDox integrates practical AI into your business — chat assistants, document intelligence, and predictive insights grounded in your own data and existing tools.",
    icon: "bot",
    color: "text-fuchsia-400",
    hex: "#e879f9",
    gradient: "from-fuchsia-500 to-pink-600",
    deliverables: [
      {
        icon: "message-circle",
        title: "AI Assistants",
        description:
          "Chat assistants that answer customer and staff questions from your own knowledge base.",
      },
      {
        icon: "scan-line",
        title: "Document Intelligence",
        description:
          "Extract data from invoices, IDs, and forms automatically — no more manual keying in.",
      },
      {
        icon: "search",
        title: "Semantic Search",
        description:
          "Natural-language search across documents and records that actually understands intent.",
      },
      {
        icon: "trending-up",
        title: "Predictive Insights",
        description:
          "Forecasting for demand, churn, and cash flow that turns history into a head start.",
      },
      {
        icon: "pen-tool",
        title: "Content Generation",
        description:
          "On-brand drafts for descriptions, replies, and reports with a human always in the loop.",
      },
      {
        icon: "bot",
        title: "Workflow Copilots",
        description:
          "AI woven into your existing flows to summarize, classify, and route work automatically.",
      },
    ],
    process: [
      {
        step: 1,
        icon: "target",
        title: "Use-Case Discovery",
        description:
          "We find where AI creates real value for you — and, just as importantly, where it doesn't.",
      },
      {
        step: 2,
        icon: "database",
        title: "Data Preparation",
        description:
          "We connect and structure your data so models answer from your reality, not guesswork.",
      },
      {
        step: 3,
        icon: "code",
        title: "Build & Ground",
        description:
          "We integrate the right models with retrieval and guardrails to keep responses accurate.",
      },
      {
        step: 4,
        icon: "shield-check",
        title: "Evaluate & Tune",
        description:
          "We measure quality against real examples and tune prompts and retrieval until it's reliable.",
      },
      {
        step: 5,
        icon: "rocket",
        title: "Deploy & Monitor",
        description:
          "We ship into your tools, then monitor cost, accuracy, and usage as adoption scales up.",
      },
    ],
    technologies: [
      "Claude",
      "OpenAI",
      "Python",
      "LangChain",
      "Vector DB",
      "Node.js",
      "FastAPI",
      "AWS",
    ],
    caseStudy: {
      client: "A mid-sized support team",
      industry: "Customer Support",
      challenge:
        "Agents spent most of their day answering the same questions and digging through scattered documentation.",
      outcome:
        "We deployed an AI assistant grounded in their help center and past tickets, deflecting routine queries and letting agents focus on the hard ones.",
      metrics: [
        { value: "45%", label: "Tickets auto-resolved" },
        { value: "2x", label: "Faster first response" },
        { value: "24/7", label: "Instant answers" },
      ],
    },
    pricing: [
      {
        id: "fixed",
        label: "Fixed Price",
        icon: "wallet",
        price: "From ₹1.2L",
        unit: "/ pilot",
        description:
          "A scoped AI pilot that proves value on one high-impact use case.",
        features: [
          "One scoped use case",
          "Grounded on your data",
          "Evaluation report",
          "30 days tuning support",
        ],
        recommended: true,
      },
      {
        id: "hourly",
        label: "Hourly",
        icon: "clock",
        price: "₹2,500",
        unit: "/ hour",
        description:
          "For experiments and enhancements to AI features already in place.",
        features: [
          "Pay for time used",
          "Rapid prototyping",
          "Flexible direction",
          "Senior AI engineers",
        ],
      },
      {
        id: "retainer",
        label: "Retainer",
        icon: "repeat",
        price: "From ₹90k",
        unit: "/ month",
        description:
          "Ongoing AI development, evaluation, and cost optimization at scale.",
        features: [
          "New AI capabilities monthly",
          "Quality & cost monitoring",
          "Model upgrade management",
          "Priority SLA",
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Lookups                                                            */
/* ------------------------------------------------------------------ */

/** Every service slug — used for static generation and validation. */
export function getServiceSlugs(): string[] {
  return SERVICE_DETAILS.map((service) => service.slug);
}

/** Find a single service detail by slug. */
export function getServiceDetail(slug: string): ServiceDetail | undefined {
  return SERVICE_DETAILS.find((service) => service.slug === slug);
}
