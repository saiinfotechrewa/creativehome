import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Web app manifest, served at /manifest.webmanifest. Gives the site an
 * installable PWA identity with the brand's dark theme. Icon files live
 * under /public (add alongside favicon.ico / og.png).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    short_name: SITE_CONFIG.shortName,
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    lang: "en-IN",
    categories: ["business", "productivity", "utilities"],
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  };
}
