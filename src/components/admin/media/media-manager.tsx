"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Copy,
  ImageIcon,
  Loader2,
  Pencil,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Field, inputClass } from "@/components/admin/ui/form";
import { Modal, ConfirmDialog } from "@/components/admin/ui/modal";
import {
  type MediaFile,
  type MediaFilters,
  mediaKeys,
  fetchMedia,
  uploadMedia,
  updateMedia,
  deleteMedia,
  formatBytes,
} from "@/lib/admin/media-client";

export function MediaManager({ canManage }: { canManage: boolean }) {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<NonNullable<MediaFilters["sort"]>>("createdAt");
  const [page, setPage] = useState(1);
  const [dragOver, setDragOver] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  const [editTarget, setEditTarget] = useState<MediaFile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => setPage(1), [debouncedSearch, sort]);

  const filters = useMemo<MediaFilters>(
    () => ({ search: debouncedSearch || undefined, sort, page, pageSize: 24 }),
    [debouncedSearch, sort, page],
  );

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: mediaKeys.list(filters),
    queryFn: () => fetchMedia(filters),
    placeholderData: keepPreviousData,
  });

  const files = data?.data ?? [];
  const meta = data?.meta;

  const invalidate = () => qc.invalidateQueries({ queryKey: mediaKeys.all });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadMedia(file),
    onSuccess: () => {
      toast.success("Uploaded");
      setStorageError(null);
      invalidate();
    },
    onError: (e: Error) => {
      if (/cloudinary|storage/i.test(e.message)) setStorageError(e.message);
      toast.error(e.message);
    },
  });

  const editMutation = useMutation({
    mutationFn: (vars: { id: string; alt: string; folder: string }) =>
      updateMedia(vars.id, { alt: vars.alt, folder: vars.folder }),
    onSuccess: () => {
      toast.success("Saved");
      setEditTarget(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSuccess: () => {
      toast.success("Deleted");
      setDeleteTarget(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    Array.from(list).forEach((file) => uploadMutation.mutate(file));
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied");
    } catch {
      toast.error("Couldn't copy");
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Media Library</h1>
        <p className="text-sm text-muted-foreground">
          Images used across the site. Uploads are stored on Cloudinary.
        </p>
      </header>

      {storageError && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          {storageError}. Configure Cloudinary under{" "}
          <span className="font-medium">Integrations → Storage</span> to enable uploads.
        </div>
      )}

      {/* Upload zone */}
      {canManage && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "mb-5 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition",
            dragOver ? "border-primary bg-primary/5" : "border-border bg-card",
          )}
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-foreground">
            Drag &amp; drop images here, or{" "}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="font-medium text-primary hover:underline"
            >
              browse
            </button>
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG, WEBP, GIF, SVG, AVIF · up to 5 MB</p>
          {uploadMutation.isPending && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[14rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or alt text…"
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground outline-none focus:border-primary"
          value={sort}
          onChange={(e) => setSort(e.target.value as NonNullable<MediaFilters["sort"]>)}
        >
          <option value="createdAt">Newest</option>
          <option value="size">Largest</option>
          <option value="filename">Name</option>
        </select>
      </div>

      <div className="mb-3 text-sm text-muted-foreground">
        {meta ? `${meta.total} file${meta.total === 1 ? "" : "s"}` : " "}
      </div>

      {/* Grid */}
      {isPending ? (
        <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading media…
        </div>
      ) : isError ? (
        <div className="py-20 text-center text-sm text-rose-400">{(error as Error).message}</div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card py-20 text-center text-sm text-muted-foreground">
          <ImageIcon className="h-7 w-7" />
          No media yet.
        </div>
      ) : (
        <div
          className={cn(
            "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
            isFetching && "opacity-60",
          )}
        >
          {files.map((f) => (
            <div
              key={f.id}
              className="group overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative aspect-[4/3] bg-muted">
                {/* Cloudinary URLs are remote; use a plain img to avoid loader config. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.thumbnailUrl || f.url}
                  alt={f.alt || f.originalName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                  <IconBtn title="Copy URL" onClick={() => copyUrl(f.url)}>
                    <Copy className="h-3.5 w-3.5" />
                  </IconBtn>
                  {canManage && (
                    <>
                      <IconBtn title="Edit" onClick={() => setEditTarget(f)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </IconBtn>
                      <IconBtn title="Delete" tone="danger" onClick={() => setDeleteTarget(f)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </IconBtn>
                    </>
                  )}
                </div>
              </div>
              <div className="p-2.5">
                <div className="truncate text-xs font-medium text-foreground" title={f.originalName}>
                  {f.originalName}
                </div>
                <div className="mt-0.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{formatBytes(f.size)}</span>
                  {f.dimensions?.width ? (
                    <span>
                      {f.dimensions.width}×{f.dimensions.height}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

      {/* Edit modal */}
      {editTarget && (
        <EditModal
          file={editTarget}
          saving={editMutation.isPending}
          onClose={() => setEditTarget(null)}
          onSave={(alt, folder) =>
            editMutation.mutate({ id: editTarget.id, alt, folder })
          }
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
        title="Delete media file?"
        message={`"${deleteTarget?.originalName}" will be permanently removed from the library and storage. This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

function IconBtn({
  children,
  title,
  onClick,
  tone,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  tone?: "danger";
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-md bg-white/15 text-white backdrop-blur transition hover:bg-white/25",
        tone === "danger" && "hover:bg-rose-500/80",
      )}
    >
      {children}
    </button>
  );
}

function EditModal({
  file,
  saving,
  onClose,
  onSave,
}: {
  file: MediaFile;
  saving: boolean;
  onClose: () => void;
  onSave: (alt: string, folder: string) => void;
}) {
  const [alt, setAlt] = useState(file.alt ?? "");
  const [folder, setFolder] = useState(file.folder ?? "");

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit media"
      className="max-w-md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-9 rounded-md border border-border px-3 text-sm text-foreground transition hover:bg-accent disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(alt, folder)}
            disabled={saving}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
          </button>
        </>
      }
    >
      <div className="space-y-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={file.thumbnailUrl || file.url}
          alt={file.alt || file.originalName}
          className="max-h-40 w-full rounded-md border border-border object-contain"
        />
        <Field label="Alt text" hint="Describe the image for accessibility & SEO">
          <input className={inputClass} value={alt} onChange={(e) => setAlt(e.target.value)} />
        </Field>
        <Field label="Folder" hint="Letters, numbers, - _ /">
          <input className={inputClass} value={folder} onChange={(e) => setFolder(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}
