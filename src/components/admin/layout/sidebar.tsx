"use client";

import { useMemo } from "react";

import { can } from "@/lib/permissions";
import { NAV_GROUPS } from "@/lib/admin/nav";
import { NavGroup } from "@/components/admin/layout/nav-group";

interface SidebarProps {
  /** Effective permissions for the signed-in user. */
  permissions: string[];
  /** Close the mobile drawer after a navigation. */
  onNavigate?: () => void;
}

/**
 * Permission-aware navigation. Filters every item against the user's
 * permissions and drops sections that end up empty, so each role sees only
 * what it can use (e.g. a VIEWER never sees Integrations or Team).
 */
export function Sidebar({ permissions, onNavigate }: SidebarProps) {
  const groups = useMemo(
    () =>
      NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => can(permissions, item.permission)),
      })).filter((group) => group.items.length > 0),
    [permissions],
  );

  return (
    <nav
      aria-label="Admin navigation"
      className="flex-1 overflow-y-auto px-3 pb-6"
    >
      {groups.map((group, i) => (
        <NavGroup
          key={group.label ?? `group-${i}`}
          group={group}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
