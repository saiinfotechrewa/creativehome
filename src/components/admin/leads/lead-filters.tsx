"use client";

import type { LeadStatus } from "@prisma/client";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  LEAD_STATUSES,
  LEAD_SOURCES,
  LEAD_PRIORITIES,
  type Assignee,
} from "@/lib/admin/leads-client";

export interface LeadFilterState {
  search: string;
  statuses: LeadStatus[];
  source: string;
  priority: string;
  businessType: string;
  assignedTo: string;
  dateFrom: string;
  dateTo: string;
}

export const EMPTY_FILTERS: LeadFilterState = {
  search: "",
  statuses: [],
  source: "",
  priority: "",
  businessType: "",
  assignedTo: "",
  dateFrom: "",
  dateTo: "",
};

const selectClass =
  "h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

const dateClass =
  "h-9 rounded-md border border-border bg-background px-2 text-sm text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function hasActiveFilters(f: LeadFilterState): boolean {
  return (
    f.search !== "" ||
    f.statuses.length > 0 ||
    f.source !== "" ||
    f.priority !== "" ||
    f.businessType !== "" ||
    f.assignedTo !== "" ||
    f.dateFrom !== "" ||
    f.dateTo !== ""
  );
}

export function LeadFiltersBar({
  value,
  onChange,
  assignees,
}: {
  value: LeadFilterState;
  onChange: (next: LeadFilterState) => void;
  assignees: Assignee[] | undefined;
}) {
  const patch = (p: Partial<LeadFilterState>) => onChange({ ...value, ...p });

  const toggleStatus = (s: LeadStatus) =>
    patch({
      statuses: value.statuses.includes(s)
        ? value.statuses.filter((x) => x !== s)
        : [...value.statuses, s],
    });

  return (
    <div className="mb-4 space-y-3">
      {/* Status multi-select pills */}
      <div className="flex flex-wrap gap-1.5">
        {LEAD_STATUSES.map((s) => {
          const active = value.statuses.includes(s.value);
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => toggleStatus(s.value)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition",
                active
                  ? s.badge
                  : "border-border text-muted-foreground hover:bg-accent",
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Search + dropdowns + date range */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[15rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={value.search}
            onChange={(e) => patch({ search: e.target.value })}
            placeholder="Search name, email, phone, business…"
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <select
          className={selectClass}
          value={value.source}
          onChange={(e) => patch({ source: e.target.value })}
        >
          <option value="">All sources</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={value.priority}
          onChange={(e) => patch({ priority: e.target.value })}
        >
          <option value="">Any priority</option>
          {LEAD_PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        <input
          value={value.businessType}
          onChange={(e) => patch({ businessType: e.target.value })}
          placeholder="Business type"
          className="h-9 w-36 rounded-md border border-border bg-background px-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

        <select
          className={selectClass}
          value={value.assignedTo}
          onChange={(e) => patch({ assignedTo: e.target.value })}
        >
          <option value="">Anyone</option>
          <option value="unassigned">Unassigned</option>
          {assignees?.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <input
            type="date"
            aria-label="From date"
            value={value.dateFrom}
            onChange={(e) => patch({ dateFrom: e.target.value })}
            className={dateClass}
          />
          <span>–</span>
          <input
            type="date"
            aria-label="To date"
            value={value.dateTo}
            onChange={(e) => patch({ dateTo: e.target.value })}
            className={dateClass}
          />
        </div>

        {hasActiveFilters(value) && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-2.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
