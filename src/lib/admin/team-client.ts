/**
 * Client-safe data layer for the Team & Roles admin, over `/api/admin/team`.
 * Pulls the permission catalogue from `@/lib/permissions` (type-only Prisma
 * import there keeps it client-safe).
 */

import { PERMISSIONS, ROLE_PERMISSIONS } from "@/lib/permissions";

export type AdminRole = "SUPERADMIN" | "ADMIN" | "EDITOR" | "VIEWER";

export const ROLES: { value: AdminRole; label: string; description: string }[] = [
  { value: "SUPERADMIN", label: "Super Admin", description: "Full access, including team & integrations" },
  { value: "ADMIN", label: "Admin", description: "Everything except team & integration management" },
  { value: "EDITOR", label: "Editor", description: "Manage content, products & view leads" },
  { value: "VIEWER", label: "Viewer", description: "Read-only access across the panel" },
];

export const ROLE_BADGE: Record<AdminRole, string> = {
  SUPERADMIN: "bg-fuchsia-500/15 text-fuchsia-400",
  ADMIN: "bg-sky-500/15 text-sky-400",
  EDITOR: "bg-emerald-500/15 text-emerald-400",
  VIEWER: "bg-zinc-500/15 text-zinc-400",
};

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar: string | null;
  isActive: boolean;
  lastLogin: string | null;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamListMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Grouped permission catalogue for the role editor. */
export const PERMISSION_GROUPS: { label: string; permissions: { key: string; label: string }[] }[] =
  [
    {
      label: "Content",
      permissions: [
        { key: PERMISSIONS.PRODUCTS_VIEW, label: "View products" },
        { key: PERMISSIONS.PRODUCTS_MANAGE, label: "Manage products" },
        { key: PERMISSIONS.SERVICES_VIEW, label: "View services" },
        { key: PERMISSIONS.SERVICES_MANAGE, label: "Manage services" },
        { key: PERMISSIONS.INDUSTRIES_VIEW, label: "View industries" },
        { key: PERMISSIONS.INDUSTRIES_MANAGE, label: "Manage industries" },
        { key: PERMISSIONS.HOMEPAGE_MANAGE, label: "Manage homepage" },
        { key: PERMISSIONS.BLOG_VIEW, label: "View blog" },
        { key: PERMISSIONS.BLOG_MANAGE, label: "Manage blog" },
        { key: PERMISSIONS.CASE_STUDIES_MANAGE, label: "Manage case studies" },
        { key: PERMISSIONS.TESTIMONIALS_VIEW, label: "View testimonials" },
        { key: PERMISSIONS.TESTIMONIALS_MANAGE, label: "Manage testimonials" },
        { key: PERMISSIONS.MEDIA_VIEW, label: "View media" },
        { key: PERMISSIONS.MEDIA_MANAGE, label: "Manage media" },
      ],
    },
    {
      label: "CRM & Sales",
      permissions: [
        { key: PERMISSIONS.LEADS_VIEW, label: "View leads" },
        { key: PERMISSIONS.LEADS_MANAGE, label: "Manage leads" },
        { key: PERMISSIONS.CUSTOMERS_VIEW, label: "View customers" },
        { key: PERMISSIONS.CUSTOMERS_MANAGE, label: "Manage customers" },
        { key: PERMISSIONS.ORDERS_VIEW, label: "View orders" },
        { key: PERMISSIONS.ORDERS_MANAGE, label: "Manage orders" },
      ],
    },
    {
      label: "System",
      permissions: [
        { key: PERMISSIONS.DASHBOARD_VIEW, label: "View dashboard" },
        { key: PERMISSIONS.SETTINGS_VIEW, label: "View settings" },
        { key: PERMISSIONS.SETTINGS_MANAGE, label: "Manage settings" },
        { key: PERMISSIONS.INTEGRATIONS_MANAGE, label: "Manage integrations" },
        { key: PERMISSIONS.USERS_VIEW, label: "View team" },
        { key: PERMISSIONS.USERS_MANAGE, label: "Manage team" },
        { key: PERMISSIONS.ACTIVITY_VIEW, label: "View activity log" },
      ],
    },
  ];

/** Permissions a role grants by default (locked-on in the editor). */
export function roleDefaults(role: AdminRole): Set<string> {
  return new Set(ROLE_PERMISSIONS[role] ?? []);
}

export const teamKeys = {
  all: ["admin", "team"] as const,
  list: (search: string) => ["admin", "team", "list", search] as const,
};

async function unwrap<T>(res: Response, fallback: string): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? fallback);
  }
  return (json as { data: T }).data;
}

export async function fetchTeam(
  search: string,
): Promise<{ data: TeamMember[]; meta: TeamListMeta }> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  params.set("pageSize", "100");
  params.set("sort", "createdAt");
  params.set("order", "asc");

  const res = await fetch(`/api/admin/team?${params.toString()}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? "Failed to load team");
  }
  return {
    data: (json as { data?: TeamMember[] }).data ?? [],
    meta: (json as { meta?: TeamListMeta }).meta ?? {
      page: 1,
      pageSize: 100,
      total: 0,
      totalPages: 1,
    },
  };
}

export interface InvitePayload {
  name: string;
  email: string;
  role: AdminRole;
  permissions: string[];
  password?: string;
}

export function inviteMember(
  payload: InvitePayload,
): Promise<{ user: TeamMember; tempPassword?: string }> {
  return fetch("/api/admin/team", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => unwrap(res, "Failed to invite member"));
}

export function updateMember(
  id: string,
  patch: { name?: string; role?: AdminRole; permissions?: string[]; isActive?: boolean },
): Promise<TeamMember> {
  return fetch(`/api/admin/team/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  }).then((res) => unwrap<TeamMember>(res, "Failed to update member"));
}

export function deactivateMember(id: string): Promise<TeamMember> {
  return fetch(`/api/admin/team/${id}/deactivate`, { method: "POST" }).then((res) =>
    unwrap<TeamMember>(res, "Failed to deactivate member"),
  );
}
