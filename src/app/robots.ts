import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Served at /robots.txt. Allows all crawlers across the marketing site,
 * keeps auth and Next internals out of the index, and points crawlers at
 * the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/login", "/api/", "/_next/"],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
