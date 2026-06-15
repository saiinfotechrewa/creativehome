"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { UserMenu } from "@/components/admin/layout/user-menu";

interface TopbarProps {
  user: {
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
  };
  /** Opens the sidebar drawer on mobile. */
  onMenuClick: () => void;
}

/** Turn `/admin/leads/123` into [{label:"Dashboard",href:"/admin"}, ...]. */
function useBreadcrumb(pathname: string) {
  const segments = pathname.split("/").filter(Boolean); // ["admin","leads","123"]
  const crumbs: { label: string; href: string }[] = [];
  let href = "";
  for (const seg of segments) {
    href += `/${seg}`;
    const label =
      seg === "admin"
        ? "Dashboard"
        : seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, href });
  }
  return crumbs;
}

/** Sticky admin header: mobile menu toggle, breadcrumb, account menu. */
export function Topbar({ user, onMenuClick }: TopbarProps) {
  const pathname = usePathname() ?? "/admin";
  const crumbs = useBreadcrumb(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="rounded-md p-1.5 text-foreground transition hover:bg-accent lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm">
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <span className="text-muted-foreground/50">/</span>
                  )}
                  {isLast ? (
                    <span className="font-medium text-foreground">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-muted-foreground transition hover:text-foreground"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <UserMenu
        name={user.name}
        email={user.email}
        role={user.role}
        avatar={user.avatar}
      />
    </header>
  );
}
