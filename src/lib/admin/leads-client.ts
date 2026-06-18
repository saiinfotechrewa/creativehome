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

export type CommunicationChannel = "email" | "whatsapp" | "call";

export interface Communication {
  id: string;
  channel: CommunicationChannel;
  subject: string | null;
  summary: string;
  by: string | null;
  byName: string | null;
  at: string;
  /** "sent" | "not_delivered" | "logged" */
  status: string;
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
  communications: Communication[];
  assignee: { id: string; name: string; email: string } | null;
  activities: LeadActivity[];
}

/** Headline metrics for the Leads Manager cards (from /analytics/leads). */
export interface LeadAnalytics {
  total: number;
  converted: number;
  newToday: number;
  avgResponseHours: number | null;
  conversionRate: number;
  byStatus: { key: string; count: number }[];
  bySource: { key: string; count: number }[];
  byPriority: { key: string; count: number }[];
  daily: { date: string; value: number }[];
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
  /** Multi-select statuses; OR'd together server-side. */
  statuses?: LeadStatus[];
  source?: LeadSource | "";
  priority?: Priority | "";
  businessType?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
}

/** Build the shared query string from filters (used by list + export). */
function filtersToParams(filters: LeadFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.statuses?.length) params.set("statuses", filters.statuses.join(","));
  if (filters.source) params.set("source", filters.source);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.businessType) params.set("businessType", filters.businessType);
  if (filters.assignedTo) params.set("assignedTo", filters.assignedTo);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  return params;
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
  analytics: ["admin", "leads", "analytics"] as const,
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
  const params = filtersToParams(filters);
  params.set("page", String(filters.page ?? 1));

  const res = await fetch(`/api/admin/leads?${params.toString()}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? "Failed to load leads");
  }
  return json as Paginated<LeadListItem>;
}

/** Absolute URL for the CSV export, honouring the current filters. */
export function leadsExportUrl(filters: LeadFilters): string {
  return `/api/admin/leads/export?${filtersToParams(filters).toString()}`;
}

export async function fetchLeadAnalytics(days = 30): Promise<LeadAnalytics> {
  const res = await fetch(`/api/admin/analytics/leads?days=${days}`);
  return unwrap<LeadAnalytics>(res);
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

export async function updateLeadPriority(
  id: string,
  priority: Priority,
): Promise<LeadDetail> {
  const res = await fetch(`/api/admin/leads/${id}/priority`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priority }),
  });
  return unwrap<LeadDetail>(res);
}

export interface CommunicationResult {
  entry: Communication;
  communications: Communication[];
  delivered: boolean;
}

export async function sendCommunication(
  id: string,
  input: { channel: CommunicationChannel; subject?: string; message: string },
): Promise<CommunicationResult> {
  const res = await fetch(`/api/admin/leads/${id}/communications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return unwrap<CommunicationResult>(res);
}

export interface ConvertInput {
  email?: string;
  phone?: string;
  gstNumber?: string;
}

export async function convertLead(
  id: string,
  input: ConvertInput,
): Promise<{ customer: { id: string; email: string } }> {
  const res = await fetch(`/api/admin/leads/${id}/convert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return unwrap<{ customer: { id: string; email: string } }>(res);
}

export async function deleteLead(id: string): Promise<{ id: string }> {
  const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
  return unwrap<{ id: string }>(res);
}

// ─────────────────────────── WhatsApp templates ─────────────────────────────

/**
 * Canned WhatsApp message templates. `{{var}}` placeholders are resolved from a
 * variables map in the composer; `name` is pre-filled from the lead, the rest
 * are editable before sending.
 */
export interface WhatsAppTemplate {
  id: string;
  label: string;
  /** Placeholder keys (without braces) used in `body`, in display order. */
  variables: string[];
  body: string;
}

export const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: "intro",
    label: "Introduction",
    variables: ["name", "agent"],
    body:
      "Hi {{name}}, this is {{agent}} from CreativeDox. Thanks for reaching out! " +
      "I'd love to understand your requirements better. When would be a good time " +
      "for a quick call?",
  },
  {
    id: "follow_up",
    label: "Follow-up",
    variables: ["name", "product"],
    body:
      "Hi {{name}}, just following up on your interest in {{product}}. Do you have " +
      "any questions I can help with? Happy to set up a quick demo.",
  },
  {
    id: "demo_invite",
    label: "Demo invite",
    variables: ["name", "date", "time"],
    body:
      "Hi {{name}}, we've scheduled your demo for {{date}} at {{time}}. You'll " +
      "receive a meeting link shortly. Looking forward to showing you around!",
  },
  {
    id: "quote",
    label: "Quote / pricing",
    variables: ["name", "product", "price"],
    body:
      "Hi {{name}}, here are the pricing details for {{product}}: {{price}}. Let " +
      "me know if you'd like to proceed or have any questions.",
  },
];

/** Substitute `{{var}}` placeholders in a template body. */
export function renderTemplate(
  body: string,
  vars: Record<string, string>,
): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    vars[key]?.trim() ? vars[key] : `{{${key}}}`,
  );
}
