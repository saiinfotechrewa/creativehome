import type { BlogAuthor, BlogPost } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Authors                                                            */
/* ------------------------------------------------------------------ */

const RAJEEV: BlogAuthor = {
  name: "Rajeev Gupta",
  role: "Founder & CEO",
  avatar: "RG",
};
const PRIYA: BlogAuthor = {
  name: "Priya Sharma",
  role: "Product Lead",
  avatar: "PS",
};
const ANJALI: BlogAuthor = {
  name: "Anjali Verma",
  role: "Customer Success",
  avatar: "AV",
};
const VIKRAM: BlogAuthor = {
  name: "Vikram Singh",
  role: "Head of Marketing",
  avatar: "VS",
};

/* ------------------------------------------------------------------ */
/*  Categories                                                         */
/* ------------------------------------------------------------------ */

/** Ordered category labels — "All" is prepended by the listing UI. */
export const BLOG_CATEGORIES = [
  "Automation",
  "CRM & Sales",
  "Education",
  "WhatsApp Marketing",
  "Product Updates",
  "Cable TV",
] as const;

/* ------------------------------------------------------------------ */
/*  Posts                                                              */
/* ------------------------------------------------------------------ */

/** Sample editorial content for the CreativeDox blog. */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "5-signs-your-business-needs-automation-software",
    title: "5 Signs Your Business Needs Automation Software",
    excerpt:
      "Manual processes feel manageable — until they quietly cap your growth. Here are five unmistakable signs it's time to automate.",
    category: "Automation",
    author: RAJEEV,
    date: "2026-05-28",
    readTime: 7,
    icon: "workflow",
    gradient: "from-blue-500 to-indigo-600",
    metaTitle: "5 Signs Your Business Needs Automation Software",
    metaDescription:
      "Spreadsheets breaking, data living in silos, your team drowning in repetitive work? Here are five clear signs your business is ready for automation software.",
    tags: ["Automation", "Productivity", "Small Business"],
    content: [
      {
        type: "paragraph",
        text: "Every growing business hits the same wall. The systems that carried you from your first customer to your hundredth — the spreadsheets, the WhatsApp groups, the notebook by the till — start to crack under the weight of success. Work that used to take minutes now takes hours, and nobody is quite sure where the time went. Automation software exists to push that wall further away, but how do you know you've actually reached it? Here are five signs that show up again and again in the businesses we work with.",
      },
      { type: "heading", text: "1. Your team re-enters the same data twice" },
      {
        type: "paragraph",
        text: "If an order is typed into one app, then copied into a billing sheet, then typed again into an accounting tool, you are paying skilled people to be human copy-paste machines. Double entry is slow, but worse, it is where errors are born — a wrong figure here, a missed zero there. When you notice staff maintaining two versions of the same information, that duplicated effort is the clearest possible signal that a connected system would pay for itself quickly.",
      },
      { type: "heading", text: "2. Reports take days, not seconds" },
      {
        type: "paragraph",
        text: 'Ask yourself a simple question: how long does it take to find out exactly how much money is outstanding right now? In an automated business the answer is seconds, on a dashboard. If the honest answer is "let me check at month-end," you are flying blind for twenty-nine days out of thirty. Decisions made on stale numbers are guesses dressed up as strategy.',
      },
      { type: "heading", text: "3. Things fall through the cracks" },
      {
        type: "paragraph",
        text: "A lead that nobody followed up. An invoice that never got sent. A renewal that lapsed because the reminder lived only in someone's memory. Each gap is small, but together they leak real revenue. Automation doesn't get tired, doesn't go on leave, and doesn't forget — every task triggers the next one whether or not anyone is watching.",
      },
      {
        type: "list",
        items: [
          "Follow-ups that depend on someone remembering to send them",
          "Payment reminders sent manually, if at all",
          "Approvals stuck in an inbox for days",
          "Customers who never hear from you after the first sale",
        ],
      },
      { type: "heading", text: "4. Growth means hiring, not scaling" },
      {
        type: "paragraph",
        text: "There is a difference between scaling and simply adding bodies. If every 20% increase in orders forces you to hire another admin just to keep the paperwork moving, your costs are rising in lockstep with your revenue — and your margins are going nowhere. Automated workflows let the same team handle two or three times the volume, because the software absorbs the repetitive load.",
      },
      {
        type: "quote",
        text: "The goal of automation isn't to remove people. It's to remove the boring work so your people can do the work only people can do.",
      },
      { type: "heading", text: "5. You can't take a day off" },
      {
        type: "paragraph",
        text: "Perhaps the most personal sign of all. If the business stops the moment you step away — because only you know the passwords, the process, or the customer history — then you don't own a business, you own a job that owns you. Documented, automated systems turn tribal knowledge into something that runs without you, which is the first real step toward a company that can grow beyond its founder.",
      },
      { type: "heading", text: "Where to start" },
      {
        type: "paragraph",
        text: "You don't need to automate everything overnight. Pick the single process that causes the most pain — usually billing, lead follow-up, or attendance — and fix that first. A focused win builds momentum and trust with your team far better than a sweeping overhaul. If two or more of these signs felt uncomfortably familiar, it's worth a conversation. CreativeDox builds ready-to-use software for exactly these problems, and a free consultation costs you nothing but twenty minutes.",
      },
    ],
  },

  {
    slug: "how-to-choose-the-right-crm-for-your-small-business",
    title: "How to Choose the Right CRM for Your Small Business",
    excerpt:
      "A CRM should make selling easier, not add another chore. Here's a practical framework for picking one that your team will actually use.",
    category: "CRM & Sales",
    author: PRIYA,
    date: "2026-05-14",
    readTime: 8,
    icon: "users",
    gradient: "from-green-500 to-emerald-600",
    metaTitle: "How to Choose the Right CRM for Your Small Business",
    metaDescription:
      "Confused by CRM options? This practical guide walks small business owners through the features that matter, the traps to avoid, and how to pick a CRM your team will use.",
    tags: ["CRM", "Sales", "Small Business"],
    content: [
      {
        type: "paragraph",
        text: "A CRM — customer relationship management software — is meant to be the memory of your sales team. Every enquiry, every conversation, every promise to call back lives in one place, so deals stop slipping through the gaps. That's the theory. In practice, plenty of small businesses buy a CRM, struggle with it for a month, and quietly drift back to spreadsheets and sticky notes. The difference between those two outcomes is rarely the software's feature list. It's the fit. Here's how to choose a CRM that sticks.",
      },
      { type: "heading", text: "Start with the problem, not the product" },
      {
        type: "paragraph",
        text: "Before you watch a single demo, write down the three things going wrong today. Maybe leads from Facebook and your website land in different places. Maybe nobody knows which salesperson owns which customer. Maybe follow-ups depend entirely on memory. A good CRM should visibly fix your specific three problems. If a tool dazzles you with features that solve problems you don't have, that's a warning sign, not a selling point.",
      },
      { type: "heading", text: "The features that actually matter" },
      {
        type: "paragraph",
        text: "Ignore the 200-item feature comparison. For most small businesses, only a handful of capabilities move the needle:",
      },
      {
        type: "list",
        items: [
          "Automatic lead capture from your website, ads, and WhatsApp — so nothing depends on manual entry",
          "A clear visual pipeline that shows every deal's stage at a glance",
          "Reminders and follow-up tasks that nag your team automatically",
          "WhatsApp and call integration, because that's how Indian customers actually talk",
          "Simple reports that show conversion rate and salesperson performance",
        ],
      },
      {
        type: "paragraph",
        text: "If a CRM nails those five, the rest is mostly polish. Notice that none of them are exotic — they are the daily mechanics of selling, made reliable.",
      },
      { type: "heading", text: "Will your team actually use it?" },
      {
        type: "paragraph",
        text: "This is the question that decides everything, and it's the one most buyers skip. A CRM that your salespeople resent is worse than no CRM at all, because the data inside it will be incomplete and you'll make decisions on half-truths. During any trial, put it in front of your least tech-savvy team member. If they can log a lead and update a deal in under a minute without a manual, you've found a keeper. If they sigh and reach for the spreadsheet, keep looking.",
      },
      {
        type: "quote",
        text: "The best CRM is the one your team opens every morning without being told to. Adoption beats features every single time.",
      },
      { type: "heading", text: "Watch the total cost, not the sticker price" },
      {
        type: "paragraph",
        text: "A CRM that's cheap per user but charges extra for WhatsApp, for reports, for every integration, and for onboarding can quietly cost more than a fairly-priced all-in-one. Ask for the full picture: setup fees, training, data migration, and what happens to the price when you add users. For a small business, predictable pricing matters more than a low headline number.",
      },
      { type: "heading", text: "Don't forget the exit" },
      {
        type: "paragraph",
        text: "Before you commit, confirm you can export your own data whenever you want. Your customer list is one of your most valuable assets, and it should never be held hostage by a vendor. A trustworthy provider makes leaving easy — which, paradoxically, is a strong reason to stay.",
      },
      { type: "heading", text: "A simple way to decide" },
      {
        type: "ordered",
        items: [
          "List your three biggest sales problems today",
          "Shortlist two or three CRMs that clearly solve them",
          "Run a real trial with real leads for two weeks",
          "Let your hardest-to-please team member be the judge",
          "Choose the one with the simplest path from lead to closed deal",
        ],
      },
      {
        type: "paragraph",
        text: "CreativeDox CRM was built around exactly this philosophy: capture every lead automatically, make follow-ups effortless, and keep WhatsApp at the centre where Indian sales conversations actually happen. If you'd like to see whether it fits your three problems, book a free consultation and we'll walk through your pipeline together.",
      },
    ],
  },

  {
    slug: "digital-attendance-why-schools-are-making-the-switch",
    title: "Digital Attendance: Why Schools Are Making the Switch",
    excerpt:
      "Paper registers are quietly costing schools time, accuracy, and parent trust. Here's why digital attendance has become the new normal.",
    category: "Education",
    author: ANJALI,
    date: "2026-04-30",
    readTime: 6,
    icon: "graduation-cap",
    gradient: "from-indigo-500 to-blue-600",
    metaTitle: "Digital Attendance: Why Schools Are Making the Switch",
    metaDescription:
      "From faster roll calls to instant parent alerts, see why schools across India are replacing paper attendance registers with digital attendance systems.",
    tags: ["Education", "Attendance", "Schools"],
    content: [
      {
        type: "paragraph",
        text: "For generations, the school day has started the same way: a teacher calls out names, ticks a paper register, and the day begins. It works — until you count the hidden costs. Fifteen minutes of every class lost to roll call. Registers that go missing or get damaged. Parents who only learn their child skipped school when it's far too late. Across India, schools are quietly retiring the paper register, and the reasons are practical rather than fashionable.",
      },
      { type: "heading", text: "Roll call in thirty seconds" },
      {
        type: "paragraph",
        text: "The most immediate win is time. A teacher with a phone or tablet can mark an entire class present in the time it used to take to find the right page. Across a school day, those reclaimed minutes add up to real teaching time — easily a full extra period each week per class. Multiply that across every classroom and the productivity gain is enormous, and it costs nothing extra once the system is in place.",
      },
      { type: "heading", text: "Parents in the loop, instantly" },
      {
        type: "paragraph",
        text: "This is the feature that wins parents over. The moment a child is marked absent, an automatic SMS or WhatsApp message reaches the parent. No child can bunk school without a guardian knowing within minutes. For working parents, that peace of mind is priceless, and for schools it transforms a difficult safety conversation into a solved problem.",
      },
      {
        type: "quote",
        text: "The first time a parent called to thank us for an absence alert, we knew the paper register was never coming back.",
      },
      { type: "heading", text: "Accuracy that holds up" },
      {
        type: "paragraph",
        text: "Paper records fade, tear, and get fudged. Digital attendance creates a permanent, time-stamped record that can't be quietly edited after the fact. When the time comes for board eligibility, scholarship verification, or simply answering a parent's question about last month, the data is right there — searchable, exportable, and trustworthy.",
      },
      { type: "heading", text: "What a good system gives you" },
      {
        type: "list",
        items: [
          "Class-wise and student-wise attendance in a single tap",
          "Automatic absence alerts to parents over WhatsApp or SMS",
          "Monthly percentage reports with no manual counting",
          "Biometric or mobile check-in for staff as well as students",
          "A clear audit trail for board and inspection requirements",
        ],
      },
      { type: "heading", text: "But isn't it complicated?" },
      {
        type: "paragraph",
        text: "This is the worry we hear most, and it's understandable — schools are busy places and teachers are not IT specialists. The honest answer is that modern attendance apps are built to be simpler than the register they replace. If a teacher can use WhatsApp, they can mark attendance. The training takes an afternoon, not a term, and the youngest staff members usually end up teaching the rest.",
      },
      { type: "heading", text: "The bigger picture" },
      {
        type: "paragraph",
        text: "Attendance is often a school's first step into digital administration, and it's a smart one because the benefit is so visible. Once attendance, fees, and exams live in one connected system, a principal can see the whole school on a single screen and parents get one trusted channel for everything. The paper register served us well for a hundred years — but the schools making the switch aren't looking back. If yours is considering it, CreativeDox offers a free walkthrough tailored to how your school actually runs.",
      },
    ],
  },

  {
    slug: "whatsapp-marketing-the-complete-guide-for-indian-businesses",
    title: "WhatsApp Marketing: The Complete Guide for Indian Businesses",
    excerpt:
      "With near-universal reach and sky-high open rates, WhatsApp is the most powerful marketing channel most Indian businesses aren't using properly. Here's how to do it right.",
    category: "WhatsApp Marketing",
    author: VIKRAM,
    date: "2026-04-16",
    readTime: 9,
    icon: "message-circle",
    gradient: "from-[#25d366] to-green-600",
    metaTitle: "WhatsApp Marketing: The Complete Guide for Indian Businesses",
    metaDescription:
      "A practical, compliance-friendly guide to WhatsApp marketing for Indian businesses — the official Business API, broadcast campaigns, chatbots, and the mistakes to avoid.",
    tags: ["WhatsApp", "Marketing", "Automation"],
    content: [
      {
        type: "paragraph",
        text: "Email open rates hover around 20%. SMS gets lost in spam folders. Meanwhile, the average WhatsApp message is opened within minutes and read more than 90% of the time. For Indian businesses, where WhatsApp is effectively the default way people communicate, this is the most valuable marketing channel available — and most companies are barely scratching its surface. This guide covers how to use it properly, profitably, and without getting your number banned.",
      },
      { type: "heading", text: "Personal app vs. Business API" },
      {
        type: "paragraph",
        text: "The first thing to understand is that broadcasting offers from your personal WhatsApp is a fast route to a blocked number. The right foundation is the official WhatsApp Business API, which is designed for businesses to message at scale within Meta's rules. It unlocks verified branding, automation, team inboxes, and — crucially — the ability to send campaigns without risking your account. Everything that follows assumes you're on the official API.",
      },
      { type: "heading", text: "Build a list the honest way" },
      {
        type: "paragraph",
        text: "WhatsApp marketing rewards consent and punishes spam. Build your audience from people who actually want to hear from you: customers who opted in at checkout, leads who messaged you first, visitors who clicked a \"Chat on WhatsApp\" button. A smaller list of interested people will always outperform a large list of strangers, and it keeps you on the right side of both Meta's policy and your customers' patience.",
      },
      {
        type: "quote",
        text: "On WhatsApp, relevance is everything. One useful message a week builds trust; one irrelevant message a day gets you blocked.",
      },
      { type: "heading", text: "Campaigns that actually work" },
      {
        type: "paragraph",
        text: "The businesses winning on WhatsApp treat it as a conversation channel, not a billboard. The highest-performing message types tend to be:",
      },
      {
        type: "list",
        items: [
          "Order and delivery updates — expected, useful, and a natural place to add a gentle offer",
          "Personalised offers based on what a customer actually bought before",
          "Payment and renewal reminders that save customers from late fees",
          "Festival and seasonal greetings that feel human, not corporate",
          "Re-engagement nudges to customers who haven't bought in a while",
        ],
      },
      { type: "heading", text: "Let chatbots handle the first reply" },
      {
        type: "paragraph",
        text: 'A huge share of customer messages are simple: "What are your timings?", "Is this in stock?", "Where\'s my order?". A no-code chatbot can answer these instantly, around the clock, and pass anything complex to a human. The result is faster replies, happier customers, and a team that spends its time on conversations that genuinely need a person. Speed of response is itself a marketing advantage — the business that replies in ten seconds usually wins the sale.',
      },
      { type: "heading", text: "Measure what matters" },
      {
        type: "paragraph",
        text: "One of the underrated strengths of the Business API is clear analytics. You can see exactly how many messages were delivered, opened, and clicked, and tie campaigns back to actual orders. This turns marketing from a guessing game into something you can tune. Send, measure, refine, repeat — and quietly retire the campaigns that don't earn their place.",
      },
      { type: "heading", text: "Common mistakes to avoid" },
      {
        type: "ordered",
        items: [
          "Blasting your personal number until it gets banned",
          "Messaging people who never opted in",
          "Sending the same generic offer to your entire list",
          "Ignoring replies — WhatsApp is a two-way channel, not a megaphone",
          "Over-messaging until customers mute or block you",
        ],
      },
      {
        type: "paragraph",
        text: "Done well, WhatsApp marketing combines the reach of mass media with the intimacy of a personal chat — a rare and powerful pairing. CreativeDox WhatsApp runs on the official Business API, with broadcasts, chatbots, and a shared team inbox built in. If you want to turn your customer conversations into a genuine sales channel, book a free consultation and we'll map out a campaign plan for your business.",
      },
    ],
  },

  {
    slug: "creativedox-crm-2-new-features-and-improvements",
    title: "CreativeDox CRM 2.0: New Features and Improvements",
    excerpt:
      "Our biggest CRM release yet — a faster pipeline, smarter automations, and a reimagined WhatsApp inbox. Here's everything that's new.",
    category: "Product Updates",
    author: PRIYA,
    date: "2026-06-04",
    readTime: 6,
    icon: "rocket",
    gradient: "from-purple-500 to-violet-600",
    metaTitle: "CreativeDox CRM 2.0: New Features and Improvements",
    metaDescription:
      "CreativeDox CRM 2.0 is here — a rebuilt pipeline, no-code automations, a unified WhatsApp inbox, and sharper reporting. See what's new and how to upgrade.",
    tags: ["Product Updates", "CRM", "Release Notes"],
    content: [
      {
        type: "paragraph",
        text: "Over the past year, thousands of businesses have made CreativeDox CRM the home of their sales process, and your feedback has shaped every line of this release. CRM 2.0 is the biggest update we've ever shipped — faster, smarter, and built around the workflows you told us mattered most. Here's a tour of what's new, and how to make the most of it.",
      },
      { type: "heading", text: "A rebuilt, faster pipeline" },
      {
        type: "paragraph",
        text: "We rewrote the deal pipeline from the ground up. Dragging a deal between stages is now instant, even with thousands of open opportunities, and the board loads in a fraction of the time it used to. You can now create custom pipeline stages per team, so your sales and service teams can each work the way that suits them without stepping on each other's process.",
      },
      { type: "heading", text: "No-code automations" },
      {
        type: "paragraph",
        text: 'This is the headline feature. You can now build "if this, then that" rules without writing a single line of code. When a lead reaches a certain stage, automatically assign it, send a WhatsApp message, create a follow-up task, or notify a manager — all from a simple visual builder. The automations our early-access customers built in the first week alone have saved them hundreds of hours of manual work.',
      },
      {
        type: "list",
        items: [
          "Auto-assign leads by source, location, or product interest",
          "Trigger WhatsApp and email follow-ups on stage changes",
          "Create reminder tasks so no deal goes cold",
          "Escalate stalled deals to a manager automatically",
        ],
      },
      { type: "heading", text: "A unified WhatsApp inbox" },
      {
        type: "paragraph",
        text: "Your team can now see and reply to every customer WhatsApp conversation directly inside the CRM, with the full deal history right beside the chat. No more switching apps or losing context. Messages, notes, and deal stage all live on one screen, so whoever picks up the conversation has the complete picture.",
      },
      {
        type: "quote",
        text: "Our reps used to keep eight tabs open. Now it's one. CRM 2.0 put the whole customer in a single view.",
      },
      { type: "heading", text: "Sharper reporting" },
      {
        type: "paragraph",
        text: "The new reporting suite answers the questions owners actually ask. Conversion rates by source, average time to close, salesperson leaderboards, and revenue forecasts now render in real time, and every report can be exported or scheduled to land in your inbox each Monday morning. Decisions that used to wait for a month-end summary can now be made on today's numbers.",
      },
      { type: "heading", text: "Faster, calmer, and easier on the eyes" },
      {
        type: "paragraph",
        text: "Beyond the big features, 2.0 brings a refreshed interface that's quicker to navigate and far gentler in low light, plus dozens of small refinements that came straight from your support tickets. Keyboard shortcuts, bulk actions, and a smarter global search all make the everyday work feel lighter.",
      },
      { type: "heading", text: "How to upgrade" },
      {
        type: "paragraph",
        text: "CRM 2.0 is rolling out to all existing customers at no extra cost over the coming weeks — there's nothing to install, and your data carries over untouched. If you'd like an early walkthrough for your team, or you're new to CreativeDox and want to see 2.0 in action, book a free consultation and we'll give you a guided tour tailored to how you sell.",
      },
    ],
  },

  {
    slug: "cable-tv-billing-software-solving-the-collection-problem",
    title: "Cable TV Billing Software: Solving the Collection Problem",
    excerpt:
      "For cable operators, the real challenge isn't channels — it's collections. Here's how billing software turns scattered dues into reliable revenue.",
    category: "Cable TV",
    author: RAJEEV,
    date: "2026-03-22",
    readTime: 7,
    icon: "tv",
    gradient: "from-cyan-500 to-sky-600",
    metaTitle: "Cable TV Billing Software: Solving the Collection Problem",
    metaDescription:
      "Cable operators lose lakhs to leaky collections every year. Learn how cable TV billing software gives you live dues, agent accountability, and automatic reminders.",
    tags: ["Cable TV", "Billing", "Collections"],
    content: [
      {
        type: "paragraph",
        text: "Ask any cable operator what keeps them up at night, and it's rarely the channels or the hardware. It's collections. With thousands of subscribers spread across dozens of areas, each paying a small monthly amount through field agents, the money has a hundred places to leak. A missed entry here, a forgotten subscriber there, an agent's cash that takes a week to reach the office — and by month-end nobody truly knows what's owed. This is the problem cable TV billing software was built to solve.",
      },
      { type: "heading", text: "The hidden cost of paper collections" },
      {
        type: "paragraph",
        text: "On paper, a cable business looks simple: count subscribers, multiply by the package rate, collect. In reality, the gap between what should be collected and what actually reaches the office can be alarmingly wide. Subscribers who quietly stopped paying but kept the connection. Agents who collected but recorded late. Disputes with no record to settle them. Each leak is small, but across a few thousand connections it adds up to lakhs a year — money you earned but never saw.",
      },
      { type: "heading", text: "Live dues, area by area" },
      {
        type: "paragraph",
        text: "The single biggest change billing software brings is visibility. Instead of waiting for month-end, an operator can open a dashboard and see exactly who has paid, who hasn't, and how much is outstanding — broken down by area and by agent, updated as payments come in. When you can see a problem in real time, you can fix it in real time, instead of discovering it weeks too late.",
      },
      {
        type: "quote",
        text: "The month we could finally see our real outstanding, live, our collection rate jumped forty percent. We weren't working harder — we just stopped guessing.",
      },
      { type: "heading", text: "Agent accountability, without the friction" },
      {
        type: "paragraph",
        text: "Field agents are the lifeblood of a cable business, and good software supports them rather than policing them. Each agent marks collections on their phone the moment they happen, so the record is created at the doorstep, not from memory hours later. The office sees each agent's collections live, cash reconciliation becomes a two-minute job, and honest agents are protected by a clear, undeniable record of their work.",
      },
      { type: "heading", text: "Reminders that collect for you" },
      {
        type: "paragraph",
        text: "Perhaps the quietest hero of all: automatic WhatsApp due reminders. Before a payment is even late, the subscriber gets a friendly nudge with the amount and a way to pay. It costs nothing to send, it spares your agents awkward conversations, and it dramatically reduces the number of subscribers who simply forgot. A polite reminder at the right moment recovers more money than any amount of chasing afterward.",
      },
      { type: "heading", text: "What good cable billing software includes" },
      {
        type: "list",
        items: [
          "Subscriber and set-top-box management in one place",
          "Agent-wise, area-wise collection tracking in real time",
          "Automatic monthly invoicing for every package",
          "WhatsApp and SMS due reminders before payments lapse",
          "Live outstanding reports you can trust at any moment",
        ],
      },
      { type: "heading", text: "From leaky to reliable" },
      {
        type: "paragraph",
        text: "The transformation isn't about working your agents harder or squeezing your subscribers. It's about plugging the leaks that were quietly draining a business you'd already built. When every collection is recorded at the source, every due is visible, and every reminder sends itself, the money you earned actually arrives. CreativeDox Cable TV brings all of this together in one app built for Indian operators — and a free consultation will show you exactly where your current collections are leaking.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Lookups                                                            */
/* ------------------------------------------------------------------ */

/** All posts, newest first. */
export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
}

/** Every post slug — for `generateStaticParams`. */
export function getPostSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}

/** Look up a single post by slug. */
export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/** The `n` most recent posts, optionally excluding one slug. */
export function getRecentPosts(n = 4, excludeSlug?: string): BlogPost[] {
  return getAllPosts()
    .filter((post) => post.slug !== excludeSlug)
    .slice(0, n);
}

/**
 * Up to `n` posts related to the given one — same category first,
 * then the most recent others to fill any remaining slots.
 */
export function getRelatedPosts(post: BlogPost, n = 3): BlogPost[] {
  const sameCategory = getAllPosts().filter(
    (p) => p.slug !== post.slug && p.category === post.category
  );
  const others = getAllPosts().filter(
    (p) => p.slug !== post.slug && p.category !== post.category
  );
  return [...sameCategory, ...others].slice(0, n);
}

/** Count of posts per category, for sidebar badges. */
export function getCategoryCounts(): Record<string, number> {
  return BLOG_POSTS.reduce<Record<string, number>>((acc, post) => {
    acc[post.category] = (acc[post.category] ?? 0) + 1;
    return acc;
  }, {});
}
