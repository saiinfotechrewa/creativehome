import { z } from "zod";

/**
 * Client-safe schemas, types, query keys and fetchers for the Company Settings
 * screen. The form uses an explicit nested shape (rather than the API's loose
 * JSON `record`s) so react-hook-form gets real field paths and Zod messages.
 * The shape is a structural subset the API's `companySettingsSchema` accepts.
 */

// ─────────────────────── Company settings form ──────────────────────────────

const urlOrEmpty = z
  .string()
  .url("Enter a valid URL (including https://)")
  .or(z.literal(""))
  .optional();

export const companyFormSchema = z.object({
  // Profile
  companyName: z.string().min(1, "Company name is required").max(120),
  tagline: z.string().max(200).optional(),
  logo: z.string().optional(),
  darkLogo: z.string().optional(),
  favicon: z.string().optional(),

  // Contact
  email: z
    .string()
    .email("Enter a valid email")
    .or(z.literal(""))
    .optional(),
  phone: z.string().max(40).optional(),
  whatsapp: z.string().max(40).optional(),
  address: z.object({
    line1: z.string().max(160).optional(),
    line2: z.string().max(160).optional(),
    city: z.string().max(80).optional(),
    state: z.string().max(80).optional(),
    pincode: z.string().max(20).optional(),
    country: z.string().max(80).optional(),
    mapsUrl: urlOrEmpty,
  }),
  businessHours: z.object({
    weekdays: z.string().max(80).optional(),
    saturday: z.string().max(80).optional(),
    sunday: z.string().max(80).optional(),
  }),

  // Social
  socialLinks: z.object({
    facebook: urlOrEmpty,
    instagram: urlOrEmpty,
    twitter: urlOrEmpty,
    linkedin: urlOrEmpty,
    youtube: urlOrEmpty,
  }),

  // SEO defaults
  seoDefaults: z.object({
    title: z.string().max(70).optional(),
    description: z.string().max(180).optional(),
    ogImage: z.string().optional(),
    googleAnalyticsId: z.string().max(40).optional(),
    googleTagManagerId: z.string().max(40).optional(),
    facebookPixelId: z.string().max(40).optional(),
  }),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

export const EMPTY_COMPANY: CompanyFormValues = {
  companyName: "",
  tagline: "",
  logo: "",
  darkLogo: "",
  favicon: "",
  email: "",
  phone: "",
  whatsapp: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mapsUrl: "",
  },
  businessHours: { weekdays: "", saturday: "", sunday: "" },
  socialLinks: {
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
  },
  seoDefaults: {
    title: "",
    description: "",
    ogImage: "",
    googleAnalyticsId: "",
    googleTagManagerId: "",
    facebookPixelId: "",
  },
};

/** Safely read a string from an unknown JSON record. */
function str(obj: unknown, key: string): string {
  if (obj && typeof obj === "object" && key in obj) {
    const v = (obj as Record<string, unknown>)[key];
    return typeof v === "string" ? v : "";
  }
  return "";
}

/** Map the raw CompanySettings row from the API into the form's nested shape. */
export function toCompanyForm(raw: Record<string, unknown>): CompanyFormValues {
  const address = raw.address ?? {};
  const hours = raw.businessHours ?? {};
  const social = raw.socialLinks ?? {};
  const seo = raw.seoDefaults ?? {};
  return {
    companyName: str(raw, "companyName") || "CreativeDox",
    tagline: str(raw, "tagline"),
    logo: str(raw, "logo"),
    darkLogo: str(raw, "darkLogo"),
    favicon: str(raw, "favicon"),
    email: str(raw, "email"),
    phone: str(raw, "phone"),
    whatsapp: str(raw, "whatsapp"),
    address: {
      line1: str(address, "line1"),
      line2: str(address, "line2"),
      city: str(address, "city"),
      state: str(address, "state"),
      pincode: str(address, "pincode"),
      country: str(address, "country"),
      mapsUrl: str(address, "mapsUrl"),
    },
    businessHours: {
      weekdays: str(hours, "weekdays"),
      saturday: str(hours, "saturday"),
      sunday: str(hours, "sunday"),
    },
    socialLinks: {
      facebook: str(social, "facebook"),
      instagram: str(social, "instagram"),
      twitter: str(social, "twitter"),
      linkedin: str(social, "linkedin"),
      youtube: str(social, "youtube"),
    },
    seoDefaults: {
      title: str(seo, "title"),
      description: str(seo, "description"),
      ogImage: str(seo, "ogImage"),
      googleAnalyticsId: str(seo, "googleAnalyticsId"),
      googleTagManagerId: str(seo, "googleTagManagerId"),
      facebookPixelId: str(seo, "facebookPixelId"),
    },
  };
}

// ─────────────────────────── Legal documents ────────────────────────────────

export const LEGAL_PAGES = [
  { type: "privacy", label: "Privacy Policy" },
  { type: "terms", label: "Terms & Conditions" },
  { type: "refund", label: "Refund Policy" },
] as const;

export type LegalPageType = (typeof LEGAL_PAGES)[number]["type"];

export interface LegalDoc {
  type?: string;
  title: string;
  content: string;
  version: string | null;
  isPublished: boolean;
  effectiveAt: string | null;
  seo: Record<string, unknown>;
  exists?: boolean;
}

export interface LegalSavePayload {
  title: string;
  content: string;
  version?: string;
  isPublished: boolean;
}

// ─────────────────────────── Query keys ─────────────────────────────────────

export const settingsKeys = {
  company: ["admin", "settings", "company"] as const,
  legal: (type: string) => ["admin", "settings", "legal", type] as const,
};

// ─────────────────────────── Fetchers ───────────────────────────────────────

async function unwrap<T>(res: Response, fallback: string): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? fallback);
  }
  return (json as { data: T }).data;
}

export async function fetchCompany(): Promise<Record<string, unknown>> {
  const res = await fetch("/api/admin/settings/company");
  return unwrap<Record<string, unknown>>(res, "Failed to load settings");
}

export async function saveCompany(
  values: CompanyFormValues,
): Promise<Record<string, unknown>> {
  const res = await fetch("/api/admin/settings/company", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  return unwrap<Record<string, unknown>>(res, "Failed to save settings");
}

export async function fetchLegal(type: LegalPageType): Promise<LegalDoc> {
  const res = await fetch(`/api/admin/settings/legal/${type}`);
  return unwrap<LegalDoc>(res, "Failed to load document");
}

export async function saveLegal(
  type: LegalPageType,
  payload: LegalSavePayload,
): Promise<LegalDoc> {
  const res = await fetch(`/api/admin/settings/legal/${type}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return unwrap<LegalDoc>(res, "Failed to save document");
}

// ─────────────────────────── Media upload ───────────────────────────────────

/** Upload an image to the media library and return its public URL. */
export async function uploadMedia(file: File, folder = "branding"): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);

  const res = await fetch("/api/admin/media", { method: "POST", body: form });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? "Upload failed");
  }
  return (json as { data: { url: string } }).data.url;
}
