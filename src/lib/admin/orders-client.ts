import type { OrderStatus } from "@prisma/client";

import type { Paginated } from "@/lib/admin/leads-client";

/**
 * Client-safe types, display config, query keys and fetchers for the admin
 * Orders module. No server-only imports, so this is safe in "use client"
 * components.
 */

// ───────────────────────────── JSON shapes ──────────────────────────────────

export interface OrderProduct {
  slug?: string;
  name?: string;
  plan?: string;
  tier?: string;
  qty?: number;
}

export interface OrderPricing {
  subtotal?: number;
  tax?: number;
  discount?: number;
  total?: number;
  currency?: string;
}

export interface OrderPayment {
  razorpayOrderId?: string;
  paymentId?: string;
  signature?: string;
  /** Razorpay payment state: created | captured | failed | refunded. */
  status?: string;
  method?: string;
  refundId?: string;
  refundedAmount?: number;
}

export interface OrderSubscription {
  interval?: string;
  startDate?: string;
  endDate?: string;
  autoRenew?: boolean;
}

export interface OrderInvoice {
  number?: string;
  url?: string;
  issuedAt?: string;
}

export interface OrderCustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
  gst?: string;
  gstNumber?: string;
  address?: Record<string, unknown>;
}

export interface OrderCustomerRef {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  businessName?: string | null;
}

export interface OrderListItem {
  id: string;
  orderNumber: string;
  customerId: string | null;
  status: OrderStatus;
  product: OrderProduct;
  pricing: OrderPricing;
  payment: OrderPayment;
  subscription: OrderSubscription;
  invoice: OrderInvoice;
  customerInfo: OrderCustomerInfo;
  customer: OrderCustomerRef | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderActivity {
  id: string;
  userName: string | null;
  action: string;
  details: Record<string, unknown> | null;
  createdAt: string;
}

export interface OrderDetail extends OrderListItem {
  activities: OrderActivity[];
}

/** Headline metrics for the Orders cards (sourced from /analytics/revenue). */
export interface RevenueAnalytics {
  range: { days: number; start: string; end: string };
  currency: string;
  totalRevenue: number;
  paidOrders: number;
  averageOrderValue: number;
  byStatus: { key: string; count: number }[];
  topProducts: { name: string; revenue: number; orders: number }[];
  daily: { date: string; value: number }[];
}

// ─────────────────────────── Display config ─────────────────────────────────

export const ORDER_STATUSES: {
  value: OrderStatus;
  label: string;
  badge: string;
}[] = [
  { value: "PENDING", label: "Pending", badge: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  { value: "PAID", label: "Paid", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  { value: "ACTIVE", label: "Active", badge: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  { value: "CANCELLED", label: "Cancelled", badge: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
  { value: "REFUNDED", label: "Refunded", badge: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
  { value: "EXPIRED", label: "Expired", badge: "bg-muted text-muted-foreground border-border" },
];

export function orderStatusMeta(status: OrderStatus) {
  return ORDER_STATUSES.find((s) => s.value === status) ?? ORDER_STATUSES[0]!;
}

/** Payment-gateway state → label + badge. */
export function paymentStatusMeta(status: string | undefined): {
  label: string;
  badge: string;
} {
  switch ((status ?? "").toLowerCase()) {
    case "captured":
    case "paid":
      return { label: "Captured", badge: "bg-emerald-500/15 text-emerald-400" };
    case "authorized":
      return { label: "Authorized", badge: "bg-blue-500/15 text-blue-400" };
    case "refunded":
      return { label: "Refunded", badge: "bg-violet-500/15 text-violet-400" };
    case "failed":
      return { label: "Failed", badge: "bg-rose-500/15 text-rose-400" };
    case "created":
    case "pending":
      return { label: "Awaiting", badge: "bg-amber-500/15 text-amber-400" };
    default:
      return { label: status || "—", badge: "bg-muted text-muted-foreground" };
  }
}

export interface OrderFilters {
  search?: string;
  status?: OrderStatus | "";
  dateFrom?: string;
  dateTo?: string;
  page?: number;
}

function filtersToParams(filters: OrderFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  return params;
}

// ─────────────────────────── Query keys ─────────────────────────────────────

export const orderKeys = {
  all: ["admin", "orders"] as const,
  list: (filters: OrderFilters) => ["admin", "orders", "list", filters] as const,
  detail: (id: string) => ["admin", "orders", "detail", id] as const,
  revenue: ["admin", "orders", "revenue"] as const,
};

// ─────────────────────────── Fetchers ───────────────────────────────────────

async function unwrap<T>(res: Response, fallback: string): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? fallback);
  }
  return (json as { data: T }).data;
}

export async function fetchOrders(
  filters: OrderFilters,
): Promise<Paginated<OrderListItem>> {
  const params = filtersToParams(filters);
  params.set("page", String(filters.page ?? 1));

  const res = await fetch(`/api/admin/orders?${params.toString()}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (json as { error?: string }).error ?? "Failed to load orders",
    );
  }
  return json as Paginated<OrderListItem>;
}

export async function fetchOrder(id: string): Promise<OrderDetail> {
  const res = await fetch(`/api/admin/orders/${id}`);
  return unwrap<OrderDetail>(res, "Failed to load order");
}

export async function fetchRevenueAnalytics(days = 30): Promise<RevenueAnalytics> {
  const res = await fetch(`/api/admin/analytics/revenue?days=${days}`);
  return unwrap<RevenueAnalytics>(res, "Failed to load revenue");
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string,
): Promise<OrderListItem> {
  const res = await fetch(`/api/admin/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, note }),
  });
  return unwrap<OrderListItem>(res, "Failed to update status");
}

export interface RefundInput {
  amount?: number;
  reason?: string;
  speed?: "normal" | "optimum";
}

export async function refundOrder(
  id: string,
  input: RefundInput,
): Promise<{ order: OrderListItem; refund: { id: string; amount: number } }> {
  const res = await fetch(`/api/admin/orders/${id}/refund`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return unwrap<{ order: OrderListItem; refund: { id: string; amount: number } }>(
    res,
    "Refund failed",
  );
}

/** Absolute URL to download (or open) the generated invoice PDF. */
export function invoiceUrl(id: string): string {
  return `/api/admin/orders/${id}/invoice`;
}

/** Razorpay dashboard deep-links for a payment / order. */
export function razorpayUrl(payment: OrderPayment): string | null {
  if (payment.paymentId) {
    return `https://dashboard.razorpay.com/app/payments/${payment.paymentId}`;
  }
  if (payment.razorpayOrderId) {
    return `https://dashboard.razorpay.com/app/orders/${payment.razorpayOrderId}`;
  }
  return null;
}
