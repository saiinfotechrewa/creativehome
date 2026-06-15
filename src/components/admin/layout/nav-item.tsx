"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { NavItem as NavItemType } from "@/lib/admin/nav";
import { NavBadge } from "@/components/admin/layout/nav-badge";

interface NavItemProps {
  item: NavItemType;
  /** Called after navigation — used to close the mobile drawer. */
  onNavigate?: () => void;
}

/** Is `item` the active route? Exact for the dashboard, prefix otherwise. */
function isActive(pathname: string, item: NavItemType): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function NavItem({ item, onNavigate }: NavItemProps) {
  const pathname = usePathname() ?? "";
  const active = isActive(pathname, item);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{item.label}</span>
      {item.badgeKey && <NavBadge badgeKey={item.badgeKey} />}
    </Link>
  );
}
