"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  CalendarRange,
  TrendingUp,
  Clock,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { fetchLeadAnalytics, leadKeys } from "@/lib/admin/leads-client";

interface Card {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  accent: string;
}

/** Format the average first-response time for display. */
function formatResponse(hours: number | null): string {
  if (hours == null) return "—";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 48) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

/** The four headline metric cards above the leads table. */
export function LeadMetricCards() {
  const { data, isPending } = useQuery({
    queryKey: leadKeys.analytics,
    queryFn: () => fetchLeadAnalytics(30),
    staleTime: 60_000,
  });

  const cards: Card[] = [
    {
      label: "New today",
      value: data ? String(data.newToday) : "–",
      hint: "Leads received today",
      icon: Sparkles,
      accent: "text-blue-400",
    },
    {
      label: "This month",
      value: data ? String(data.total) : "–",
      hint: "Last 30 days",
      icon: CalendarRange,
      accent: "text-violet-400",
    },
    {
      label: "Conversion rate",
      value: data ? `${data.conversionRate}%` : "–",
      hint: data ? `${data.converted} converted` : "Converted / total",
      icon: TrendingUp,
      accent: "text-emerald-400",
    },
    {
      label: "Avg response",
      value: data ? formatResponse(data.avgResponseHours) : "–",
      hint: "First reply time",
      icon: Clock,
      accent: "text-amber-400",
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
