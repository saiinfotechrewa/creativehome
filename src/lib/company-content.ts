import { prisma } from "@/lib/prisma";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants";

/**
 * Server-side Company Settings bridge.
 *
 * The marketing chrome (navbar, footer, page metadata) historically read the
 * hardcoded `SITE_CONFIG`/`SOCIAL_LINKS` constants, so editing Company Settings
 * in the admin had no visible effect on the live site. This loader reads the
 * singleton `CompanySettings` row and resolves it into a flat, serialisable
 * profile that those components consume, falling back to the constants for any
 * field the admin hasn't filled in. A DB outage degrades to the full static
 * fallback so the site never hard-fails on a content problem.
 */

export interface CompanyProfile {
  name: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  whatsapp: string;
  /** A single-line address for the footer/contact strip. */
  addressText: string;
  mapsUrl: string;
  logo: string | null;
  social: {
    linkedin: string;
    twitter: string;
    youtube: string;
    instagram: string;
    facebook: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
}

type Json = Record<string, unknown>;

function str(obj: unknown, key: string): string {
  if (obj && typeof obj === "object" && key in obj) {
    const v = (obj as Json)[key];
    return typeof v === "string" ? v : "";
  }
  return "";
}

/** Join the structured address JSON into one human-readable line. */
function joinAddress(address: unknown): string {
  const parts = [
    str(address, "line1"),
    str(address, "line2"),
    str(address, "city"),
    str(address, "state"),
    str(address, "pincode"),
    str(address, "country"),
  ].filter((p) => p.length > 0);
  return parts.join(", ");
}

/** The fully-static profile used when no row exists or the DB is unreachable. */
const FALLBACK: CompanyProfile = {
  name: SITE_CONFIG.name,
  tagline: SITE_CONFIG.tagline,
  description: SITE_CONFIG.description,
  email: SITE_CONFIG.email,
  phone: SITE_CONFIG.phone,
  whatsapp: SOCIAL_LINKS.whatsapp,
  addressText: SITE_CONFIG.address,
  mapsUrl: "",
  logo: null,
  social: {
    linkedin: SOCIAL_LINKS.linkedin,
    twitter: SOCIAL_LINKS.twitter,
    youtube: SOCIAL_LINKS.youtube,
    instagram: SOCIAL_LINKS.instagram,
    facebook: "",
  },
  seo: {
    title: "",
    description: SITE_CONFIG.description,
    ogImage: SITE_CONFIG.ogImage,
  },
};

export async function getCompanySettings(): Promise<CompanyProfile> {
  let row:
    | {
        companyName: string;
        tagline: string | null;
        logo: string | null;
        darkLogo: string | null;
        email: string | null;
        phone: string | null;
        whatsapp: string | null;
        address: unknown;
        socialLinks: unknown;
        seoDefaults: unknown;
      }
    | null = null;
  try {
    row = await prisma.companySettings.findUnique({
      where: { id: "singleton" },
      select: {
        companyName: true,
        tagline: true,
        logo: true,
        darkLogo: true,
        email: true,
        phone: true,
        whatsapp: true,
        address: true,
        socialLinks: true,
        seoDefaults: true,
      },
    });
  } catch {
    return FALLBACK;
  }

  if (!row) return FALLBACK;

  const social = row.socialLinks;
  const seo = row.seoDefaults;
  const addressText = joinAddress(row.address) || FALLBACK.addressText;

  return {
    name: row.companyName || FALLBACK.name,
    tagline: row.tagline || FALLBACK.tagline,
    description: str(seo, "description") || row.tagline || FALLBACK.description,
    email: row.email || FALLBACK.email,
    phone: row.phone || FALLBACK.phone,
    whatsapp: row.whatsapp || FALLBACK.whatsapp,
    addressText,
    mapsUrl: str(row.address, "mapsUrl"),
    logo: row.logo || row.darkLogo || null,
    social: {
      linkedin: str(social, "linkedin") || FALLBACK.social.linkedin,
      twitter: str(social, "twitter") || FALLBACK.social.twitter,
      youtube: str(social, "youtube") || FALLBACK.social.youtube,
      instagram: str(social, "instagram") || FALLBACK.social.instagram,
      facebook: str(social, "facebook"),
    },
    seo: {
      title: str(seo, "title"),
      description: str(seo, "description") || FALLBACK.seo.description,
      ogImage: str(seo, "ogImage") || FALLBACK.seo.ogImage,
    },
  };
}
