import Link from "next/link";
import { ArrowRight, CalendarDays, Hash, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  BLOG_CATEGORIES,
  getCategoryCounts,
  getRecentPosts,
} from "@/data/blog-posts";
import { getIcon } from "@/lib/icons";
import { formatDate, cn } from "@/lib/utils";

/**
 * Post-page sidebar — browsable categories, recent posts, and a
 * conversion-focused consultation CTA. Server component.
 */
export function BlogSidebar({ currentSlug }: { currentSlug?: string }) {
  const counts = getCategoryCounts();
  const recent = getRecentPosts(4, currentSlug);

  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
      {/* Categories */}
      <div className="border-border bg-card/60 rounded-2xl border p-5 backdrop-blur-xl">
        <h3 className="text-foreground flex items-center gap-2 text-sm font-semibold tracking-tight">
          <Hash className="text-primary h-4 w-4" />
          Categories
        </h3>
        <ul className="mt-4 space-y-1">
          {BLOG_CATEGORIES.map((category) => (
            <li key={category}>
              <Link
                href={`/blog?category=${encodeURIComponent(category)}`}
                className="text-muted-foreground hover:bg-accent hover:text-foreground flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors"
              >
                <span>{category}</span>
                <span className="border-border bg-card text-muted rounded-full border px-2 py-0.5 text-[11px]">
                  {counts[category] ?? 0}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent posts */}
      <div className="border-border bg-card/60 rounded-2xl border p-5 backdrop-blur-xl">
        <h3 className="text-foreground flex items-center gap-2 text-sm font-semibold tracking-tight">
          <CalendarDays className="text-primary h-4 w-4" />
          Recent posts
        </h3>
        <ul className="mt-4 space-y-4">
          {recent.map((post) => {
            const Icon = getIcon(post.icon);
            return (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-start gap-3"
                >
                  <span
                    className={cn(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-linear-to-br text-white",
                      post.gradient
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-foreground group-hover:text-primary line-clamp-2 text-sm leading-snug font-medium transition-colors">
                      {post.title}
                    </p>
                    <p className="text-muted mt-1 text-[11px]">
                      {formatDate(post.date)}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Consultation CTA */}
      <div className="border-border relative overflow-hidden rounded-2xl border p-6">
        <div
          aria-hidden
          className="from-primary to-secondary absolute inset-0 bg-linear-to-br opacity-15"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]"
        />
        <div className="relative">
          <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="text-primary h-3.5 w-3.5" />
            Free consultation
          </span>
          <h3 className="text-foreground mt-4 text-lg font-bold tracking-tight">
            Ready to digitize your business?
          </h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Get a free, no-obligation walkthrough tailored to how your business
            actually runs.
          </p>
          <ButtonLink
            href="/book-consultation"
            variant="accent"
            size="md"
            className="mt-5 w-full"
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            Book a Consultation
          </ButtonLink>
        </div>
      </div>
    </aside>
  );
}
