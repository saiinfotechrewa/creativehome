import type { TestimonialStatus } from "@prisma/client";

import type { Paginated } from "@/lib/admin/leads-client";

/**
 * Client-safe types, display config, query keys and fetchers for the admin
 * Testimonials module. No server-only imports, so this is safe in "use client"
 * components.
 */

// ───────────────────────────── Types ────────────────────────────────────────

export interface Testimonial {
  id: string;
  status: TestimonialStatus;
  isDisplayed: boolean;
  displayOrder: number;
  quote: string;
  name: string;
  role: string | null;
  company: string | null;
  industry: string | null;
  rating: number;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialInput {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  industry?: string;
  rating: number;
  avatar?: string;
  status: TestimonialStatus;
  isDisplayed: boolean;
}

export interface TestimonialFilters {
  search?: string;
  status?: TestimonialStatus | "";
  page?: number;
}

// ─────────────────────────── Display config ─────────────────────────────────

export const TESTIMONIAL_STATUSES: {
  value: TestimonialStatus;
  label: string;
  badge: string;
}[] = [
  { value: "PENDING", label: "Pending", badge: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  { value: "APPROVED", label: "Approved", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  { value: "REJECTED", label: "Rejected", badge: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
];

export function testimonialStatusMeta(status: TestimonialStatus) {
  return (
    TESTIMONIAL_STATUSES.find((s) => s.value === status) ??
    TESTIMONIAL_STATUSES[0]!
  );
}

// ─────────────────────────── Query keys ─────────────────────────────────────

export const testimonialKeys = {
  all: ["admin", "testimonials"] as const,
  list: (filters: TestimonialFilters) =>
    ["admin", "testimonials", "list", filters] as const,
};

// ─────────────────────────── Fetchers ───────────────────────────────────────

async function unwrap<T>(res: Response, fallback: string): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? fallback);
  }
  return (json as { data: T }).data;
}

export async function fetchTestimonials(
  filters: TestimonialFilters,
): Promise<Paginated<Testimonial>> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  // Show displayed first, then by display order, so reorder is intuitive.
  params.set("sort", "displayOrder");
  params.set("order", "asc");
  params.set("pageSize", "100");
  params.set("page", String(filters.page ?? 1));

  const res = await fetch(`/api/admin/testimonials?${params.toString()}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (json as { error?: string }).error ?? "Failed to load testimonials",
    );
  }
  return json as Paginated<Testimonial>;
}

export async function createTestimonial(
  input: TestimonialInput,
): Promise<Testimonial> {
  const res = await fetch("/api/admin/testimonials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return unwrap<Testimonial>(res, "Failed to create testimonial");
}

export async function updateTestimonial(
  id: string,
  input: Partial<TestimonialInput>,
): Promise<Testimonial> {
  const res = await fetch(`/api/admin/testimonials/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return unwrap<Testimonial>(res, "Failed to update testimonial");
}

export async function deleteTestimonial(id: string): Promise<{ id: string }> {
  const res = await fetch(`/api/admin/testimonials/${id}`, {
    method: "DELETE",
  });
  return unwrap<{ id: string }>(res, "Failed to delete testimonial");
}

export async function setTestimonialStatus(
  id: string,
  status: TestimonialStatus,
): Promise<Testimonial> {
  const res = await fetch(`/api/admin/testimonials/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return unwrap<Testimonial>(res, "Failed to update status");
}

export async function setTestimonialDisplay(
  id: string,
  isDisplayed: boolean,
): Promise<Testimonial> {
  const res = await fetch(`/api/admin/testimonials/${id}/display`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isDisplayed }),
  });
  return unwrap<Testimonial>(res, "Failed to toggle display");
}

export async function reorderTestimonials(
  order: string[],
): Promise<Testimonial[]> {
  const res = await fetch("/api/admin/testimonials/reorder", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order }),
  });
  return unwrap<Testimonial[]>(res, "Failed to reorder");
}
