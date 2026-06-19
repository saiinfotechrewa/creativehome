"use client";

import { useQuery } from "@tanstack/react-query";
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { formatINR, formatNumber } from "@/lib/admin/dashboard-client";
import { fetchRevenueAnalytics, orderKeys } from "@/lib/admin/orders-client";

interface Card {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  accent: string;
}

/** Sum the counts for a set of order statuses from the analytics breakdown. */
function countOf(
  byStatus: { key: string; count: number }[] | undefined,
  ...statuses: string[]
): number {
  if (!byStatus) return 0;
  return byStatus
    .filter((s) => statuses.includes(s.key))
    .reduce((sum, s) => sum + s.count, 0);
}

/** The four headline metric cards above the orders table. */
export function OrderMetricCards() {
  const { data, isPending } = useQuery({
    queryKey: orderKeys.revenue,
    queryFn: () => fetchRevenueAnalytics(30),
    staleTime: 60_000,
  });

  const cards: Card[] = [
    {
      label: "Revenue",
      value: data ? formatINR(data.totalRevenue) : "–",
      hint: "Paid, last 30 days",
      icon: IndianRupee,
      accent: "text-emerald-400",
    },
    {
      label: "Paid",
      value: data ? formatNumber(data.paidOrders) : "–",
      hint: "Successful orders",
      icon: CheckCircle2,
      accent: "text-blue-400",
    },
    {
      label: "Pending",
      value: data ? formatNumber(countOf(data.byStatus, "PENDING")) : "–",
      hint: "Awaiting payment",
      icon: Clock,
      accent: "text-amber-400",
    },
    {
      label: "Failed",
      value: data
        ? formatNumber(countOf(data.byStatus, "CANCELLED", "EXPIRED"))
        : "–",
      hint: "Cancelled or expired",
      icon: XCircle,
      accent: "text-rose-400",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {c.label}
              </span>
              <Icon className={cn("h-4 w-4", c.accent)} />
            </div>
            <p
              className={cn(
                "mt-2 text-2xl font-semibold text-foreground",
                isPending && "animate-pulse text-muted-foreground",
              )}
            >
              {c.value}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{c.hint}</p>
          </div>
        );
      })}
    </div>
  );
}
