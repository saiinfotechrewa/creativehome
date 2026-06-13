"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, Search, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { GradientText } from "@/components/ui/gradient-text";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { fadeInUp } from "@/lib/animations";
import { getIcon } from "@/lib/icons";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Login hub — a searchable grid of product cards, each linking to its
 * dedicated app login. Customers land here, find their product, and go.
 */
export function LoginHub({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((product) =>
      [product.name, product.tagline, ...product.features]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [products, query]);

  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-12 sm:pt-44 sm:pb-16">
        <div
          aria-hidden
          className="from-primary/40 to-secondary/30 pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-radial opacity-25 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,#09090b)]"
        />

        <Container className="relative">
          <div className="flex flex-col items-center text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Badge variant="primary" featured>
                Customer Login
              </Badge>
            </motion.div>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.05 }}
              className="text-foreground mt-5 max-w-2xl text-balance text-4xl font-bold tracking-tight sm:text-5xl"
            >
              Log in to your <GradientText>CreativeDox</GradientText> product
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mx-auto mt-5 max-w-xl text-lg leading-relaxed"
            >
              Pick the product you use and head straight to its secure sign-in.
            </motion.p>

            {/* Search / filter */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.15 }}
              className="relative mt-8 w-full max-w-md"
            >
              <Search
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="border-border bg-card focus:border-primary focus:ring-primary/30 text-foreground placeholder:text-muted-foreground h-12 w-full rounded-full border pr-4 pl-11 text-sm outline-none transition-colors focus:ring-2"
              />
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="pb-24 sm:pb-28">
        <Container>
          {filtered.length > 0 ? (
            <Stagger
              key={query}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((product) => {
                const Icon = getIcon(product.icon);
                return (
                  <StaggerItem key={product.id}>
                    <a
                      href={product.loginUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block h-full"
                    >
                      <SpotlightCard className="group-hover:border-muted flex h-full flex-col transition-colors duration-300">
                        <div
                          aria-hidden
                          className={cn(
                            "absolute -top-12 -right-12 h-32 w-32 rounded-full bg-linear-to-br opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20",
                            product.gradient
                          )}
                        />
                        <span
                          className={cn(
                            "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-lg",
                            product.gradient
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </span>
                        <h2 className="text-foreground mt-5 text-lg font-semibold">
                          {product.name}
                        </h2>
                        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                          {product.tagline}
                        </p>
                        <span className="text-primary mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium">
                          <LogIn className="h-4 w-4" />
                          Go to Login
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </SpotlightCard>
                    </a>
                  </StaggerItem>
                );
              })}
            </Stagger>
          ) : (
            <div className="border-border bg-card/40 mx-auto max-w-md rounded-2xl border p-10 text-center">
              <p className="text-foreground font-medium">No products found</p>
              <p className="text-muted-foreground mt-2 text-sm">
                Try a different search, or{" "}
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-primary hover:underline"
                >
                  clear the filter
                </button>
                .
              </p>
            </div>
          )}

          <div className="text-muted-foreground mt-12 flex items-center justify-center gap-2 text-sm">
            <ShieldCheck className="text-primary h-4 w-4" />
            All logins are encrypted. Trouble signing in?{" "}
            <a href="/contact" className="text-foreground hover:underline">
              Contact support
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
