"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/shared/motion";
import { EASE } from "@/lib/animations";
import { cn } from "@/lib/utils";

const PRICING_FAQS = [
  {
    question: "Do prices include GST?",
    answer:
      "Prices shown are exclusive of GST; 18% GST applies on the invoice. You receive a proper GST invoice for every payment, so registered businesses can claim input credit.",
  },
  {
    question: "Can I upgrade or downgrade my plan later?",
    answer:
      "Anytime. Upgrades apply instantly with a pro-rated charge for the remaining period; downgrades take effect from your next billing cycle. Your data stays intact either way.",
  },
  {
    question: "How does the annual discount work?",
    answer:
      "Annual plans are billed once a year at roughly 20% less per month than monthly billing. The discounted monthly rate is shown when you switch the toggle to Annual.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "UPI, credit/debit cards, net banking, and NEFT/RTGS for annual invoices. Recurring auto-pay is available on monthly plans so you never miss a renewal.",
  },
  {
    question: "Is onboarding or setup charged extra?",
    answer:
      "No. Every plan includes onboarding — data import from Excel/Tally, configuration, and training for your team. There are no hidden setup fees.",
  },
  {
    question: "What happens if I stop paying?",
    answer:
      "Your account pauses, not your data. We keep your data safe for 90 days so you can export everything or resume where you left off — no deletion surprises.",
  },
  {
    question: "Can I use more than one CreativeDox product?",
    answer:
      "Yes, and they work better together — CRM, WhatsApp, Accounting, and Attendance share data. Bundled pricing is available; talk to our team for a combined quote.",
  },
  {
    question: "Is there a free trial or demo?",
    answer:
      "Every product comes with a free personalized demo, and we set up a 14-day trial with your own data so you can evaluate it with your actual team before paying.",
  },
];

/** Accordion of billing and plan questions for the pricing page. */
export function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-border/60 border-t bg-[#0b0b0e] py-24 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Pricing questions, answered"
          description="The billing details businesses ask about most — answered straight."
        />

        <Reveal className="mt-12 space-y-3">
          {PRICING_FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.question}
                className={cn(
                  "border-border bg-card overflow-hidden rounded-lg border transition-colors duration-300",
                  isOpen && "border-muted"
                )}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-foreground text-sm font-medium sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "text-muted h-4 w-4 shrink-0 transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="text-muted-foreground px-5 pb-5 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
