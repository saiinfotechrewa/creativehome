"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarCheck,
  Headset,
  PhoneCall,
  Quote,
  Rocket,
  Star,
} from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";

/** "What Happens Next?" — the four steps after a booking is submitted. */
const TIMELINE = [
  {
    icon: PhoneCall,
    title: "We reach out",
    description:
      "A specialist confirms your slot within one business day on your chosen channel.",
  },
  {
    icon: Headset,
    title: "Discovery call",
    description:
      "A relaxed 20–30 min chat about your business, goals, and current bottlenecks.",
  },
  {
    icon: CalendarCheck,
    title: "Tailored plan",
    description:
      "We map the right products and a clear rollout plan with transparent pricing.",
  },
  {
    icon: Rocket,
    title: "Go live",
    description:
      "Setup, data migration, and team training — you're up and running fast.",
  },
];

/** Right-hand trust column shown beside the booking form. */
export function TrustPanel() {
  return (
    <motion.aside
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
      className="flex flex-col gap-6 lg:sticky lg:top-28"
    >
      {/* Free / no obligation badge */}
      <motion.div
        variants={fadeInUp}
        className="border-border bg-card/60 relative overflow-hidden rounded-2xl border p-6 backdrop-blur-xl"
      >
        <div
          aria-hidden
          className="from-primary/10 to-secondary/10 absolute inset-0 bg-linear-to-br"
        />
        <div className="relative flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <BadgeCheck className="h-6 w-6" />
          </span>
          <div>
            <p className="text-foreground text-lg font-semibold tracking-tight">
              100% Free. No Obligations.
            </p>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              No cost, no pressure, no commitment. Just honest advice on what
              actually fits your business.
            </p>
          </div>
        </div>
      </motion.div>

      {/* What happens next timeline */}
      <motion.div
        variants={fadeInUp}
        className="border-border bg-card/60 rounded-2xl border p-6 backdrop-blur-xl"
      >
        <h3 className="text-foreground text-base font-semibold tracking-tight">
          What happens next?
        </h3>
        <ol className="relative mt-5 space-y-6">
          {/* Connecting line */}
          <span
            aria-hidden
            className="from-primary/40 absolute top-2 bottom-2 left-[18px] w-px bg-linear-to-b to-transparent"
          />
          {TIMELINE.map((item, i) => {
            const Icon = item.icon;
            return (
              <li key={item.title} className="relative flex gap-4">
                <span className="from-primary to-secondary text-primary-foreground shadow-primary/20 relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-linear-to-br text-xs font-semibold shadow-lg">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="pt-0.5">
                  <p className="text-foreground text-sm font-semibold">
                    <span className="text-muted mr-1.5">{i + 1}.</span>
                    {item.title}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </motion.div>

      {/* Trust line + testimonial */}
      <motion.div
        variants={fadeInUp}
        className="border-border bg-card/60 rounded-2xl border p-6 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2.5">
            {["RA", "AK", "SD", "NK"].map((initials, i) => (
              <span
                key={initials}
                className="border-card from-primary/80 to-secondary/80 grid h-8 w-8 place-items-center rounded-full border-2 bg-linear-to-br text-[11px] font-semibold text-white"
                style={{ zIndex: 10 - i }}
              >
                {initials}
              </span>
            ))}
          </div>
          <div>
            <div className="flex items-center gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <p className="text-foreground text-sm font-semibold">
              500+ businesses trust us
            </p>
          </div>
        </div>

        <figure className="border-border mt-5 border-t pt-5">
          <Quote className="text-primary/40 h-6 w-6" />
          <blockquote className="text-muted-foreground mt-2 text-sm leading-relaxed italic">
            “Billing errors are down 80% since we switched to CreativeDox.
            Returns that took hours now finish before the shutters close.”
          </blockquote>
          <figcaption className="mt-3 text-sm">
            <span className="text-foreground font-semibold">
              Ramesh Agarwal
            </span>
            <span className="text-muted"> · Agarwal Supermart</span>
          </figcaption>
        </figure>
      </motion.div>
    </motion.aside>
  );
}
