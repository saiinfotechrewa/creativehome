"use client";

import { useState, type ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Topbar } from "@/components/admin/layout/topbar";
import { Sidebar } from "@/components/admin/layout/sidebar";

interface AdminShellProps {
  user: {
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
    permissions: string[];
  };
  children: ReactNode;
}

/**
 * App frame for the protected admin area: fixed sidebar (placeholder until
 * Task 2 drops in the permission-aware nav), sticky topbar, and the scrollable
 * content region. Manages the mobile sidebar drawer open/close state.
 *
 * `user` is resolved on the server in `(protected)/layout.tsx` and passed down,
 * so role info is available without a client session fetch.
 */
export function AdminShell({ user, children }: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar — desktop fixed / mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 lg:translate-x-0",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <span className="font-semibold tracking-tight">CreativeDox</span>
          <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
            Admin
          </span>
        </div>

        <Sidebar
          permissions={user.permissions}
          onNavigate={() => setDrawerOpen(false)}
        />
      </aside>

      {/* Mobile overlay */}
      {drawerOpen && (
        <div
          aria-hidden
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      {/* Main column */}
      <div className="lg:pl-64">
        <Topbar user={user} onMenuClick={() => setDrawerOpen(true)} />
        <main className="px-4 py-6 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
