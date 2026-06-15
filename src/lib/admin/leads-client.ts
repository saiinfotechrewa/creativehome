import type { LeadSource, LeadStatus, Priority } from "@prisma/client";

/**
 * Client-safe lead types, display constants, query keys and fetchers.
 * No server-only imports (no Prisma client) so this is safe in "use client"
 * components.
 */

// ───────────────────────────── Types ────────────────────────────────────────

export interface LeadNote {
  id: string;
  by: string | null;
  byName: string | null;
  at: string;
  text: string;
}

export interface LeadActivity {
  id: string;
  userId: string | null;
  userName: string | null;
  action: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface LeadListItem {
  id: string;
  source: LeadSource;
  status: LeadStatus;
  priority: Priority;
  name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  businessName: string | null;
  businessType: string | null;
  teamSize: string | null;
  description: string | null;
  interestedProducts: string[];
  assignedTo: string | null;
  assignedToName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadDetail extends LeadListItem {
  consultation: Record<string, unknown>;
  utm: Record<string, unknown>;
  notes: LeadNote[];
  communications: unknown[];
  assignee: { id: string; name: string; email: string } | null;
  activities: LeadActivity[];
}

export interface Assignee {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}

export interface LeadFilters {
  search?: string;
  status?: LeadStatus | "";
  source?: LeadSource | "";
  priority?: Priority | "";
  assignedTo?: string;
  page?: number;
}

// ─────────────────────────── Display config ─────────────────────────────────

export const LEAD_STATUSES: {
  value: LeadStatus;
  label: string;
  badge: string;
}[] = [
  { value: "NEW", label: "New", badge: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  { value: "CONTACTED", label: "Contacted", badge: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30" },
  { value: "QUALIFIED", label: "Qualified", badge: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
  { value: "NEGOTIATION", label: "Negotiation", badge: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  { value: "CONVERTED", label: "Converted", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  { value: "LOST", label: "Lost", badge: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
];

export const LEAD_SOURCES: { value: LeadSource; label: string }[] = [
  { value: "CONTACT", label: "Contact form" },
  { value: "DEMO", label: "Demo request" },
  { value: "CONSULTATION", label: "Consultation" },
  { value: "WHATSAPP", label: "WhatsApp" },
];

export const LEAD_PRIORITIES: {
  value: Priority;
  label: string;
  badge: string;
}[] = [
  { value: "LOW", label: "Low", badge: "text-muted-foreground" },
  { value: "MEDIUM", label: "Medium", badge: "text-blue-400" },
  { value: "HIGH", label: "High", badge: "text-amber-400" },
  { value: "URGENT", label: "Urgent", badge: "text-rose-400" },
];

export function statusMeta(status: LeadStatus) {
  return LEAD_STATUSES.find((s) => s.value === status) ?? LEAD_STATUSES[0]!;
}
export function sourceLabel(source: LeadSource) {
  return LEAD_SOURCES.find((s) => s.value === source)?.label ?? source;
}
export function priorityMeta(priority: Priority) {
  return LEAD_PRIORITIES.find((p) => p.value === priority) ?? LEAD_PRIORITIES[1]!;
}

// ─────────────────────────── Query keys ─────────────────────────────────────

export const leadKeys = {
  all: ["admin", "leads"] as const,
  list: (filters: LeadFilters) => ["admin", "leads", "list", filters] as const,
  detail: (id: string) => ["admin", "leads", "detail", id] as const,
  assignees: ["admin", "leads", "assignees"] as const,
};

// ─────────────────────────── Fetchers ───────────────────────────────────────

async function unwrap<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? "Request failed");
  }
  return (json as { data: T }).data;
}

export async function fetchLeads(
  filters: LeadFilters,
): Promise<Paginated<LeadListItem>> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.source) params.set("source", filters.source);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.assignedTo) params.set("assignedTo", filters.assignedTo);
  params.set("page", String(filters.page ?? 1));

  const res = await fetch(`/api/admin/leads?${params.toString()}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? "Failed to load leads");
  }
  return json as Paginated<LeadListItem>;
}

export async function fetchLead(id: string): Promise<LeadDetail> {
  const res = await fetch(`/api/admin/leads/${id}`);
  return unwrap<LeadDetail>(res);
}

export async function fetchAssignees(): Promise<Assignee[]> {
  const res = await fetch("/api/admin/leads/assignees");
  return unwrap<Assignee[]>(res);
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
  note?: string,
): Promise<LeadDetail> {
  const res = await fetch(`/api/admin/leads/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, note }),
  });
  return unwrap<LeadDetail>(res);
}

export async function assignLead(
  id: string,
  assignedTo: string | null,
): Promise<LeadDetail> {
  const res = await fetch(`/api/admin/leads/${id}/assign`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assignedTo }),
  });
  return unwrap<LeadDetail>(res);
}

export async function addLeadNote(
  id: string,
  text: string,
): Promise<{ note: LeadNote; notes: LeadNote[] }> {
  const res = await fetch(`/api/admin/leads/${id}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return unwrap<{ note: LeadNote; notes: LeadNote[] }>(res);
}
