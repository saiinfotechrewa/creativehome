"use client";

import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { getIcon } from "@/lib/icons";
import { formatDate, cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
  /** Drop the bottom margin tweak when used in tight grids. */
  className?: string;
}

/**
 * Blog listing card — gradient thumbnail with the post's accent icon,
 * category badge, title, excerpt, and an author/date/read-time footer.
 * Sits on a SpotlightCard so the cursor lights it up on hover.
 */
export function BlogCard({ post, className }: BlogCardProps) {
  const Icon = getIcon(post.icon);

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <SpotlightCard
        className={cn(
          "hover:border-muted flex h-full flex-col p-0 transition-colors duration-300",
          className
        )}
      >
        {/* Thumbnail */}
        <div
          className={cn(
            "relative aspect-[16/9] overflow-hidden bg-linear-to-br",
            post.gradient
          )}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_55%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <Icon className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-white/90 transition-transform duration-500 group-hover:scale-110" />
          <span className="absolute top-3 left-3 inline-flex items-center rounded-full border border-white/25 bg-black/30 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            {post.category}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-foreground group-hover:text-primary text-lg font-semibold tracking-tight transition-colors">
            {post.title}
          </h3>
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="border-border/70 mt-5 flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2.5">
              <span className="from-primary/80 to-secondary/80 grid h-8 w-8 place-items-center rounded-full bg-linear-to-br text-[11px] font-semibold text-white">
                {post.author.avatar}
              </span>
              <div className="leading-tight">
                <p className="text-foreground text-xs font-medium">
                  {post.author.name}
                </p>
                <p className="text-muted text-[11px]">
                  {formatDate(post.date)}
                </p>
              </div>
            </div>
            <span className="text-muted inline-flex items-center gap-1 text-[11px]">
              <Clock className="h-3 w-3" />
              {post.readTime} min
            </span>
          </div>

          <span className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium">
            Read article
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </SpotlightCard>
    </Link>
  );
}
