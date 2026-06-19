"use client";

import { useEffect, useMemo, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ArrowUpDown,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import { Modal, ConfirmDialog } from "@/components/admin/ui/modal";
import { DraggableList } from "@/components/admin/ui/draggable-list";
import { CatalogForm } from "@/components/admin/catalog/catalog-form";
import {
  type CatalogResource,
  type CatalogRow,
  type CatalogFilters,
  type ContentStatus,
  RESOURCE_META,
  CONTENT_STATUSES,
  catalogAdminKeys,
  fetchCatalogList,
  fetchCatalogItem,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
  reorderCatalog,
  statusBadge,
} from "@/lib/admin/catalog-admin-client";

export function CatalogManager({
  resource,
  canManage,
}: {
  resource: CatalogResource;
  canManage: boolean;
}) {
  const meta = RESOURCE_META[resource];
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "">("");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [page, setPage] = useState(1);
  const [reordering, setReordering] = useState(false);

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<CatalogRow | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CatalogRow | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, includeArchived]);

  const filters = useMemo<CatalogFilters>(
    () => ({
      search: debouncedSearch || undefined,
      status: statusFilter || undefined,
      includeArchived,
      sort: "order",
      order: "asc",
      page,
      pageSize: 50,
    }),
    [debouncedSearch, statusFilter, includeArchived, page],
  );

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: catalogAdminKeys.list(resource, filters),
    queryFn: () => fetchCatalogList(resource, filters),
    placeholderData: keepPreviousData,
  });

  const rows = data?.data ?? [];
  const listMeta = data?.meta;

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: catalogAdminKeys.all(resource) });

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      editItem
        ? updateCatalogItem(resource, editItem.slug, payload)
        : createCatalogItem(resource, payload),
    onSuccess: () => {
      toast.success(editItem ? `${meta.singular} updated` : `${meta.singular} created`);
      setFormOpen(false);
      setEditItem(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => deleteCatalogItem(resource, slug),
    onSuccess: () => {
      toast.success(`${meta.singular} archived`);
      setDeleteTarget(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reorderMutation = useMutation({
    mutationFn: (order: string[]) => reorderCatalog(resource, order),
    onSuccess: () => {
      toast.success("Order saved");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function openEdit(row: CatalogRow) {
    setLoadingEdit(true);
    setEditItem(row); // optimistic so the modal opens with what we have
    setFormOpen(true);
    try {
      const full = await fetchCatalogItem(resource, row.slug);
      setEditItem(full);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoadingEdit(false);
    }
  }

  function openCreate() {
    setEditItem(null);
    setFormOpen(true);
  }

  const canReorder = canManage && !debouncedSearch && !statusFilter;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{meta.plural}</h1>
          <p className="text-sm text-muted-foreground">
            Manage your {meta.plural.toLowerCase()} catalog — published items appear on the public site.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> New {meta.singular.toLowerCase()}
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
            placeholder={`Search ${meta.plural.toLowerCase()}…`}
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground outline-none focus:border-primary"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ContentStatus | "")}
        >
          <option value="">All statuses</option>
          {CONTENT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <label className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={includeArchived}
            onChange={(e) => setIncludeArchived(e.target.checked)}
          />
          Show archived
        </label>
        {canReorder && (
          <button
            type="button"
            onClick={() => setReordering((r) => !r)}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-md border px-2.5 text-sm transition",
              reordering
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <ArrowUpDown className="h-3.5 w-3.5" /> {reordering ? "Done" : "Reorder"}
          </button>
        )}
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-2.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      <div className="mb-3 text-sm text-muted-foreground">
        {listMeta ? `${listMeta.total} ${meta.plural.toLowerCase()}` : " "}
      </div>

      {/* Reorder mode */}
      {reordering ? (
        <div className="rounded-xl border border-border bg-card p-4">
          {rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Nothing to reorder.</p>
          ) : (
            <DraggableList
              items={rows}
              getId={(r) => r.slug}
              onReorder={(orderedIds) => reorderMutation.mutate(orderedIds)}
              renderItem={(r) => (
                <div className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5">
                  <RowIcon icon={r.icon} color={r.color} />
                  <span className="text-sm font-medium text-foreground">{r.name}</span>
                  <span
                    className={cn(
                      "ml-auto rounded px-1.5 py-0.5 text-xs font-medium",
                      statusBadge(r.status),
                    )}
                  >
                    {r.status}
                  </span>
                </div>
              )}
            />
          )}
          {reorderMutation.isPending && (
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving order…
            </p>
          )}
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2.5 w-12">#</th>
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Slug</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y divide-border", isFetching && "opacity-60")}>
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
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center gap-2 py-16 text-center text-sm text-muted-foreground">
                      <Package className="h-6 w-6" />
                      No {meta.plural.toLowerCase()} yet.
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="transition hover:bg-accent/40">
                    <td className="px-4 py-3 text-muted-foreground">{r.order}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <RowIcon icon={r.icon} color={r.color} />
                        <div>
                          <div className="font-medium text-foreground">{r.name}</div>
                          {r.tagline || r.description ? (
                            <div className="max-w-[22rem] truncate text-xs text-muted-foreground">
                              {String(r.tagline ?? r.description ?? "")}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.slug}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-xs font-medium",
                          statusBadge(r.status),
                        )}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {canManage ? (
                          <>
                            <button
                              type="button"
                              onClick={() => openEdit(r)}
                              className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2 text-xs text-foreground transition hover:bg-accent"
                            >
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </button>
                            {r.status !== "ARCHIVED" && (
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(r)}
                                className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2 text-xs text-rose-400 transition hover:bg-rose-500/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Archive
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">View only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!reordering && listMeta && listMeta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {listMeta.page} of {listMeta.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={listMeta.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-9 rounded-md border border-border px-3 text-foreground transition hover:bg-accent disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={listMeta.page >= listMeta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-9 rounded-md border border-border px-3 text-foreground transition hover:bg-accent disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create / edit modal */}
      <Modal
        open={formOpen}
        onClose={() => {
          if (!saveMutation.isPending) {
            setFormOpen(false);
            setEditItem(null);
          }
        }}
        title={editItem ? `Edit ${meta.singular.toLowerCase()}` : `New ${meta.singular.toLowerCase()}`}
        className="max-w-2xl"
      >
        {loadingEdit && editItem ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : (
          <CatalogForm
            key={editItem?.id ?? "new"}
            meta={meta}
            item={editItem}
            saving={saveMutation.isPending}
            onSubmit={(payload) => saveMutation.mutate(payload)}
            onCancel={() => {
              setFormOpen(false);
              setEditItem(null);
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.slug)}
        loading={deleteMutation.isPending}
        title={`Archive ${meta.singular.toLowerCase()}?`}
        message={`"${deleteTarget?.name}" will be archived and removed from the public site. You can restore it later by editing its status.`}
        confirmLabel="Archive"
      />
    </div>
  );
}

function RowIcon({ icon, color }: { icon?: string | null; color?: string | null }) {
  if (!icon) {
    return <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">–</span>;
  }
  const Icon = getIcon(icon);
  return (
    <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-md bg-muted", color)}>
      <Icon className="h-4 w-4" />
    </span>
  );
}
