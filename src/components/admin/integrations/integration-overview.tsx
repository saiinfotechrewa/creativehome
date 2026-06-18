"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  fetchIntegrations,
  integrationKeys,
  type IntegrationKey,
  type IntegrationSummary,
} from "@/lib/admin/integrations-client";
import {
  HUB_ENTRIES,
  type HubEntry,
} from "@/components/admin/integrations/integration-meta";

type Status = "active" | "configured" | "off" | "preview";

function statusOf(
  entry: HubEntry,
  byKey: Map<string, IntegrationSummary>,
): Status {
  if (!entry.backed) return "preview";
  if (entry.id === "notifications") return "active"; // settings-only, always available
  const s = byKey.get(entry.id);
  if (s?.isActive) return "active";
  if (s?.configured) return "configured";
  return "off";
}

const STATUS_META: Record<
  Status,
  { label: string; dot: string; text: string }
> = {
  active: {
    label: "Active",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
  },
  configured: {
    label: "Configured",
    dot: "bg-amber-400",
    text: "text-amber-400",
  },
  off: { label: "Not configured", dot: "bg-muted-foreground/40", text: "text-muted-foreground" },
  preview: { label: "Preview", dot: "bg-violet-400", text: "text-violet-400" },
};

export function IntegrationOverview() {
  const { data } = useQuery({
    queryKey: integrationKeys.list,
    queryFn: fetchIntegrations,
  });

  const byKey = new Map<string, IntegrationSummary>(
    (data ?? []).map((s) => [s.integrationKey as IntegrationKey, s]),
  );

  const activeCount = (data ?? []).filter((s) => s.isActive).length;

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">
          Integration Hub
        </h1>
        <p className="text-sm text-muted-foreground">
          Connect and configure every third-party service in one place.
          {data ? ` ${activeCount} active.` : ""}
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {HUB_ENTRIES.map((entry) => {
          const Icon = entry.icon;
          const status = statusOf(entry, byKey);
          const meta = STATUS_META[status];
          return (
            <Link
              key={entry.id}
              href={entry.href}
              className="group flex flex-col rounded-xl border border-border bg-card p-4 transition hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background",
                    entry.accent,
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>

              <h2 className="mt-3 text-sm font-semibold text-foreground">
                {entry.label}
              </h2>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {entry.description}
              </p>

              <div className="mt-3 flex items-center gap-1.5">
                <span
                  className={cn("h-1.5 w-1.5 rounded-full", meta.dot)}
                  aria-hidden
                />
                <span className={cn("text-xs font-medium", meta.text)}>
                  {meta.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
