"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Loader2, Search, Inbox } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  fetchLeads,
  fetchAssignees,
  leadKeys,
  LEAD_STATUSES,
  LEAD_SOURCES,
  LEAD_PRIORITIES,
  sourceLabel,
  priorityMeta,
  type LeadFilters,
} from "@/lib/admin/leads-client";
import { LeadStatusBadge } from "@/components/admin/leads/lead-status-badge";

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

const selectClass =
  "h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function LeadsInbox() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [page, setPage] = useState(1);

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to page 1 whenever a filter changes.
  useEffect(() => {
    setPage(1);
  }, [debounced, status, source, priority, assignedTo]);

  const filters: LeadFilters = useMemo(
    () => ({
      search: debounced,
      status: status as LeadFilters["status"],
      source: source as LeadFilters["source"],
      priority: priority as LeadFilters["priority"],
      assignedTo,
      page,
    }),
    [debounced, status, source, priority, assignedTo, page],
  );

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: leadKeys.list(filters),
    queryFn: () => fetchLeads(filters),
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
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground">
            Every enquiry from the website lands here.
          </p>
        </div>
        {meta && (
          <span className="text-sm text-muted-foreground">
            {meta.total} total
          </span>
        )}
      </header>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[16rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone, business…"
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select className={selectClass} value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">All sources</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select className={selectClass} value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">Any priority</option>
          {LEAD_PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <select className={selectClass} value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
          <option value="">Anyone</option>
          <option value="unassigned">Unassigned</option>
          {assignees?.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid grid-cols-12 gap-2 border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <div className="col-span-4">Lead</div>
          <div className="col-span-2">Source</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Assigned</div>
          <div className="col-span-2 text-right">Received</div>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading leads…
          </div>
        ) : isError ? (
          <div className="py-16 text-center text-sm text-rose-400">
            {(error as Error).message}
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-sm text-muted-foreground">
            <Inbox className="h-6 w-6" />
            No leads match these filters.
          </div>
        ) : (
          <ul className={cn("divide-y divide-border", isFetching && "opacity-60")}>
            {leads.map((lead) => {
              const pr = priorityMeta(lead.priority);
              return (
                <li
                  key={lead.id}
                  onClick={() => router.push(`/admin/leads/${lead.id}`)}
                  className="grid cursor-pointer grid-cols-12 items-center gap-2 px-4 py-3 text-sm transition hover:bg-accent/50"
                >
                  <div className="col-span-4 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-foreground">
                        {lead.name}
                      </span>
                      <span className={cn("text-xs font-medium", pr.badge)}>
                        {pr.label}
                      </span>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {lead.email || lead.phone || "—"}
                      {lead.businessName ? ` · ${lead.businessName}` : ""}
                    </div>
                  </div>
                  <div className="col-span-2 text-muted-foreground">
                    {sourceLabel(lead.source)}
                  </div>
                  <div className="col-span-2">
                    <LeadStatusBadge status={lead.status} />
                  </div>
                  <div className="col-span-2 truncate text-muted-foreground">
                    {lead.assignedToName ?? (
                      <span className="text-muted-foreground/60">Unassigned</span>
                    )}
                  </div>
                  <div className="col-span-2 text-right text-xs text-muted-foreground">
                    {timeAgo(lead.createdAt)}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
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
