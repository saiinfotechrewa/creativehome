"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2,
  MessageSquareQuote,
  Plus,
  Search,
  Star,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { DraggableList } from "@/components/admin/ui/draggable-list";
import { ConfirmDialog } from "@/components/admin/ui/modal";
import { TestimonialFormModal } from "@/components/admin/testimonials/testimonial-form";
import {
  fetchTestimonials,
  setTestimonialStatus,
  setTestimonialDisplay,
  reorderTestimonials,
  deleteTestimonial,
  testimonialKeys,
  testimonialStatusMeta,
  TESTIMONIAL_STATUSES,
  type Testimonial,
  type TestimonialFilters,
} from "@/lib/admin/testimonials-client";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            "h-3.5 w-3.5",
            n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30",
          )}
        />
      ))}
    </span>
  );
}

export function TestimonialsManager({ canManage }: { canManage: boolean }) {
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState<Testimonial | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filters = useMemo<TestimonialFilters>(
    () => ({
      search: debouncedSearch || undefined,
      status: (status || undefined) as TestimonialFilters["status"],
    }),
    [debouncedSearch, status],
  );

  const { data, isPending, isError, error } = useQuery({
    queryKey: testimonialKeys.list(filters),
    queryFn: () => fetchTestimonials(filters),
  });

  // Local copy so drag reorder feels instant before the server confirms.
  const [items, setItems] = useState<Testimonial[]>([]);
  useEffect(() => {
    if (data?.data) setItems(data.data);
  }, [data?.data]);

  function invalidate() {
    qc.invalidateQueries({ queryKey: testimonialKeys.all });
    qc.invalidateQueries({ queryKey: ["admin", "nav-counts"] });
  }

  const reorderMutation = useMutation({
    mutationFn: (order: string[]) => reorderTestimonials(order),
    onSuccess: () => invalidate(),
    onError: (e: Error) => {
      toast.error(e.message);
      if (data?.data) setItems(data.data); // revert
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: Testimonial["status"] }) =>
      setTestimonialStatus(id, value),
    onSuccess: () => {
      toast.success("Status updated");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const displayMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: boolean }) =>
      setTestimonialDisplay(id, value),
    onSuccess: () => invalidate(),
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTestimonial(id),
    onSuccess: () => {
      toast.success("Testimonial deleted");
      setDeleting(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Reorder is only coherent when the list isn't filtered.
  const canReorder = canManage && !debouncedSearch && !status;

  function handleReorder(orderedIds: string[]) {
    setItems((prev) => {
      const map = new Map(prev.map((t) => [t.id, t]));
      return orderedIds.map((id) => map.get(id)!).filter(Boolean);
    });
    reorderMutation.mutate(orderedIds);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Testimonials</h1>
          <p className="text-sm text-muted-foreground">
            Moderate submissions and curate what appears on the site.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add testimonial
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
            placeholder="Search quote, name or company…"
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <FilterPill active={status === ""} onClick={() => setStatus("")}>
            All
          </FilterPill>
          {TESTIMONIAL_STATUSES.map((s) => (
            <FilterPill
              key={s.value}
              active={status === s.value}
              badge={status === s.value ? s.badge : undefined}
              onClick={() => setStatus(s.value)}
            >
              {s.label}
            </FilterPill>
          ))}
        </div>
      </div>

      {canReorder && items.length > 1 && (
        <p className="mb-3 text-xs text-muted-foreground">
          Drag the handle to reorder how approved testimonials appear on the
          site.
        </p>
      )}

      {/* List */}
      {isPending ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading testimonials…
        </div>
      ) : isError ? (
        <div className="py-16 text-center text-sm text-rose-400">
          {(error as Error).message}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card py-16 text-center text-sm text-muted-foreground">
          <MessageSquareQuote className="h-6 w-6" />
          No testimonials match these filters.
        </div>
      ) : (
        <DraggableList
          items={items}
          getId={(t) => t.id}
          onReorder={handleReorder}
          disabled={!canReorder}
          renderItem={(t) => (
            <Row
              t={t}
              canManage={canManage}
              onEdit={() => {
                setEditing(t);
                setFormOpen(true);
              }}
              onDelete={() => setDeleting(t)}
              onApprove={() =>
                statusMutation.mutate({ id: t.id, value: "APPROVED" })
              }
              onReject={() =>
                statusMutation.mutate({ id: t.id, value: "REJECTED" })
              }
              onToggleDisplay={() =>
                displayMutation.mutate({ id: t.id, value: !t.isDisplayed })
              }
            />
          )}
        />
      )}

      <TestimonialFormModal
        open={formOpen}
        editing={editing}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false);
          invalidate();
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        title="Delete this testimonial?"
        message={`This permanently removes ${deleting?.name ?? "the"}'s testimonial. This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

// ─────────────────────────── Sub-components ──────────────────────────────────

function FilterPill({
  active,
  badge,
  onClick,
  children,
}: {
  active: boolean;
  badge?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs font-medium transition",
        active
          ? (badge ?? "border-primary bg-primary/10 text-primary")
          : "border-border text-muted-foreground hover:bg-accent",
      )}
    >
      {children}
    </button>
  );
}

function Row({
  t,
  canManage,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onToggleDisplay,
}: {
  t: Testimonial;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onApprove: () => void;
  onReject: () => void;
  onToggleDisplay: () => void;
}) {
  const meta = testimonialStatusMeta(t.status);
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start gap-4">
        {/* Avatar */}
        {t.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.avatar}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm text-muted-foreground">
            {t.name.charAt(0).toUpperCase()}
          </span>
        )}

        {/* Quote + meta */}
        <div className="min-w-[12rem] flex-1">
          <p className="line-clamp-2 text-sm text-foreground">“{t.quote}”</p>
          <p className="mt-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{t.name}</span>
            {t.role ? `, ${t.role}` : ""}
            {t.company ? ` · ${t.company}` : ""}
            {t.industry ? ` · ${t.industry}` : ""}
          </p>
          <div className="mt-1.5">
            <Stars rating={t.rating} />
          </div>
        </div>

        {/* Status + controls */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
              meta.badge,
            )}
          >
            {meta.label}
          </span>

          {canManage && (
            <div className="flex items-center gap-1.5">
              {/* Display toggle */}
              <button
                type="button"
                onClick={onToggleDisplay}
                disabled={t.status !== "APPROVED"}
                title={
                  t.status !== "APPROVED"
                    ? "Approve before displaying"
                    : t.isDisplayed
                      ? "Hide from site"
                      : "Show on site"
                }
                className={cn(
                  "inline-flex h-8 items-center gap-1 rounded-md border px-2 text-xs font-medium transition disabled:opacity-40",
                  t.isDisplayed
                    ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                    : "border-border text-muted-foreground hover:bg-accent",
                )}
              >
                {t.isDisplayed ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
                {t.isDisplayed ? "Live" : "Hidden"}
              </button>

              {/* Quick moderation */}
              {t.status !== "APPROVED" && (
                <button
                  type="button"
                  onClick={onApprove}
                  className="inline-flex h-8 items-center rounded-md border border-border px-2 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/10"
                >
                  Approve
                </button>
              )}
              {t.status !== "REJECTED" && (
                <button
                  type="button"
                  onClick={onReject}
                  className="inline-flex h-8 items-center rounded-md border border-border px-2 text-xs font-medium text-rose-400 transition hover:bg-rose-500/10"
                >
                  Reject
                </button>
              )}

              <button
                type="button"
                onClick={onEdit}
                aria-label="Edit"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground transition hover:bg-accent"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onDelete}
                aria-label="Delete"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-rose-400 transition hover:bg-rose-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
