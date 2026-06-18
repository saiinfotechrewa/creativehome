"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Toggle } from "@/components/admin/integrations/integration-kit";
import {
  HUB_BY_KEY,
  type HubEntry,
} from "@/components/admin/integrations/integration-meta";
import type {
  IntegrationKey,
  IntegrationSummary,
} from "@/lib/admin/integrations-client";

/**
 * Local editable draft of an integration's `{ config, isActive }`, seeded from
 * the server record. Re-seeds whenever the server data changes (e.g. after a
 * save returns freshly-masked secrets), which also resets the dirty flag.
 */
export function useConfigDraft(data: IntegrationSummary | undefined) {
  const [config, setConfig] = useState<Record<string, unknown>>({});
  const [isActive, setIsActive] = useState(false);
  const [baseline, setBaseline] = useState("");

  useEffect(() => {
    if (!data) return;
    const cfg = (data.config as Record<string, unknown>) ?? {};
    setConfig(cfg);
    setIsActive(data.isActive);
    setBaseline(JSON.stringify({ config: cfg, isActive: data.isActive }));
  }, [data]);

  const setField = (key: string, value: unknown) =>
    setConfig((c) => ({ ...c, [key]: value }));

  const dirty = baseline !== JSON.stringify({ config, isActive });

  return { config, isActive, setField, setConfig, setIsActive, dirty };
}

/** Header with breadcrumb, icon, title, and the master enable toggle. */
export function ConfigHeader({
  entryId,
  isActive,
  onToggleActive,
  configured,
}: {
  entryId: IntegrationKey | "webhooks" | "notifications";
  isActive?: boolean;
  onToggleActive?: (v: boolean) => void;
  configured?: boolean;
}) {
  const entry = HUB_BY_KEY.get(entryId) as HubEntry;
  const Icon = entry.icon;

  return (
    <header className="mb-6">
      <Link
        href="/admin/integrations"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Integration Hub
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card",
            entry.accent,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {entry.label}
          </h1>
          <p className="text-sm text-muted-foreground">{entry.description}</p>
        </div>

        {onToggleActive && (
          <div className="ml-auto flex items-center gap-2.5">
            <span className="text-sm text-muted-foreground">
              {isActive ? "Enabled" : "Disabled"}
            </span>
            <Toggle checked={!!isActive} onChange={onToggleActive} />
          </div>
        )}
      </div>

      {configured === false && (
        <p className="mt-3 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          Not configured yet — add credentials below and save.
        </p>
      )}
    </header>
  );
}

/** Sticky footer with a Save button; shows a hint when there are edits. */
export function SaveBar({
  onSave,
  saving,
  dirty,
  children,
}: {
  onSave: () => void;
  saving: boolean;
  dirty: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="sticky bottom-0 z-10 mt-6 flex items-center justify-between gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 backdrop-blur">
      <span className="text-xs text-muted-foreground">
        {children ??
          (dirty ? "You have unsaved changes." : "All changes saved.")}
      </span>
      <button
        type="button"
        onClick={onSave}
        disabled={saving || !dirty}
        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Save changes
      </button>
    </div>
  );
}

/** Constrained column wrapper for every config page. */
export function ConfigLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-3xl">{children}</div>;
}
