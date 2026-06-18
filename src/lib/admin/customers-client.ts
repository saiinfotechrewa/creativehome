import type { OrderStatus } from "@prisma/client";

import type { Paginated } from "@/lib/admin/leads-client";
import type { OrderListItem } from "@/lib/admin/orders-client";

/**
 * Client-safe types, query keys and fetchers for the admin Customers module.
 * No server-only imports, so this is safe inside "use client" components.
 */

// ───────────────────────────── Types ────────────────────────────────────────

export interface ActiveProduct {
  slug: string;
  plan?: string;
  since?: string;
  renewsOn?: string;
}

export interface CustomerListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  businessName: string | null;
  businessType: string | null;
  gstNumber: string | null;
  address: Record<string, unknown>;
  activeProducts: ActiveProduct[];
  totalSpent: number;
  ordersCount: number;
  leadId: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { orders: number };
}

export interface CustomerNote {
  id: string;
  by: string | null;
  byName: string | null;
  at: string;
  text: string;
}

export interface CustomerCommunication {
  id: string;
  channel: string;
  subject: string | null;
  summary: string;
  byName: string | null;
  at: string;
  status: string;
}

export interface CustomerDetail extends CustomerListItem {
  orders: Array<
    Omit<OrderListItem, "customer"> & { status: OrderStatus }
  >;
  communications: CustomerCommunication[];
  lead: { id: string; notes: CustomerNote[] } | null;
}

export interface CustomerUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
}

export interface CustomerFilters {
  search?: string;
  sort?: "createdAt" | "totalSpent" | "ordersCount" | "name";
  order?: "asc" | "desc";
  page?: number;
}

// ─────────────────────────── Query keys ─────────────────────────────────────

export const customerKeys = {
  all: ["admin", "customers"] as const,
  list: (filters: CustomerFilters) =>
    ["admin", "customers", "list", filters] as const,
  detail: (id: string) => ["admin", "customers", "detail", id] as const,
};

// ─────────────────────────── Fetchers ───────────────────────────────────────

async function unwrap<T>(res: Response, fallback: string): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? fallback);
  }
  return (json as { data: T }).data;
}

export async function fetchCustomers(
  filters: CustomerFilters,
): Promise<Paginated<CustomerListItem>> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.order) params.set("order", filters.order);
  params.set("page", String(filters.page ?? 1));

  const res = await fetch(`/api/admin/customers?${params.toString()}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (json as { error?: string }).error ?? "Failed to load customers",
    );
  }
  return json as Paginated<CustomerListItem>;
}

export async function fetchCustomer(id: string): Promise<CustomerDetail> {
  const res = await fetch(`/api/admin/customers/${id}`);
  return unwrap<CustomerDetail>(res, "Failed to load customer");
}

export async function updateCustomer(
  id: string,
  input: CustomerUpdateInput,
): Promise<CustomerListItem> {
  const res = await fetch(`/api/admin/customers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return unwrap<CustomerListItem>(res, "Failed to update customer");
}
