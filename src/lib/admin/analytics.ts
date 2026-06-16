import type { Order } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requirePermission, withAuthHandler } from "@/lib/auth-helpers";
import { PERMISSIONS } from "@/lib/permissions";
import { ok, parseQuery } from "@/lib/api-response";
import { analyticsQuerySchema } from "@/lib/validators";

/**
 * Analytics endpoints powering the admin dashboard:
 *
 * - `dashboard`: headline metrics (leads / orders / revenue) each with a
 *   period-over-period % change, plus daily series for the charts.
 * - `leads`: pipeline + source/priority breakdowns and conversion rate.
 * - `revenue`: paid revenue, AOV, status split and top products.
 *
 * Revenue lives in `Order.pricing` (JSON), so paid orders are pulled into memory
 * and reduced in JS — fine at the scale of an admin window (≤ 1 year).
 */

const PAID_STATUSES = ["PAID", "ACTIVE"] as const;

interface Range {
  start: Date;
  end: Date;
  prevStart: Date;
  days: number;
}

/** Build the current window and the immediately-preceding one of equal length. */
function buildRange(days: number): Range {
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  const prevStart = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);
  return { start, end, prevStart, days };
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

/** Pre-seed a date→0 map across the window so the chart has no gaps. */
function emptySeries(range: Range): Map<string, number> {
  const series = new Map<string, number>();
  for (let i = 0; i < range.days; i += 1) {
    const d = new Date(range.start.getTime() + i * 24 * 60 * 60 * 1000);
    series.set(dayKey(d), 0);
  }
  series.set(dayKey(range.end), series.get(dayKey(range.end)) ?? 0);
  return series;
}

function seriesToArray(
  series: Map<string, number>,
): Array<{ date: string; value: number }> {
  return [...series.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));
}

function orderTotal(order: Order): number {
  const pricing = (order.pricing ?? {}) as Record<string, unknown>;
  return typeof pricing.total === "number" ? pricing.total : 0;
}

function isPaid(order: Order): boolean {
  return (PAID_STATUSES as readonly string[]).includes(order.status);
}

// ──────────────────────────────── Dashboard ──────────────────────────────────

const dashboard = withAuthHandler(async (req: Request) => {
  await requirePermission(PERMISSIONS.DASHBOARD_VIEW);
  const { days } = parseQuery(req, analyticsQuerySchema);
  const range = buildRange(days);

  const [
    leadsCurrent,
    leadsPrev,
    ordersCurrent,
    ordersPrev,
    paidCurrent,
    paidPrev,
  ] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: range.start } } }),
    prisma.lead.count({
      where: { createdAt: { gte: range.prevStart, lt: range.start } },
    }),
    prisma.order.count({ where: { createdAt: { gte: range.start } } }),
    prisma.order.count({
      where: { createdAt: { gte: range.prevStart, lt: range.start } },
    }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: range.start },
        status: { in: [...PAID_STATUSES] },
      },
      select: { createdAt: true, pricing: true, status: true } as never,
    }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: range.prevStart, lt: range.start },
        status: { in: [...PAID_STATUSES] },
      },
      select: { pricing: true } as never,
    }),
  ]);

  const revenueCurrent = (paidCurrent as Order[]).reduce(
    (sum, o) => sum + orderTotal(o),
    0,
  );
  const revenuePrev = (paidPrev as Order[]).reduce(
    (sum, o) => sum + orderTotal(o),
    0,
  );

  // Daily series for the charts.
  const leadsInWindow = await prisma.lead.findMany({
    where: { createdAt: { gte: range.start } },
    select: { createdAt: true },
  });
  const ordersInWindow = await prisma.order.findMany({
    where: { createdAt: { gte: range.start } },
    select: { createdAt: true },
  });

  const leadsSeries = emptySeries(range);
  for (const l of leadsInWindow) {
    const k = dayKey(l.createdAt);
    if (leadsSeries.has(k)) leadsSeries.set(k, (leadsSeries.get(k) ?? 0) + 1);
  }
  const ordersSeries = emptySeries(range);
  for (const o of ordersInWindow) {
    const k = dayKey(o.createdAt);
    if (ordersSeries.has(k)) ordersSeries.set(k, (ordersSeries.get(k) ?? 0) + 1);
  }
  const revenueSeries = emptySeries(range);
  for (const o of paidCurrent as Order[]) {
    const k = dayKey(o.createdAt);
    if (revenueSeries.has(k))
      revenueSeries.set(k, (revenueSeries.get(k) ?? 0) + orderTotal(o));
  }

  return ok({
    range: { days, start: range.start, end: range.end },
    metrics: {
      leads: {
        value: leadsCurrent,
        previous: leadsPrev,
        change: percentChange(leadsCurrent, leadsPrev),
      },
      orders: {
        value: ordersCurrent,
        previous: ordersPrev,
        change: percentChange(ordersCurrent, ordersPrev),
      },
      revenue: {
        value: Math.round(revenueCurrent * 100) / 100,
        previous: Math.round(revenuePrev * 100) / 100,
        change: percentChange(revenueCurrent, revenuePrev),
        currency: "INR",
      },
    },
    charts: {
      leads: seriesToArray(leadsSeries),
      orders: seriesToArray(ordersSeries),
      revenue: seriesToArray(revenueSeries),
    },
  });
});

// ───────────────────────────── Lead analytics ────────────────────────────────

const leads = withAuthHandler(async (req: Request) => {
  await requirePermission(PERMISSIONS.DASHBOARD_VIEW);
  const { days } = parseQuery(req, analyticsQuerySchema);
  const range = buildRange(days);
  const where = { createdAt: { gte: range.start } };

  const [byStatus, bySource, byPriority, total, converted, inWindow] =
    await Promise.all([
      prisma.lead.groupBy({ by: ["status"], _count: true, where }),
      prisma.lead.groupBy({ by: ["source"], _count: true, where }),
      prisma.lead.groupBy({ by: ["priority"], _count: true, where }),
      prisma.lead.count({ where }),
      prisma.lead.count({ where: { ...where, status: "CONVERTED" } }),
      prisma.lead.findMany({ where, select: { createdAt: true } }),
    ]);

  const series = emptySeries(range);
  for (const l of inWindow) {
    const k = dayKey(l.createdAt);
    if (series.has(k)) series.set(k, (series.get(k) ?? 0) + 1);
  }

  const tally = (
    rows: Array<{ _count: number } & Record<string, unknown>>,
    field: string,
  ) =>
    rows.map((r) => ({ key: String(r[field]), count: r._count }));

  return ok({
    range: { days, start: range.start, end: range.end },
    total,
    converted,
    conversionRate: total === 0 ? 0 : Math.round((converted / total) * 1000) / 10,
    byStatus: tally(byStatus, "status"),
    bySource: tally(bySource, "source"),
    byPriority: tally(byPriority, "priority"),
    daily: seriesToArray(series),
  });
});

// ──────────────────────────── Revenue analytics ──────────────────────────────

const revenue = withAuthHandler(async (req: Request) => {
  await requirePermission(PERMISSIONS.DASHBOARD_VIEW);
  const { days } = parseQuery(req, analyticsQuerySchema);
  const range = buildRange(days);

  const [byStatus, orders] = await Promise.all([
    prisma.order.groupBy({
      by: ["status"],
      _count: true,
      where: { createdAt: { gte: range.start } },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: range.start } },
      select: { createdAt: true, pricing: true, product: true, status: true } as never,
    }),
  ]);

  const typed = orders as Order[];
  const paid = typed.filter(isPaid);
  const totalRevenue = paid.reduce((sum, o) => sum + orderTotal(o), 0);
  const aov = paid.length === 0 ? 0 : totalRevenue / paid.length;

  // Top products by paid revenue.
  const productMap = new Map<string, { revenue: number; orders: number }>();
  for (const o of paid) {
    const product = (o.product ?? {}) as Record<string, unknown>;
    const name =
      (typeof product.name === "string" && product.name) ||
      (typeof product.slug === "string" && product.slug) ||
      "Unknown";
    const entry = productMap.get(name) ?? { revenue: 0, orders: 0 };
    entry.revenue += orderTotal(o);
    entry.orders += 1;
    productMap.set(name, entry);
  }
  const topProducts = [...productMap.entries()]
    .map(([name, v]) => ({
      name,
      revenue: Math.round(v.revenue * 100) / 100,
      orders: v.orders,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const series = emptySeries(range);
  for (const o of paid) {
    const k = dayKey(o.createdAt);
    if (series.has(k)) series.set(k, (series.get(k) ?? 0) + orderTotal(o));
  }

  return ok({
    range: { days, start: range.start, end: range.end },
    currency: "INR",
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    paidOrders: paid.length,
    averageOrderValue: Math.round(aov * 100) / 100,
    byStatus: byStatus.map((r) => ({ key: r.status, count: r._count })),
    topProducts,
    daily: seriesToArray(series),
  });
});

export const analyticsAdminApi = { dashboard, leads, revenue };
