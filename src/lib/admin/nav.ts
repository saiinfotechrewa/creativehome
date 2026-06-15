import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BookOpen,
  Building2,
  FileText,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  MessageSquareQuote,
  Package,
  Plug,
  Settings,
  ShoppingCart,
  Target,
  Users,
  UsersRound,
  Wrench,
} from "lucide-react";

import { PERMISSIONS, type Permission } from "@/lib/permissions";

/** Which live counter (from /api/admin/nav-counts) a nav item displays. */
export type BadgeKey = "newLeads" | "pendingOrders" | "pendingTestimonials";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Permission required to see this item (filtered in the sidebar). */
  permission: Permission;
  /** Optional live badge. */
  badgeKey?: BadgeKey;
  /** Match the route exactly (used for the dashboard root). */
  exact?: boolean;
}

export interface NavGroup {
  /** Section heading; `null` renders an ungrouped block (the dashboard). */
  label: string | null;
  items: NavItem[];
}

/**
 * Single source of truth for the admin sidebar. Routes that don't exist yet
 * (built in later tasks) still render here — they resolve to the admin
 * not-found page until their module ships.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: null,
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        permission: PERMISSIONS.DASHBOARD_VIEW,
        exact: true,
      },
    ],
  },
  {
    label: "Sales & CRM",
    items: [
      {
        label: "Leads",
        href: "/admin/leads",
        icon: Target,
        permission: PERMISSIONS.LEADS_VIEW,
        badgeKey: "newLeads",
      },
      {
        label: "Customers",
        href: "/admin/customers",
        icon: Users,
        permission: PERMISSIONS.CUSTOMERS_VIEW,
      },
      {
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
        permission: PERMISSIONS.ORDERS_VIEW,
        badgeKey: "pendingOrders",
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
        permission: PERMISSIONS.PRODUCTS_VIEW,
      },
      {
        label: "Services",
        href: "/admin/services",
        icon: Wrench,
        permission: PERMISSIONS.SERVICES_VIEW,
      },
      {
        label: "Industries",
        href: "/admin/industries",
        icon: Building2,
        permission: PERMISSIONS.INDUSTRIES_VIEW,
      },
      {
        label: "Homepage",
        href: "/admin/homepage",
        icon: Home,
        permission: PERMISSIONS.HOMEPAGE_MANAGE,
      },
      {
        label: "Blog",
        href: "/admin/blog",
        icon: FileText,
        permission: PERMISSIONS.BLOG_VIEW,
      },
      {
        label: "Testimonials",
        href: "/admin/testimonials",
        icon: MessageSquareQuote,
        permission: PERMISSIONS.TESTIMONIALS_VIEW,
        badgeKey: "pendingTestimonials",
      },
      {
        label: "Case Studies",
        href: "/admin/case-studies",
        icon: BookOpen,
        permission: PERMISSIONS.CASE_STUDIES_MANAGE,
      },
      {
        label: "Media",
        href: "/admin/media",
        icon: ImageIcon,
        permission: PERMISSIONS.MEDIA_VIEW,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Settings",
        href: "/admin/settings/company",
        icon: Settings,
        permission: PERMISSIONS.SETTINGS_VIEW,
      },
      {
        label: "Integrations",
        href: "/admin/integrations",
        icon: Plug,
        permission: PERMISSIONS.INTEGRATIONS_MANAGE,
      },
      {
        label: "Team & Roles",
        href: "/admin/team",
        icon: UsersRound,
        permission: PERMISSIONS.USERS_VIEW,
      },
      {
        label: "Activity Log",
        href: "/admin/activity",
        icon: Activity,
        permission: PERMISSIONS.ACTIVITY_VIEW,
      },
    ],
  },
];
