"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, ChevronRight, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { formatDate, cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

/** Hero for an individual post — breadcrumb, category, title, byline. */
export function BlogHero({ post }: { post: BlogPost }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-10 sm:pt-40 sm:pb-12">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-44 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-linear-to-br bg-radial opacity-25 blur-[130px]",
          post.gradient
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,#09090b)]"
      />

      <Container className="relative">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="text-muted flex flex-wrap items-center gap-1.5 text-sm">
            <li>
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Home
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" />
            <li>
              <Link
                href="/blog"
                className="hover:text-foreground transition-colors"
              >
                Blog
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" />
            <li className="text-muted-foreground line-clamp-1">{post.title}</li>
          </ol>
        </nav>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-3xl"
        >
          <motion.div variants={fadeInUp}>
            <span
              className={cn(
                "inline-flex items-center rounded-full bg-linear-to-r px-3 py-1 text-xs font-semibold text-white",
                post.gradient
              )}
            >
              {post.category}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-foreground mt-5 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            {post.title}
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mt-5 max-w-2xl text-lg leading-relaxed"
          >
            {post.excerpt}
          </motion.p>

          {/* Byline */}
          <motion.div
            variants={fadeInUp}
            className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3"
          >
            <div className="flex items-center gap-3">
              <span className="from-primary to-secondary grid h-10 w-10 place-items-center rounded-full bg-linear-to-br text-xs font-semibold text-white">
                {post.author.avatar}
              </span>
              <div className="leading-tight">
                <p className="text-foreground text-sm font-medium">
                  {post.author.name}
                </p>
                <p className="text-muted text-xs">{post.author.role}</p>
              </div>
            </div>
            <span className="bg-border hidden h-8 w-px sm:block" />
            <div className="text-muted flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatDate(post.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
              </span>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
