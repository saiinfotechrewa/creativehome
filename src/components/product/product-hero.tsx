"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { BrowserMockup } from "@/components/product/browser-mockup";
import {
  fadeInUp,
  floatingAnimation,
  slideInRight,
  staggerContainer,
} from "@/lib/animations";
import type { Product, ProductDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductHeroProps {
  detail: ProductDetail;
  product: Product;
}

const TRUST_POINTS = ["Free onboarding", "No long contracts", "Made in India"];

/** Split product hero — copy + CTAs left, floating app mockup right. */
export function ProductHero({ detail, product }: ProductHeroProps) {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      {/* Gradient orb tinted to the product color */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[840px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{
          background: `radial-gradient(closest-side, ${detail.hex}, transparent)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,#09090b)]"
      />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
          {/* Copy */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-start gap-6"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="primary" featured>
                {product.badge ?? "CreativeDox Product"}
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-foreground max-w-xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              {detail.name.replace("CreativeDox ", "")}{" "}
              <span
                className={cn(
                  "bg-linear-to-r bg-clip-text text-transparent",
                  detail.gradient
                )}
              >
                that runs itself
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground max-w-xl text-lg leading-relaxed"
            >
              {detail.heroDescription}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
              <ButtonLink
                href={product.demoUrl}
                external
                variant="primary"
                size="lg"
                iconRight={<ArrowRight className="h-4 w-4" />}
              >
                Get Free Demo
              </ButtonLink>
              <ButtonLink href="#pricing" variant="secondary" size="lg">
                View Pricing
              </ButtonLink>
              <ButtonLink
                href={product.loginUrl}
                external
                variant="ghost"
                size="lg"
              >
                Login
              </ButtonLink>
            </motion.div>

            <motion.ul
              variants={fadeInUp}
              className="text-muted-foreground flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
            >
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  {point}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Mockup */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInRight}
            className="relative"
          >
            <div
              aria-hidden
              className="absolute -inset-8 rounded-[32px] opacity-20 blur-3xl"
              style={{ background: detail.hex }}
            />
            <motion.div animate={floatingAnimation} className="relative">
              <BrowserMockup
                url={`app.creativedox.com/${detail.productId}`}
                gradient={detail.gradient}
              />
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
