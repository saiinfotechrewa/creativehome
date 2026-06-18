"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2,
  BookOpen,
  Plus,
  Search,
  Pencil,
  Archive,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/admin/ui/modal";
import {
  fetchCaseStudies,
  deleteCaseStudy,
  caseStudyKeys,
  caseStudyStatusMeta,
  CASE_STUDY_STATUSES,
  type CaseStudyFilters,
  type CaseStudyListItem,
} from "@/lib/admin/case-studies-client";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CaseStudiesManager({ canManage }: { canManage: boolean }) {
  const router = useRouter();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [archiving, setArchiving] = useState<CaseStudyListItem | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const filters = useMemo<CaseStudyFilters>(
    () => ({
      search: debouncedSearch || undefined,
      status: (statusFilter || undefined) as CaseStudyFilters["status"],
      includeArchived: statusFilter === "ARCHIVED",
      page,
    }),
    [debouncedSearch, statusFilter, page],
  );

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: caseStudyKeys.list(filters),
    queryFn: () => fetchCaseStudies(filters),
    placeholderData: keepPreviousData,
  });

  const archiveMutation = useMutation({
    mutationFn: (slug: string) => deleteCaseStudy(slug),
    onSuccess: () => {
      toast.success("Case study archived");
      setArchiving(null);
      qc.invalidateQueries({ queryKey: caseStudyKeys.all });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const items = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Case Studies</h1>
          <p className="text-sm text-muted-foreground">
            Customer success stories featured across the site.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={() => router.push("/admin/case-studies/new")}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> New case study
          </button>
        )}
      </header>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[14rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or slug…"
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {CASE_STUDY_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 text-sm text-muted-foreground">
        {meta ? `${meta.total} case stud${meta.total === 1 ? "y" : "ies"}` : " "}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5">Title</th>
              <th className="px-4 py-2.5">Client</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5 text-right">Updated</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody
            className={cn("divide-y divide-border", isFetching && "opacity-60")}
          >
            {isPending ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5}>
                  <div className="py-16 text-center text-sm text-rose-400">
                    {(error as Error).message}
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex flex-col items-center gap-2 py-16 text-center text-sm text-muted-foreground">
                    <BookOpen className="h-6 w-6" />
                    No case studies yet.
                  </div>
                </td>
              </tr>
            ) : (
              items.map((cs) => {
                const meta = caseStudyStatusMeta(cs.status);
                return (
                  <tr
                    key={cs.id}
                    onClick={() =>
                      router.push(`/admin/case-studies/${cs.slug}`)
                    }
                    className="cursor-pointer transition hover:bg-accent/50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">
                        {cs.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        /{cs.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {cs.client?.name || (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                          meta.badge,
                        )}
                      >
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                      {formatDate(cs.updatedAt)}
                    </td>
                    <td
                      className="px-4 py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/admin/case-studies/${cs.slug}`)
                          }
                          aria-label="Edit"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground transition hover:bg-accent"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        {canManage && cs.status !== "ARCHIVED" && (
                          <button
                            type="button"
                            onClick={() => setArchiving(cs)}
                            aria-label="Archive"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-rose-400 transition hover:bg-rose-500/10"
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
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

      <ConfirmDialog
        open={!!archiving}
        onClose={() => setArchiving(null)}
        onConfirm={() => archiving && archiveMutation.mutate(archiving.slug)}
        title="Archive this case study?"
        message={`“${archiving?.title ?? ""}” will be hidden from the site. You can restore it by setting its status back to Draft or Published.`}
        confirmLabel="Archive"
        loading={archiveMutation.isPending}
      />
    </div>
  );
}
