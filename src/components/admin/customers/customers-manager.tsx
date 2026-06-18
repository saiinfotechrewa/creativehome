"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Loader2, Users, Search, X, Eye } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/admin/dashboard-client";
import {
  fetchCustomers,
  customerKeys,
  type CustomerFilters,
  type CustomerListItem,
} from "@/lib/admin/customers-client";

const SORTS: { value: CustomerFilters["sort"]; label: string }[] = [
  { value: "createdAt", label: "Newest" },
  { value: "totalSpent", label: "Top spenders" },
  { value: "ordersCount", label: "Most orders" },
  { value: "name", label: "Name (A–Z)" },
];

function activeProducts(c: CustomerListItem): string[] {
  return Array.isArray(c.activeProducts)
    ? c.activeProducts.map((p) => p.plan ? `${p.slug} · ${p.plan}` : p.slug)
    : [];
}

export function CustomersManager() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<CustomerFilters["sort"]>("createdAt");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort]);

  const apiFilters = useMemo<CustomerFilters>(
    () => ({
      search: debouncedSearch || undefined,
      sort,
      order: sort === "name" ? "asc" : "desc",
      page,
    }),
    [debouncedSearch, sort, page],
  );

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: customerKeys.list(apiFilters),
    queryFn: () => fetchCustomers(apiFilters),
    placeholderData: keepPreviousData,
  });

  const customers = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Customers</h1>
        <p className="text-sm text-muted-foreground">
          Everyone who has bought a product or converted from a lead.
        </p>
      </header>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[15rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone or business…"
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={sort}
          onChange={(e) => setSort(e.target.value as CustomerFilters["sort"])}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
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
        {meta ? `${meta.total} customer${meta.total === 1 ? "" : "s"}` : " "}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[880px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5">Name</th>
              <th className="px-4 py-2.5">Email</th>
              <th className="px-4 py-2.5">Business</th>
              <th className="px-4 py-2.5">Active products</th>
              <th className="px-4 py-2.5 text-right">Total spent</th>
              <th className="px-4 py-2.5 text-right">Orders</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody
            className={cn("divide-y divide-border", isFetching && "opacity-60")}
          >
            {isPending ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading
                    customers…
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7}>
                  <div className="py-16 text-center text-sm text-rose-400">
                    {(error as Error).message}
                  </div>
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex flex-col items-center gap-2 py-16 text-center text-sm text-muted-foreground">
                    <Users className="h-6 w-6" />
                    No customers found.
                  </div>
                </td>
              </tr>
            ) : (
              customers.map((c) => {
                const products = activeProducts(c);
                return (
                  <tr
                    key={c.id}
                    onClick={() => router.push(`/admin/customers/${c.id}`)}
                    className="cursor-pointer transition hover:bg-accent/50"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.email}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {c.businessName || (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {products.length === 0 ? (
                        <span className="text-muted-foreground/60">—</span>
                      ) : (
                        <div className="flex max-w-[14rem] flex-wrap gap-1">
                          {products.slice(0, 2).map((p) => (
                            <span
                              key={p}
                              className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-xs font-medium text-emerald-400"
                            >
                              {p}
                            </span>
                          ))}
                          {products.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{products.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      {formatINR(c.totalSpent)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {c._count?.orders ?? c.ordersCount}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-xs text-primary">
                        <Eye className="h-3.5 w-3.5" /> View
                      </span>
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
    </div>
  );
}
