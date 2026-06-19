"use client";

import type { FormEvent, ReactNode } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Shared building blocks for the section editors: a form shell that handles
 * loading / error / save states, a card wrapper for repeatable rows, and an
 * "add row" button. Keeps each editor focused on its own fields.
 */

interface EditorShellProps {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  isSaving: boolean;
  isDirty: boolean;
  canManage: boolean;
  onSubmit: (e?: FormEvent) => void;
  children: ReactNode;
}

export function EditorShell({
  isLoading,
  isError,
  error,
  isSaving,
  isDirty,
  canManage,
  onSubmit,
  children,
}: EditorShellProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    );
  }
  if (isError) {
    return (
      <div className="py-12 text-center text-sm text-rose-400">
        {error?.message ?? "Failed to load this section."}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {children}

      {canManage && (
        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          {isDirty && (
            <span className="text-xs text-amber-400">Unsaved changes</span>
          )}
          <button
            type="submit"
            disabled={isSaving || !isDirty}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save section
          </button>
        </div>
      )}
    </form>
  );
}

interface RowCardProps {
  title?: string;
  onRemove?: () => void;
  removeLabel?: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

/** Bordered wrapper for one item in a repeatable list, with a remove button. */
export function RowCard({
  title,
  onRemove,
  removeLabel = "Remove",
  disabled,
  children,
  className,
}: RowCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card/40 p-4", className)}>
      {(title || onRemove) && (
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </span>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-rose-400 transition hover:bg-rose-500/10 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {removeLabel}
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export function AddItemButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 items-center gap-2 rounded-md border border-dashed border-border px-4 text-sm font-medium text-muted-foreground transition hover:border-primary/60 hover:text-foreground disabled:opacity-50"
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );
}
