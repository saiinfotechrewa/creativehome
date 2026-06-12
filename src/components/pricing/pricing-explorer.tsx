"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { PRODUCT_DETAILS } from "@/data/product-details";
import { EASE } from "@/lib/animations";
import type { ProductDetail, ProductPricingTier } from "@/lib/types";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "annual";

/**
 * Interactive pricing explorer — product tabs × billing toggle ×
 * 3-tier cards, all driven by PRODUCT_DETAILS.
 */
export function PricingExplorer() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [activeSlug, setActiveSlug] = useState(PRODUCT_DETAILS[0]!.slug);

  const active =
    PRODUCT_DETAILS.find((detail) => detail.slug === activeSlug) ??
    PRODUCT_DETAILS[0]!;

  return (
    <Container>
      {/* Billing toggle — sliding pill */}
      <div className="flex justify-center">
        <div className="border-border bg-card relative inline-flex rounded-full border p-1">
          {(["monthly", "annual"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={billing === option}
              onClick={() => setBilling(option)}
              className={cn(
                "relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200",
                billing === option
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {billing === option && (
                <motion.span
                  layoutId="billing-pill"
                  className="bg-accent absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative capitalize">
                {option === "monthly" ? "Monthly" : "Annual"}
              </span>
              {option === "annual" && (
                <span className="relative ml-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  Save 20%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Product tabs */}
      <div
        role="tablist"
        aria-label="Choose a product"
        className="scrollbar-none mt-10 flex gap-2 overflow-x-auto pb-2 lg:flex-wrap lg:justify-center"
      >
        {PRODUCT_DETAILS.map((detail) => {
          const isActive = detail.slug === activeSlug;
          const label = detail.name.replace("CreativeDox ", "");
          return (
            <button
              key={detail.slug}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveSlug(detail.slug)}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="product-tab-pill"
                  className="border-primary/40 bg-primary/10 absolute inset-0 rounded-full border"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Cards for the active product */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.slug}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="mt-10 grid items-stretch gap-6 lg:grid-cols-3"
        >
          {active.pricing.map((tier, i) => (
            <PricingCard
              key={tier.name}
              detail={active}
              tier={tier}
              nextTier={active.pricing[i + 1]}
              billing={billing}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <p className="text-muted mt-8 text-center text-xs">
        All prices exclude GST. Annual plans are billed once a year at the
        discounted monthly rate.
      </p>
    </Container>
  );
}

function PricingCard({
  detail,
  tier,
  nextTier,
  billing,
}: {
  detail: ProductDetail;
  tier: ProductPricingTier;
  /** The tier above this one — its extra features render as crossed-out. */
  nextTier?: ProductPricingTier;
  billing: Billing;
}) {
  const price = billing === "monthly" ? tier.priceMonthly : tier.priceAnnual;
  // Show what the next tier adds, as "not included" rows with cross icons.
  const missing = tier.recommended ? [] : (nextTier?.features.slice(0, 2) ?? []);

  return (
    <div className={cn("relative h-full", tier.recommended && "lg:scale-[1.04]")}>
      {tier.recommended ? (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
          <Badge variant="primary" glow>
            Most Popular
          </Badge>
        </span>
      ) : null}

      <SpotlightCard
        color={`${detail.hex}1f`}
        className={cn(
          "flex h-full flex-col p-7 transition-colors duration-300",
          tier.recommended
            ? "border-primary/40 shadow-[0_0_60px_-12px_var(--color-glow-primary)]"
            : "hover:border-muted"
        )}
      >
        {tier.recommended ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${detail.hex}, transparent)`,
            }}
          />
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
          {missing.map((feature) => (
            <li
              key={feature}
              className="text-muted flex items-start gap-2.5 text-sm line-through decoration-white/20"
            >
              <X className="mt-0.5 h-4 w-4 shrink-0 opacity-50" />
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
      </SpotlightCard>
    </div>
  );
}
