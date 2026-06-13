import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/motion";
import { JsonLd } from "@/components/shared/json-ld";
import { getIcon } from "@/lib/icons";
import { SITE_CONFIG } from "@/lib/constants";
import { getSolution } from "@/data/solutions";
import type { IconName } from "@/lib/icons";

/* ------------------------------------------------------------------ */
/*  Accent + content                                                   */
/*                                                                     */
/*  Custom Development is a service-style offering (project-priced, not */
/*  a monthly SaaS), so it gets a bespoke page rather than the          */
/*  /solutions/[slug] product template. The dynamic [slug] route never  */
/*  generates this slug, so this static segment owns the URL.           */
/* ------------------------------------------------------------------ */

const SOLUTION = getSolution("custom-development");
const HEX = SOLUTION?.hex ?? "#fbbf24";
const GRADIENT = SOLUTION?.gradient ?? "from-amber-500 to-orange-600";
const COLOR = SOLUTION?.color ?? "text-amber-400";

const URL = `${SITE_CONFIG.url}/solutions/custom-development`;

interface Card {
  icon: IconName;
  title: string;
  description: string;
}

const DELIVERABLES: Card[] = [
  {
    icon: "layers",
    title: "Web Applications",
    description:
      "Operations portals, dashboards, and customer-facing platforms engineered around your exact workflows.",
  },
  {
    icon: "smartphone",
    title: "Mobile Apps",
    description:
      "Android & iOS apps for your staff and customers — built once, polished on every device.",
  },
  {
    icon: "plug",
    title: "APIs & Integrations",
    description:
      "Connect Tally, payment gateways, WhatsApp, and your existing tools into one source of truth.",
  },
  {
    icon: "repeat",
    title: "Legacy Modernization",
    description:
      "Rebuild ageing desktop or spreadsheet systems into fast, secure, cloud-based software.",
  },
  {
    icon: "cloud",
    title: "Cloud & DevOps",
    description:
      "Managed hosting, CI/CD, daily backups, and monitoring so your product stays fast and online.",
  },
  {
    icon: "users",
    title: "Dedicated Teams",
    description:
      "Embed a vetted squad of engineers and designers that ships your roadmap sprint after sprint.",
  },
];

interface Step {
  step: number;
  icon: IconName;
  title: string;
  description: string;
}

const PROCESS: Step[] = [
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
      "A polished, on-brand interface with a component system that stays consistent as you grow.",
  },
  {
    step: 4,
    icon: "code",
    title: "Build & Iterate",
    description:
      "Two-week sprints ship working features you can review continuously — no big-bang surprises.",
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
];

const TECHNOLOGIES = [
  "Next.js",
  "React",
  "React Native",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Prisma",
  "Tailwind CSS",
  "AWS",
  "Docker",
  "WhatsApp API",
];

const CAPABILITIES = SOLUTION?.features ?? [];

export const metadata: Metadata = {
  title: "Custom Software Development",
  description:
    "Tailor-made software built around your exact workflows — web apps, mobile apps, portals, and integrations. CreativeDox handles architecture, delivery, and long-term support.",
  alternates: { canonical: URL },
  openGraph: {
    title: `Custom Software Development | ${SITE_CONFIG.name}`,
    description:
      "Web apps, mobile apps, portals, and integrations designed around your exact workflows — from discovery to launch and AMC.",
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    images: [{ url: SITE_CONFIG.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Software Development",
    description:
      "Tailor-made software built around your exact workflows — by CreativeDox.",
  },
};

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${URL}#service`,
        name: "Custom Software Development",
        serviceType: "Custom Software Development",
        description:
          "Tailor-made web apps, mobile apps, portals, and integrations built around your workflows.",
        url: URL,
        provider: {
          "@type": "Organization",
          name: SITE_CONFIG.name,
          url: SITE_CONFIG.url,
        },
        areaServed: { "@type": "Country", name: "India" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Solutions",
            item: `${SITE_CONFIG.url}/#solutions`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Custom Development",
            item: URL,
          },
        ],
      },
    ],
  };
}

export default function CustomDevelopmentPage() {
  return (
    <>
      <JsonLd data={jsonLd()} />

      {/* ---------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden pt-36 pb-20 sm:pt-40 sm:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
          style={{ background: HEX }}
        />
        <Container className="relative">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Reveal>
              <span
                className={`border-border bg-card inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium ${COLOR}`}
              >
                Custom Development
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="text-foreground mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
                Tailor-made software, built around how you actually work
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
                When off-the-shelf doesn&apos;t fit, we design and build it — web
                apps, mobile apps, portals, and integrations. You own the
                roadmap; we handle architecture, delivery, and support.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <ButtonLink
                  href="/book-consultation"
                  size="lg"
                  variant="primary"
                  iconRight={<ArrowRight className="h-4 w-4" />}
                >
                  Start a Project
                </ButtonLink>
                <ButtonLink href="/services" size="lg" variant="secondary">
                  Explore Services
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* -------------------------------------------------- What we build */}
      <section className="py-24 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="What We Build"
            title="From a single portal to a full product suite"
            description="Whatever the shape of the problem, we have shipped something like it before."
          />
          <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DELIVERABLES.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <StaggerItem key={item.title} className="h-full">
                  <div
                    style={{ "--accent": `${HEX}4d` } as CSSProperties}
                    className="group bg-card relative flex h-full flex-col rounded-2xl border border-[#1e1e22] p-7 transition-colors duration-200 hover:border-(--accent)"
                  >
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-xl ${COLOR}`}
                      style={{
                        backgroundColor: `${HEX}1a`,
                        boxShadow: `0 0 24px -6px ${HEX}66`,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-foreground mt-5 text-xl font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-muted mt-2 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </section>

      {/* -------------------------------------------------------- Process */}
      <section className="bg-card/30 border-border border-y py-24 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="How We Work"
            title="A delivery process with no big-bang surprises"
            description="Every engagement runs on the same transparent rhythm — you see working software early and often."
          />
          <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <StaggerItem key={item.step} className="h-full">
                  <div className="bg-card border-border relative flex h-full flex-col rounded-2xl border p-7">
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-lg ${COLOR}`}
                        style={{ backgroundColor: `${HEX}1a` }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-muted text-sm font-semibold tabular-nums">
                        Step {item.step}
                      </span>
                    </div>
                    <h3 className="text-foreground mt-5 text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-muted mt-2 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </section>

      {/* ---------------------------------------------- Capabilities + tech */}
      <section className="py-24 sm:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Capabilities"
                title="Everything a custom build needs"
              />
              <Stagger className="mt-10 grid gap-3 sm:grid-cols-2">
                {CAPABILITIES.map((feature) => (
                  <StaggerItem key={feature}>
                    <div className="border-border bg-card flex items-start gap-3 rounded-lg border p-4">
                      <span
                        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                        style={{ backgroundColor: `${HEX}26`, color: HEX }}
                      >
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-3 w-3"
                          aria-hidden
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="text-muted-foreground text-sm leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            <div>
              <SectionHeading
                align="left"
                eyebrow="Tech Stack"
                title="Modern, proven, and built to last"
                description="We pick boring, dependable technology over hype — so your product is fast today and maintainable for years."
              />
              <Reveal delay={0.1}>
                <div className="mt-10 flex flex-wrap gap-2.5">
                  {TECHNOLOGIES.map((tech) => (
                    <span
                      key={tech}
                      className="border-border bg-card text-muted-foreground hover:text-foreground rounded-lg border px-4 py-2 text-sm transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------ CTA */}
      <section className="pb-28">
        <Container>
          <Reveal>
            <div
              className={`relative overflow-hidden rounded-3xl bg-linear-to-br ${GRADIENT} p-10 text-center sm:p-16`}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-black/30"
              />
              <div className="relative mx-auto flex max-w-2xl flex-col items-center">
                <h2 className="text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
                  Have something specific in mind?
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
                  Book a free consultation and we&apos;ll scope it with you —
                  timeline, milestones, and a clear estimate, no obligation.
                </p>
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                  <ButtonLink
                    href="/book-consultation"
                    size="lg"
                    variant="secondary"
                    className="border-white/30 bg-white text-zinc-900 hover:bg-white/90"
                    iconRight={<ArrowRight className="h-4 w-4" />}
                  >
                    Book Free Consultation
                  </ButtonLink>
                  <ButtonLink
                    href="/case-studies"
                    size="lg"
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                  >
                    See Our Work
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
