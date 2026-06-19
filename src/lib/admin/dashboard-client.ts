import type { LeadListItem, Paginated } from "@/lib/admin/leads-client";

/**
 * Client-safe types, query keys and fetchers for the admin dashboard. No
 * server-only imports, so this is safe inside "use client" components.
 */

// ───────────────────────────── Types ────────────────────────────────────────

export interface Metric {
  value: number;
  previous: number;
  change: number;
  currency?: string;
}

export interface SeriesPoint {
  date: string;
  value: number;
}

export interface DashboardData {
  range: { days: number; start: string; end: string };
  metrics: {
    leads: Metric;
    orders: Metric;
    revenue: Metric;
    users: Metric;
  };
  charts: {
    leads: SeriesPoint[];
    orders: SeriesPoint[];
    revenue: SeriesPoint[];
  };
}

export interface ActivityItem {
  id: string;
  action: string;
  module: string;
  entityName: string | null;
  userName: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
  user: { id: string; name: string; avatar: string | null } | null;
}

// ─────────────────────────── Query keys ─────────────────────────────────────

export const dashboardKeys = {
  all: ["admin", "dashboard"] as const,
  metrics: (days: number) => ["admin", "dashboard", "metrics", days] as const,
  recentLeads: ["admin", "dashboard", "recent-leads"] as const,
  recentActivity: ["admin", "dashboard", "recent-activity"] as const,
};

// ─────────────────────────── Fetchers ───────────────────────────────────────

async function unwrap<T>(res: Response, fallback: string): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? fallback);
  }
  return (json as { data: T }).data;
}

export async function fetchDashboard(days = 30): Promise<DashboardData> {
  const res = await fetch(`/api/admin/analytics/dashboard?days=${days}`);
  return unwrap<DashboardData>(res, "Failed to load dashboard metrics");
}

export async function fetchRecentLeads(
  limit = 10,
): Promise<Paginated<LeadListItem>> {
  const res = await fetch(
    `/api/admin/leads?pageSize=${limit}&sort=createdAt&order=desc`,
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (json as { error?: string }).error ?? "Failed to load recent leads",
    );
  }
  return json as Paginated<LeadListItem>;
}

export async function fetchRecentActivity(
  limit = 8,
): Promise<Paginated<ActivityItem>> {
  const res = await fetch(
    `/api/admin/team/activity?pageSize=${limit}&sort=createdAt&order=desc`,
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (json as { error?: string }).error ?? "Failed to load activity",
    );
  }
  return json as Paginated<ActivityItem>;
}

// ─────────────────────────── Formatters ─────────────────────────────────────

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(value: number): string {
  return inrFormatter.format(value);
}

const numberFormatter = new Intl.NumberFormat("en-IN");

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}
