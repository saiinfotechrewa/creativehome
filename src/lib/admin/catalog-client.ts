/**
 * Client-safe helpers for fetching lightweight catalog option lists (products,
 * industries) used to populate dropdowns and multi-selects in the CMS forms.
 * No server-only imports, so this is safe inside "use client" components.
 */

export interface CatalogOption {
  id: string;
  slug: string;
  name: string;
}

export const catalogKeys = {
  products: ["admin", "catalog", "products"] as const,
  industries: ["admin", "catalog", "industries"] as const,
};

async function fetchOptions(resource: string): Promise<CatalogOption[]> {
  const res = await fetch(`/api/admin/${resource}?pageSize=100`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (json as { error?: string }).error ?? `Failed to load ${resource}`,
    );
  }
  const rows = (json as { data?: Array<Record<string, unknown>> }).data ?? [];
  return rows.map((r) => ({
    id: String(r.id),
    slug: String(r.slug),
    name: String(r.name),
  }));
}

export const fetchProductOptions = () => fetchOptions("products");
export const fetchIndustryOptions = () => fetchOptions("industries");
