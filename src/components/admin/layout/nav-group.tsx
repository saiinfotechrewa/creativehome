"use client";

import type { NavGroup as NavGroupType } from "@/lib/admin/nav";
import { NavItem } from "@/components/admin/layout/nav-item";

interface NavGroupProps {
  group: NavGroupType;
  onNavigate?: () => void;
}

/**
 * Renders a section of the sidebar. The caller is responsible for filtering
 * out items the user can't access; a group with no items isn't rendered.
 */
export function NavGroup({ group, onNavigate }: NavGroupProps) {
  if (group.items.length === 0) return null;

  return (
    <div className="py-1">
      {group.label && (
        <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          {group.label}
        </p>
      )}
      <div className="space-y-0.5">
        {group.items.map((item) => (
          <NavItem key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}
