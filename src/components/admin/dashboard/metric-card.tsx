"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
  /** Window the % change is measured against, e.g. "vs previous 30 days". */
  changeSuffix?: string;
}

/** A single headline metric with a period-over-period % change indicator. */
export function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  changeSuffix = "vs prev. period",
}: MetricCardProps) {
  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";
  const ChangeIcon =
    direction === "up"
      ? ArrowUpRight
      : direction === "down"
        ? ArrowDownRight
        : Minus;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 font-medium",
            direction === "up" && "text-emerald-400",
            direction === "down" && "text-rose-400",
            direction === "flat" && "text-muted-foreground",
          )}
        >
          <ChangeIcon className="h-3.5 w-3.5" />
          {Math.abs(change)}%
        </span>
        <span className="text-muted-foreground">{changeSuffix}</span>
      </div>
    </div>
  );
}
