/**
 * Client-safe data layer for the catalog admin UIs (Products, Services,
 * Industries). All three share the generic catalog API
 * (`/api/admin/{resource}` + `/[slug]` + `/reorder`), so one set of fetchers
 * and one field-config map drives all three managers.
 *
 * No server-only imports — safe inside "use client" components.
 */

export type CatalogResource = "products" | "services" | "industries";

export type ContentStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export const CONTENT_STATUSES: { value: ContentStatus; label: string; badge: string }[] =
  [
    { value: "ACTIVE", label: "Active", badge: "bg-emerald-500/15 text-emerald-400" },
    { value: "DRAFT", label: "Draft", badge: "bg-amber-500/15 text-amber-400" },
    { value: "ARCHIVED", label: "Archived", badge: "bg-zinc-500/15 text-zinc-400" },
  ];

export function statusBadge(status: string): string {
  return (
    CONTENT_STATUSES.find((s) => s.value === status)?.badge ??
    "bg-zinc-500/15 text-zinc-400"
  );
}

/** A catalog row as returned by the list/detail endpoints (full record). */
export interface CatalogRow {
  id: string;
  slug: string;
  name: string;
  status: ContentStatus;
  order: number;
  icon?: string | null;
  color?: string | null;
  tagline?: string | null;
  description?: string | null;
  badge?: string | null;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface CatalogListMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface CatalogListResult {
  data: CatalogRow[];
  meta: CatalogListMeta;
}

export interface CatalogFilters {
  search?: string;
  status?: ContentStatus;
  includeArchived?: boolean;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export const catalogAdminKeys = {
  all: (resource: CatalogResource) => ["admin", "catalog", resource] as const,
  list: (resource: CatalogResource, filters: CatalogFilters) =>
    ["admin", "catalog", resource, "list", filters] as const,
  detail: (resource: CatalogResource, slug: string) =>
    ["admin", "catalog", resource, "detail", slug] as const,
};

async function unwrap<T>(res: Response, fallback: string): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const j = json as { error?: string; issues?: unknown };
    throw new Error(j.error ?? fallback);
  }
  return (json as { data: T }).data;
}

export async function fetchCatalogList(
  resource: CatalogResource,
  filters: CatalogFilters = {},
): Promise<CatalogListResult> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.includeArchived) params.set("includeArchived", "true");
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.order) params.set("order", filters.order);
  params.set("page", String(filters.page ?? 1));
  params.set("pageSize", String(filters.pageSize ?? 20));

  const res = await fetch(`/api/admin/${resource}?${params.toString()}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? `Failed to load ${resource}`);
  }
  return {
    data: (json as { data?: CatalogRow[] }).data ?? [],
    meta: (json as { meta?: CatalogListMeta }).meta ?? {
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 1,
    },
  };
}

export function fetchCatalogItem(
  resource: CatalogResource,
  slug: string,
): Promise<CatalogRow> {
  return fetch(`/api/admin/${resource}/${slug}`).then((res) =>
    unwrap<CatalogRow>(res, "Failed to load item"),
  );
}

export function createCatalogItem(
  resource: CatalogResource,
  payload: Record<string, unknown>,
): Promise<CatalogRow> {
  return fetch(`/api/admin/${resource}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => unwrap<CatalogRow>(res, "Failed to create item"));
}

export function updateCatalogItem(
  resource: CatalogResource,
  slug: string,
  payload: Record<string, unknown>,
): Promise<CatalogRow> {
  return fetch(`/api/admin/${resource}/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => unwrap<CatalogRow>(res, "Failed to save item"));
}

export function deleteCatalogItem(
  resource: CatalogResource,
  slug: string,
): Promise<{ id: string; slug: string; status: string }> {
  return fetch(`/api/admin/${resource}/${slug}`, { method: "DELETE" }).then((res) =>
    unwrap(res, "Failed to archive item"),
  );
}

export function reorderCatalog(
  resource: CatalogResource,
  order: string[],
): Promise<CatalogRow[]> {
  return fetch(`/api/admin/${resource}/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order }),
  }).then((res) => unwrap<CatalogRow[]>(res, "Failed to reorder"));
}

// ───────────────────────────── Field configuration ──────────────────────────

export type FieldType =
  | "text"
  | "textarea"
  | "icon"
  | "color"
  | "json-object"
  | "json-array"
  | "string-list";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  /** Advanced fields are tucked into a collapsible "Advanced content" panel. */
  advanced?: boolean;
}

export interface ResourceMeta {
  resource: CatalogResource;
  singular: string;
  plural: string;
  /** Simple (non-advanced) fields rendered up top, after the common fields. */
  simpleFields: FieldDef[];
  /** Advanced JSON / list fields. */
  advancedFields: FieldDef[];
}

const j = (key: string, label: string, type: FieldType): FieldDef => ({
  key,
  label,
  type,
  advanced: true,
});

export const RESOURCE_META: Record<CatalogResource, ResourceMeta> = {
  products: {
    resource: "products",
    singular: "Product",
    plural: "Products",
    simpleFields: [
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "badge", label: "Badge", type: "text", hint: "e.g. Popular, New" },
    ],
    advancedFields: [
      j("descriptions", "Descriptions", "json-object"),
      j("gradient", "Gradient", "json-object"),
      j("hero", "Hero", "json-object"),
      j("painPoints", "Pain points", "json-array"),
      j("features", "Features", "json-array"),
      j("modules", "Modules", "json-array"),
      j("screenshots", "Screenshots", "json-array"),
      j("benefits", "Benefits", "json-array"),
      j("pricing", "Pricing", "json-object"),
      j("faqs", "FAQs", "json-array"),
      j("integrations", "Integrations", "json-array"),
      j("relatedProducts", "Related products", "string-list"),
      j("seo", "SEO", "json-object"),
      j("urls", "URLs", "json-object"),
    ],
  },
  services: {
    resource: "services",
    singular: "Service",
    plural: "Services",
    simpleFields: [{ key: "description", label: "Description", type: "textarea" }],
    advancedFields: [
      j("hero", "Hero", "json-object"),
      j("deliverables", "Deliverables", "json-array"),
      j("process", "Process", "json-array"),
      j("technologies", "Technologies", "string-list"),
      j("pricingModel", "Pricing model", "json-object"),
      j("seo", "SEO", "json-object"),
    ],
  },
  industries: {
    resource: "industries",
    singular: "Industry",
    plural: "Industries",
    simpleFields: [{ key: "description", label: "Description", type: "textarea" }],
    advancedFields: [
      j("hero", "Hero", "json-object"),
      j("painPoints", "Pain points", "json-array"),
      j("solutions", "Solutions", "json-array"),
      j("workflow", "Workflow", "json-array"),
      j("results", "Results", "json-array"),
      j("testimonial", "Testimonial", "json-object"),
      j("seo", "SEO", "json-object"),
    ],
  },
};
