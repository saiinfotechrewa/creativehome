"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Flag, Boxes, TrendingUp, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { EASE } from "@/lib/animations";

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const MILESTONES: Milestone[] = [
  {
    year: "2019",
    title: "Founded",
    description:
      "CreativeDox started in Rewa with a simple belief — small and mid-size businesses deserve the same calibre of software the big players take for granted.",
    icon: Flag,
  },
  {
    year: "2021",
    title: "Products",
    description:
      "We shipped our first suite — CRM, GST accounting, attendance, and WhatsApp marketing — purpose-built for how Indian businesses actually operate day to day.",
    icon: Boxes,
  },
  {
    year: "Today",
    title: "Growth",
    description:
      "500+ businesses now run on CreativeDox, from single shops to multi-branch operations. We keep shipping, keep listening, and keep automating the busywork away.",
    icon: TrendingUp,
  },
];

/** Our Story — vertical timeline whose gradient spine fills with scroll. */
export function OurStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.5"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <Container className="relative">
        <SectionHeading
          eyebrow="Our Story"
          title="From one idea to thousands of businesses"
          description="A short walk through how CreativeDox came to be — and where it's headed."
        />

        <div ref={ref} className="relative mx-auto mt-16 max-w-3xl">
          {/* Timeline spine */}
          <span
            aria-hidden
            className="bg-border absolute top-2 bottom-2 left-[19px] w-px sm:left-[27px]"
          />
          <motion.span
            aria-hidden
            style={{ scaleY: fill }}
            className="from-primary to-secondary absolute top-2 bottom-2 left-[19px] w-px origin-top bg-linear-to-b sm:left-[27px]"
          />

          <ol className="space-y-12">
            {MILESTONES.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.li
                  key={m.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
                  className="relative flex gap-6 pl-0"
                >
                  {/* Node */}
                  <span className="border-primary/40 bg-card text-primary relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border shadow-[0_0_24px_-6px_var(--color-glow-primary)] sm:h-14 sm:w-14">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
                  </span>

                  <div className="pt-1 sm:pt-2.5">
                    <span className="text-primary text-sm font-semibold tracking-wide">
                      {m.year}
                    </span>
                    <h3 className="text-foreground mt-1 text-xl font-semibold">
                      {m.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
