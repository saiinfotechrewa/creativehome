import type { Metadata } from "next";
import { BlogListing } from "@/components/blog/BlogListing";
import { BLOG_CATEGORIES, getAllPosts } from "@/data/blog-posts";
import { SITE_CONFIG } from "@/lib/constants";

const TITLE = "Blog";
const DESCRIPTION =
  "Practical guides on business automation, CRM, digital attendance, WhatsApp marketing, and more — from the team at CreativeDox, written for growing Indian businesses.";

const URL = `${SITE_CONFIG.url}/blog`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: `${TITLE} | ${SITE_CONFIG.name}`,
    description: DESCRIPTION,
    url: URL,
    siteName: SITE_CONFIG.name,
    type: "website",
    images: [{ url: SITE_CONFIG.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ${SITE_CONFIG.name}`,
    description: DESCRIPTION,
  },
};

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

/**
 * Blog listing — hero, category filter tabs, and a responsive grid of
 * post cards. Emits Blog + Breadcrumb JSON-LD for rich results.
 */
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;
  const posts = getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${URL}#blog`,
        url: URL,
        name: `${SITE_CONFIG.name} Blog`,
        description: DESCRIPTION,
        publisher: {
          "@type": "Organization",
          name: SITE_CONFIG.name,
          url: SITE_CONFIG.url,
        },
        blogPost: posts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          author: { "@type": "Person", name: post.author.name },
          url: `${SITE_CONFIG.url}/blog/${post.slug}`,
        })),
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
          { "@type": "ListItem", position: 2, name: "Blog", item: URL },
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
      <BlogListing
        posts={posts}
        categories={BLOG_CATEGORIES}
        initialCategory={category}
      />
    </>
  );
}
