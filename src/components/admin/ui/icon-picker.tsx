"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

import { ICONS, getIcon, type IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { labelClass } from "@/components/admin/ui/form";

const ICON_NAMES = Object.keys(ICONS) as IconName[];

/** Turn `calendar-clock` into `calendar clock` for fuzzy matching. */
function humanize(name: string): string {
  return name.replace(/-/g, " ");
}

interface IconPickerProps {
  value: string;
  onChange: (icon: IconName) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Searchable Lucide icon picker backed by the central `@/lib/icons` registry,
 * so every chosen icon resolves on the public site via `getIcon()`.
 */
export function IconPicker({
  value,
  onChange,
  label,
  error,
  disabled,
  className,
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ICON_NAMES;
    return ICON_NAMES.filter((name) => humanize(name).includes(q));
  }, [query]);

  const Selected = value && value in ICONS ? getIcon(value as IconName) : null;

  return (
    <div className={className}>
      {label && <label className={labelClass}>{label}</label>}
      <div ref={rootRef} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex h-10 w-full items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50",
            error && "border-rose-400/60",
          )}
        >
          {Selected ? (
            <Selected className="h-4 w-4 text-primary" />
          ) : (
            <span className="h-4 w-4 rounded bg-muted" />
          )}
          <span className="truncate text-muted-foreground">
            {value ? humanize(value) : "Pick an icon"}
          </span>
          <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
        </button>

        {open && (
          <div className="absolute z-30 mt-1 w-72 overflow-hidden rounded-md border border-border bg-card shadow-xl">
            <div className="flex items-center gap-2 border-b border-border px-2.5 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search icons…"
                className="h-6 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="grid max-h-60 grid-cols-6 gap-1 overflow-y-auto p-2">
              {results.map((name) => {
                const Icon = getIcon(name);
                const active = name === value;
                return (
                  <button
                    key={name}
                    type="button"
                    title={humanize(name)}
                    onClick={() => {
                      onChange(name);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-accent",
                      active
                        ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
              {results.length === 0 && (
                <p className="col-span-6 py-6 text-center text-xs text-muted-foreground">
                  No icons match “{query}”.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  );
}
