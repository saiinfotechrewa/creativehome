import type { ContentStatus } from "@prisma/client";

import type { Paginated } from "@/lib/admin/leads-client";

/**
 * Client-safe types, display config, query keys and fetchers for the admin
 * Case Studies module. No server-only imports, so this is safe in "use client"
 * components.
 */

// ───────────────────────────── Types ────────────────────────────────────────

export interface CaseStudyClient {
  name?: string;
  logo?: string;
  industry?: string;
  size?: string;
  website?: string;
}

export interface CaseStudyResult {
  metric: string;
  value: string;
  label?: string;
}

export interface CaseStudyTestimonial {
  quote?: string;
  name?: string;
  role?: string;
}

export interface CaseStudySeo {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface CaseStudyListItem {
  id: string;
  slug: string;
  status: ContentStatus;
  title: string;
  client: CaseStudyClient;
  results: CaseStudyResult[];
  featuredImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudyDetail extends CaseStudyListItem {
  challenge: string | null;
  solution: string | null;
  productsUsed: string[];
  testimonial: CaseStudyTestimonial;
  seo: CaseStudySeo;
}

export interface CaseStudyInput {
  slug: string;
  status: ContentStatus;
  title: string;
  client: CaseStudyClient;
  challenge?: string;
  solution?: string;
  results: CaseStudyResult[];
  productsUsed: string[];
  testimonial: CaseStudyTestimonial;
  featuredImage?: string;
  seo: CaseStudySeo;
}

export interface CaseStudyFilters {
  search?: string;
  status?: ContentStatus | "";
  includeArchived?: boolean;
  page?: number;
}

// ─────────────────────────── Display config ─────────────────────────────────

export const CASE_STUDY_STATUSES: {
  value: ContentStatus;
  label: string;
  badge: string;
}[] = [
  { value: "ACTIVE", label: "Published", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  { value: "DRAFT", label: "Draft", badge: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  { value: "ARCHIVED", label: "Archived", badge: "bg-muted text-muted-foreground border-border" },
];

export function caseStudyStatusMeta(status: ContentStatus) {
  return (
    CASE_STUDY_STATUSES.find((s) => s.value === status) ??
    CASE_STUDY_STATUSES[1]!
  );
}

/** Turn a title into a URL-safe slug (mirrors the server's slug rules). */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─────────────────────────── Query keys ─────────────────────────────────────

export const caseStudyKeys = {
  all: ["admin", "case-studies"] as const,
  list: (filters: CaseStudyFilters) =>
    ["admin", "case-studies", "list", filters] as const,
  detail: (slug: string) => ["admin", "case-studies", "detail", slug] as const,
};

// ─────────────────────────── Fetchers ───────────────────────────────────────

async function unwrap<T>(res: Response, fallback: string): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? fallback);
  }
  return (json as { data: T }).data;
}

export async function fetchCaseStudies(
  filters: CaseStudyFilters,
): Promise<Paginated<CaseStudyListItem>> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.includeArchived) params.set("includeArchived", "true");
  params.set("page", String(filters.page ?? 1));

  const res = await fetch(`/api/admin/case-studies?${params.toString()}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (json as { error?: string }).error ?? "Failed to load case studies",
    );
  }
  return json as Paginated<CaseStudyListItem>;
}

export async function fetchCaseStudy(slug: string): Promise<CaseStudyDetail> {
  const res = await fetch(`/api/admin/case-studies/${slug}`);
  return unwrap<CaseStudyDetail>(res, "Failed to load case study");
}

export async function createCaseStudy(
  input: CaseStudyInput,
): Promise<CaseStudyDetail> {
  const res = await fetch("/api/admin/case-studies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return unwrap<CaseStudyDetail>(res, "Failed to create case study");
}

export async function updateCaseStudy(
  slug: string,
  input: Partial<CaseStudyInput>,
): Promise<CaseStudyDetail> {
  const res = await fetch(`/api/admin/case-studies/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return unwrap<CaseStudyDetail>(res, "Failed to update case study");
}

export async function deleteCaseStudy(
  slug: string,
): Promise<{ id: string; slug: string; status: string }> {
  const res = await fetch(`/api/admin/case-studies/${slug}`, {
    method: "DELETE",
  });
  return unwrap<{ id: string; slug: string; status: string }>(
    res,
    "Failed to archive case study",
  );
}
