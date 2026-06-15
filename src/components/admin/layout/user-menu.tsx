"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface UserMenuProps {
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

/** Initials fallback for the avatar bubble. */
function initials(name: string, email: string): string {
  const source = name?.trim() || email;
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

/** Topbar account dropdown: identity + sign out. */
export function UserMenu({ name, email, role, avatar }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5 text-sm transition hover:bg-accent"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt={name}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            initials(name, email)
          )}
        </span>
        <span className="hidden max-w-[10rem] truncate text-foreground sm:inline">
          {name || email}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-lg border border-border bg-card shadow-xl"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-medium text-foreground">
              {name || "Admin user"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
            <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              {role}
            </span>
          </div>

          <div className="p-1">
            <a
              href="/admin/profile"
              role="menuitem"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition hover:bg-accent"
            >
              <UserIcon className="h-4 w-4" />
              My profile
            </a>
            <button
              type="button"
              role="menuitem"
              disabled={signingOut}
              onClick={async () => {
                setSigningOut(true);
                await signOut({ callbackUrl: "/admin/login" });
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 transition hover:bg-red-500/10 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
