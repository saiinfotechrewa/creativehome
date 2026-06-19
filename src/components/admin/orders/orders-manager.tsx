"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Loader2, ShoppingCart, Search, X, Eye } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/admin/dashboard-client";
import {
  fetchOrders,
  orderKeys,
  ORDER_STATUSES,
  type OrderFilters,
  type OrderListItem,
} from "@/lib/admin/orders-client";
import { OrderMetricCards } from "@/components/admin/orders/order-metric-cards";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/admin/orders/order-badges";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function customerName(o: OrderListItem): string {
  return o.customer?.name || o.customerInfo?.name || "Guest";
}

const selectClass =
  "h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const dateClass =
  "h-9 rounded-md border border-border bg-background px-2 text-sm text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function OrdersManager() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, dateFrom, dateTo]);

  const apiFilters = useMemo<OrderFilters>(
    () => ({
      search: debouncedSearch || undefined,
      status: (status || undefined) as OrderFilters["status"],
      dateFrom: dateFrom || undefined,
      dateTo: dateTo ? `${dateTo}T23:59:59` : undefined,
      page,
    }),
    [debouncedSearch, status, dateFrom, dateTo, page],
  );

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: orderKeys.list(apiFilters),
    queryFn: () => fetchOrders(apiFilters),
    placeholderData: keepPreviousData,
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;
  const hasFilters = search || status || dateFrom || dateTo;

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Every purchase and subscription made through the store.
        </p>
      </header>

      <OrderMetricCards />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[15rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer name or email…"
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <select
          className={selectClass}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <input
            type="date"
            aria-label="From date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={dateClass}
          />
          <span>–</span>
          <input
            type="date"
            aria-label="To date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={dateClass}
          />
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatus("");
              setDateFrom("");
              setDateTo("");
            }}
            className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-2.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      <div className="mb-3 text-sm text-muted-foreground">
        {meta ? `${meta.total} order${meta.total === 1 ? "" : "s"}` : " "}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[960px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5">Order #</th>
              <th className="px-4 py-2.5">Customer</th>
              <th className="px-4 py-2.5">Product</th>
              <th className="px-4 py-2.5">Tier</th>
              <th className="px-4 py-2.5 text-right">Amount</th>
              <th className="px-4 py-2.5">Payment</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5 text-right">Date</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody
            className={cn("divide-y divide-border", isFetching && "opacity-60")}
          >
            {isPending ? (
              <tr>
                <td colSpan={9}>
                  <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading orders…
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={9}>
                  <div className="py-16 text-center text-sm text-rose-400">
                    {(error as Error).message}
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="flex flex-col items-center gap-2 py-16 text-center text-sm text-muted-foreground">
                    <ShoppingCart className="h-6 w-6" />
                    No orders match these filters.
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => router.push(`/admin/orders/${o.id}`)}
                  className="cursor-pointer transition hover:bg-accent/50"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {o.orderNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-foreground">{customerName(o)}</div>
                    <div className="text-xs text-muted-foreground">
                      {o.customer?.email || o.customerInfo?.email || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {o.product?.name || (
                      <span className="text-muted-foreground/60">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {o.product?.plan || o.product?.tier || "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">
                    {o.pricing?.total != null
                      ? formatINR(o.pricing.total)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={o.payment?.status} />
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-xs text-primary">
                      <Eye className="h-3.5 w-3.5" /> View
                    </span>
                  </td>
                </tr>
              ))
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
