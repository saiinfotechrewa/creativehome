import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { getServiceSlugs } from "@/data/services";
import { getProductSlugs } from "@/data/product-details";
import { getIndustrySlugs } from "@/data/industry-details";
import { getAllPosts } from "@/data/blog-posts";
import { LEGAL_DOCUMENTS } from "@/data/legal";

/**
 * Auto-generated sitemap. Static marketing routes plus every dynamic
 * detail page (services, solutions, industries, blog posts, legal docs)
 * are emitted with sensible change-frequency and priority hints, and a
 * `lastModified` derived from content dates where we have them.
 *
 * Served at /sitemap.xml; referenced from robots.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.url;
  const now = new Date();

  /* ----- Top-level marketing pages ----- */
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/book-consultation`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/case-studies`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  /* ----- Service detail pages ----- */
  const serviceRoutes: MetadataRoute.Sitemap = getServiceSlugs().map((slug) => ({
    url: `${base}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  /* ----- Solution / product detail pages ----- */
  const solutionRoutes: MetadataRoute.Sitemap = [
    // Bespoke static solution page (not part of getProductSlugs()).
    {
      url: `${base}/solutions/custom-development`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...getProductSlugs().map((slug) => ({
      url: `${base}/solutions/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  /* ----- Industry landing pages ----- */
  const industryRoutes: MetadataRoute.Sitemap = getIndustrySlugs().map(
    (slug) => ({
      url: `${base}/industries/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  /* ----- Blog posts (lastModified = publish date) ----- */
  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  /* ----- Legal / policy pages ----- */
  const legalRoutes: MetadataRoute.Sitemap = LEGAL_DOCUMENTS.map((doc) => ({
    url: `${base}/${doc.slug}`,
    lastModified: new Date(doc.updated),
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...solutionRoutes,
    ...industryRoutes,
    ...blogRoutes,
    ...legalRoutes,
  ];
}
