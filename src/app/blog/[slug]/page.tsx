import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogContent } from "@/components/blog/BlogContent";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BlogCard } from "@/components/blog/BlogCard";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { getPost, getPostSlugs, getRelatedPosts } from "@/data/blog-posts";
import { SITE_CONFIG } from "@/lib/constants";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-render every post at build time. */
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt;
  const url = `${SITE_CONFIG.url}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    authors: [{ name: post.author.name }],
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      url,
      siteName: SITE_CONFIG.name,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      tags: post.tags,
      images: [{ url: SITE_CONFIG.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * Individual blog post — hero, two-column body + sidebar, share bar,
 * and related posts. Emits BlogPosting + Breadcrumb JSON-LD.
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const related = getRelatedPosts(post, 3);
  const url = `${SITE_CONFIG.url}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        author: {
          "@type": "Person",
          name: post.author.name,
          jobTitle: post.author.role,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_CONFIG.name,
          url: SITE_CONFIG.url,
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        articleSection: post.category,
        keywords: post.tags?.join(", "),
        image: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_CONFIG.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${SITE_CONFIG.url}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BlogHero post={post} />

      <section className="pb-12">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
            {/* Article */}
            <article>
              <BlogContent blocks={post.content} />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border-border bg-card text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share + author footer */}
              <div className="border-border mt-8 flex flex-col gap-6 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="from-primary to-secondary grid h-12 w-12 place-items-center rounded-full bg-linear-to-br text-sm font-semibold text-white">
                    {post.author.avatar}
                  </span>
                  <div>
                    <p className="text-foreground text-sm font-semibold">
                      {post.author.name}
                    </p>
                    <p className="text-muted text-xs">{post.author.role}</p>
                  </div>
                </div>
                <ShareButtons slug={post.slug} title={post.title} />
              </div>

              <div className="mt-8">
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to all articles
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <BlogSidebar currentSlug={post.slug} />
          </div>
        </Container>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="border-border/60 border-t bg-[#0b0b0e] py-20 sm:py-24">
          <Container>
            <SectionHeading
              eyebrow="Keep reading"
              title="Related articles"
              description="More ideas to help you run a smarter, more automated business."
            />
            <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((entry) => (
                <StaggerItem key={entry.slug}>
                  <BlogCard post={entry} />
                </StaggerItem>
              ))}
            </Stagger>

            <div className="mt-12 flex justify-center">
              <Link
                href="/blog"
                className="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              >
                Browse all articles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
