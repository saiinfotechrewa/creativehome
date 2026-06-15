import type { AdminRole } from "@prisma/client";

/**
 * Granular permission keys, grouped as `module:action`.
 * Stored on AdminUser.permissions (JSON string[]) and checked in API routes.
 */
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: "dashboard:view",

  // Content
  PRODUCTS_VIEW: "products:view",
  PRODUCTS_MANAGE: "products:manage",
  SERVICES_VIEW: "services:view",
  SERVICES_MANAGE: "services:manage",
  INDUSTRIES_VIEW: "industries:view",
  INDUSTRIES_MANAGE: "industries:manage",
  HOMEPAGE_MANAGE: "homepage:manage",
  BLOG_VIEW: "blog:view",
  BLOG_MANAGE: "blog:manage",
  CASE_STUDIES_MANAGE: "caseStudies:manage",
  TESTIMONIALS_VIEW: "testimonials:view",
  TESTIMONIALS_MANAGE: "testimonials:manage",
  MEDIA_VIEW: "media:view",
  MEDIA_MANAGE: "media:manage",

  // CRM & sales
  LEADS_VIEW: "leads:view",
  LEADS_MANAGE: "leads:manage",
  CUSTOMERS_VIEW: "customers:view",
  CUSTOMERS_MANAGE: "customers:manage",
  ORDERS_VIEW: "orders:view",
  ORDERS_MANAGE: "orders:manage",

  // System
  SETTINGS_VIEW: "settings:view",
  SETTINGS_MANAGE: "settings:manage",
  INTEGRATIONS_MANAGE: "integrations:manage",
  USERS_VIEW: "users:view",
  USERS_MANAGE: "users:manage",
  ACTIVITY_VIEW: "activity:view",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

/**
 * Default permission set granted to each role. Individual users can be granted
 * extra permissions beyond their role default via AdminUser.permissions.
 */
export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  SUPERADMIN: ALL_PERMISSIONS,
  ADMIN: ALL_PERMISSIONS.filter(
    (p) => p !== PERMISSIONS.USERS_MANAGE && p !== PERMISSIONS.INTEGRATIONS_MANAGE,
  ),
  EDITOR: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_MANAGE,
    PERMISSIONS.SERVICES_VIEW,
    PERMISSIONS.SERVICES_MANAGE,
    PERMISSIONS.INDUSTRIES_VIEW,
    PERMISSIONS.INDUSTRIES_MANAGE,
    PERMISSIONS.HOMEPAGE_MANAGE,
    PERMISSIONS.BLOG_VIEW,
    PERMISSIONS.BLOG_MANAGE,
    PERMISSIONS.CASE_STUDIES_MANAGE,
    PERMISSIONS.TESTIMONIALS_VIEW,
    PERMISSIONS.TESTIMONIALS_MANAGE,
    PERMISSIONS.MEDIA_VIEW,
    PERMISSIONS.MEDIA_MANAGE,
    PERMISSIONS.LEADS_VIEW,
  ],
  VIEWER: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.SERVICES_VIEW,
    PERMISSIONS.INDUSTRIES_VIEW,
    PERMISSIONS.BLOG_VIEW,
    PERMISSIONS.TESTIMONIALS_VIEW,
    PERMISSIONS.MEDIA_VIEW,
    PERMISSIONS.LEADS_VIEW,
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ACTIVITY_VIEW,
  ],
};

/** Resolve the effective permission list for a role + any extra grants. */
export function resolvePermissions(
  role: AdminRole,
  extra: string[] = [],
): Permission[] {
  const base = ROLE_PERMISSIONS[role] ?? [];
  return Array.from(new Set([...base, ...extra])) as Permission[];
}

/** True if the permission list satisfies the required permission. */
export function can(
  permissions: string[] | undefined,
  required: Permission,
): boolean {
  if (!permissions) return false;
  return permissions.includes(required);
}
