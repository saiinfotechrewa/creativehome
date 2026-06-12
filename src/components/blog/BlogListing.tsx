"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { GradientText } from "@/components/ui/gradient-text";
import { BlogCard } from "@/components/blog/BlogCard";
import { staggerContainer, fadeInUp, EASE } from "@/lib/animations";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

interface BlogListingProps {
  posts: BlogPost[];
  categories: readonly string[];
  /** Pre-selected category from the `?category=` query param. */
  initialCategory?: string;
}

const ALL = "All";

/**
 * Client listing — animated hero, category filter tabs, and a
 * 3-column grid that re-flows with a smooth transition on filter.
 */
export function BlogListing({
  posts,
  categories,
  initialCategory,
}: BlogListingProps) {
  const tabs = useMemo(() => [ALL, ...categories], [categories]);
  const [active, setActive] = useState(
    initialCategory && categories.includes(initialCategory)
      ? initialCategory
      : ALL
  );

  const filtered = useMemo(
    () => (active === ALL ? posts : posts.filter((p) => p.category === active)),
    [active, posts]
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div
          aria-hidden
          className="from-primary/35 to-secondary/25 pointer-events-none absolute -top-44 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-radial opacity-30 blur-[130px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,#09090b)]"
        />

        <Container className="relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mx-auto flex max-w-2xl flex-col items-center text-center"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="primary" featured>
                The CreativeDox Blog
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-foreground mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              Ideas to <GradientText>run a smarter business</GradientText>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed"
            >
              Practical guides on automation, CRM, attendance, WhatsApp
              marketing, and everything in between — written for growing Indian
              businesses.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* Filters + grid */}
      <section className="pb-24 sm:pb-28">
        <Container>
          {/* Category tabs */}
          <div className="mb-10 flex flex-wrap justify-center gap-2.5">
            {tabs.map((tab) => {
              const isActive = tab === active;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActive(tab)}
                  className={cn(
                    "relative rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "border-transparent text-white"
                      : "border-border bg-card text-muted-foreground hover:border-muted hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="blog-tab"
                      className="from-primary to-secondary absolute inset-0 -z-10 rounded-full bg-linear-to-r"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((post) => (
                <motion.div
                  key={post.slug}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <p className="text-muted-foreground py-16 text-center">
              No posts in this category yet — check back soon.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
