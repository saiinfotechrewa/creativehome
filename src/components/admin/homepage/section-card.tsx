"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

/** A small accessible on/off switch. */
function Switch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition disabled:opacity-50",
        checked ? "bg-primary" : "bg-muted/40",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition",
          checked ? "translate-x-4" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

interface SectionCardProps {
  label: string;
  description: string;
  isActive: boolean;
  onToggleActive: () => void;
  toggling?: boolean;
  canManage: boolean;
  children: ReactNode;
}

/** Expandable card for one homepage section: header + active toggle + editor. */
export function SectionCard({
  label,
  description,
  isActive,
  onToggleActive,
  toggling,
  canManage,
  children,
}: SectionCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card transition",
        !isActive && "opacity-70",
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition",
              open && "rotate-180",
            )}
          />
          <span>
            <span className="block text-sm font-semibold text-foreground">
              {label}
            </span>
            <span className="block text-xs text-muted-foreground">
              {description}
            </span>
          </span>
        </button>

        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
            isActive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-muted/30 text-muted-foreground",
          )}
        >
          {isActive ? (
            <Eye className="h-3 w-3" />
          ) : (
            <EyeOff className="h-3 w-3" />
          )}
          {isActive ? "Visible" : "Hidden"}
        </span>

        <Switch
          checked={isActive}
          onChange={onToggleActive}
          disabled={!canManage || toggling}
        />
      </div>

      {open && (
        <div className="border-t border-border p-4 sm:p-5">{children}</div>
      )}
    </div>
  );
}
