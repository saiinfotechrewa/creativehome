"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { EASE } from "@/lib/animations";
import type { ProductDetail, ProductPricingTier } from "@/lib/types";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "annual";

/** 3-tier pricing with monthly/annual toggle; recommended tier spotlighted. */
export function ProductPricing({ detail }: { detail: ProductDetail }) {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section id="pricing" className="scroll-mt-20 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Simple plans, no surprises"
          description="Start small, upgrade when you grow. Every plan includes onboarding and updates."
        />

        {/* Billing toggle */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <BillingButton
            active={billing === "monthly"}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </BillingButton>
          <BillingButton
            active={billing === "annual"}
            onClick={() => setBilling("annual")}
          >
            Annual
            <span className="ml-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              Save ~20%
            </span>
          </BillingButton>
        </div>

        <Stagger className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
          {detail.pricing.map((tier) => (
            <StaggerItem key={tier.name} className="h-full">
              <PricingCard tier={tier} billing={billing} hex={detail.hex} />
            </StaggerItem>
          ))}
        </Stagger>

        <p className="text-muted mt-8 text-center text-xs">
          All prices exclude GST. Annual plans are billed once a year at the
          discounted monthly rate.
        </p>
      </Container>
    </section>
  );
}

function BillingButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
        active
          ? "border-primary/40 bg-primary/10 text-foreground"
          : "border-border text-muted-foreground hover:text-foreground bg-transparent"
      )}
    >
      {children}
    </button>
  );
}

function PricingCard({
  tier,
  billing,
  hex,
}: {
  tier: ProductPricingTier;
  billing: Billing;
  hex: string;
}) {
  const price = billing === "monthly" ? tier.priceMonthly : tier.priceAnnual;

  return (
    <div
      className={cn(
        "border-border bg-card relative flex h-full flex-col rounded-lg border p-7 transition-colors duration-300",
        tier.recommended
          ? "border-primary/40 shadow-[0_0_60px_-12px_var(--color-glow-primary)]"
          : "hover:border-muted"
      )}
    >
      {tier.recommended ? (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${hex}, transparent)`,
            }}
          />
          <span className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge variant="primary" glow>
              Recommended
            </Badge>
          </span>
        </>
      ) : null}

      <h3 className="text-foreground text-lg font-semibold">{tier.name}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{tier.description}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={price}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="text-foreground text-4xl font-bold tracking-tight tabular-nums"
          >
            ₹{new Intl.NumberFormat("en-IN").format(price)}
          </motion.span>
        </AnimatePresence>
        <span className="text-muted-foreground text-sm">/month</span>
      </div>
      <p className="text-muted mt-1 text-xs">
        {billing === "annual" ? "billed annually" : "billed monthly"}
      </p>

      <ul className="mt-7 flex-1 space-y-3">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className="text-muted-foreground flex items-start gap-2.5 text-sm"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <ButtonLink
          href="/#contact"
          variant={tier.recommended ? "primary" : "secondary"}
          className="w-full"
        >
          {tier.ctaLabel}
        </ButtonLink>
      </div>
    </div>
  );
}
