"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Loader2, Inbox, Download, Eye } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  fetchLeads,
  fetchAssignees,
  leadKeys,
  leadsExportUrl,
  type LeadFilters,
} from "@/lib/admin/leads-client";
import { LeadStatusBadge } from "@/components/admin/leads/lead-status-badge";
import { LeadMetricCards } from "@/components/admin/leads/lead-metric-cards";
import {
  LeadFiltersBar,
  EMPTY_FILTERS,
  type LeadFilterState,
} from "@/components/admin/leads/lead-filters";
import {
  SourceBadge,
  BusinessBadge,
  PriorityTag,
} from "@/components/admin/leads/lead-badges";

/** Compact relative time, e.g. "3h ago". */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

/** Translate the UI filter state into the API filter payload. */
function toApiFilters(f: LeadFilterState, page: number): LeadFilters {
  return {
    search: f.search,
    statuses: f.statuses,
    source: (f.source || undefined) as LeadFilters["source"],
    priority: (f.priority || undefined) as LeadFilters["priority"],
    businessType: f.businessType || undefined,
    assignedTo: f.assignedTo || undefined,
    dateFrom: f.dateFrom || undefined,
    // Make the end date inclusive of the whole day.
    dateTo: f.dateTo ? `${f.dateTo}T23:59:59` : undefined,
    page,
  };
}

export function LeadsManager() {
  const router = useRouter();

  const [filters, setFilters] = useState<LeadFilterState>(EMPTY_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce the search box so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(t);
  }, [filters.search]);

  // Reset to page 1 whenever any filter changes.
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    filters.statuses,
    filters.source,
    filters.priority,
    filters.businessType,
    filters.assignedTo,
    filters.dateFrom,
    filters.dateTo,
  ]);

  const apiFilters = useMemo(
    () => toApiFilters({ ...filters, search: debouncedSearch }, page),
    [filters, debouncedSearch, page],
  );

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: leadKeys.list(apiFilters),
    queryFn: () => fetchLeads(apiFilters),
    placeholderData: keepPreviousData,
  });

  const { data: assignees } = useQuery({
    queryKey: leadKeys.assignees,
    queryFn: fetchAssignees,
    staleTime: 5 * 60_000,
  });

  const leads = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground">
            Every enquiry from the website lands here.
          </p>
        </div>
        <a
          href={leadsExportUrl(apiFilters)}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium text-foreground transition hover:bg-accent"
        >
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </header>

      <LeadMetricCards />

      <LeadFiltersBar
        value={filters}
        onChange={setFilters}
        assignees={assignees}
      />

      <div className="mb-3 text-sm text-muted-foreground">
        {meta ? `${meta.total} lead${meta.total === 1 ? "" : "s"}` : " "}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[960px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5">Lead</th>
              <th className="px-4 py-2.5">Business</th>
              <th className="px-4 py-2.5">Source</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Priority</th>
              <th className="px-4 py-2.5">Products</th>
              <th className="px-4 py-2.5">Assigned</th>
              <th className="px-4 py-2.5 text-right">Received</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={cn("divide-y divide-border", isFetching && "opacity-60")}>
            {isPending ? (
              <tr>
                <td colSpan={9}>
                  <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading leads…
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={9}>
                  <div className="py-16 text-center text-sm text-rose-400">
                    {(error as Error).message}
                  </div>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="flex flex-col items-center gap-2 py-16 text-center text-sm text-muted-foreground">
                    <Inbox className="h-6 w-6" />
                    No leads match these filters.
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => router.push(`/admin/leads/${lead.id}`)}
                  className="cursor-pointer transition hover:bg-accent/50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{lead.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {lead.email || lead.phone || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-foreground">
                      {lead.businessName || (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </div>
                    <div className="mt-0.5">
                      <BusinessBadge type={lead.businessType} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <SourceBadge source={lead.source} />
                  </td>
                  <td className="px-4 py-3">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityTag priority={lead.priority} />
                  </td>
                  <td className="px-4 py-3">
                    {lead.interestedProducts.length === 0 ? (
                      <span className="text-muted-foreground/60">—</span>
                    ) : (
                      <div className="flex max-w-[12rem] flex-wrap gap-1">
                        {lead.interestedProducts.slice(0, 2).map((p) => (
                          <span
                            key={p}
                            className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground"
                          >
                            {p}
                          </span>
                        ))}
                        {lead.interestedProducts.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{lead.interestedProducts.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {lead.assignedToName ?? (
                      <span className="text-muted-foreground/60">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                    {timeAgo(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-xs text-primary">
                      <Eye className="h-3.5 w-3.5" /> View
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={meta.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-9 rounded-md border border-border px-3 text-foreground transition hover:bg-accent disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={meta.page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-9 rounded-md border border-border px-3 text-foreground transition hover:bg-accent disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
