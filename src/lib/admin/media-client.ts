/**
 * Client-safe data layer for the admin Media Library, over `/api/admin/media`.
 * No server-only imports — safe inside "use client" components.
 */

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl: string | null;
  mimeType: string;
  size: number;
  dimensions: { width?: number; height?: number } | null;
  folder: string;
  alt: string | null;
  uploadedBy: string | null;
  uploader?: { id: string; name: string } | null;
  createdAt: string;
}

export interface MediaListMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface MediaFilters {
  search?: string;
  folder?: string;
  mimeType?: string;
  sort?: "createdAt" | "size" | "filename";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export const mediaKeys = {
  all: ["admin", "media"] as const,
  list: (filters: MediaFilters) => ["admin", "media", "list", filters] as const,
};

async function unwrap<T>(res: Response, fallback: string): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? fallback);
  }
  return (json as { data: T }).data;
}

export async function fetchMedia(
  filters: MediaFilters = {},
): Promise<{ data: MediaFile[]; meta: MediaListMeta }> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.folder) params.set("folder", filters.folder);
  if (filters.mimeType) params.set("mimeType", filters.mimeType);
  params.set("sort", filters.sort ?? "createdAt");
  params.set("order", filters.order ?? "desc");
  params.set("page", String(filters.page ?? 1));
  params.set("pageSize", String(filters.pageSize ?? 24));

  const res = await fetch(`/api/admin/media?${params.toString()}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? "Failed to load media");
  }
  return {
    data: (json as { data?: MediaFile[] }).data ?? [],
    meta: (json as { meta?: MediaListMeta }).meta ?? {
      page: 1,
      pageSize: 24,
      total: 0,
      totalPages: 1,
    },
  };
}

export async function uploadMedia(
  file: File,
  opts: { folder?: string; alt?: string } = {},
): Promise<MediaFile> {
  const form = new FormData();
  form.append("file", file);
  if (opts.folder) form.append("folder", opts.folder);
  if (opts.alt) form.append("alt", opts.alt);

  const res = await fetch("/api/admin/media", { method: "POST", body: form });
  return unwrap<MediaFile>(res, "Upload failed");
}

export async function updateMedia(
  id: string,
  patch: { alt?: string; folder?: string },
): Promise<MediaFile> {
  const res = await fetch(`/api/admin/media/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return unwrap<MediaFile>(res, "Failed to update media");
}

export async function deleteMedia(id: string): Promise<void> {
  const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
  await unwrap(res, "Failed to delete media");
}

/** Human-readable byte size. */
export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
