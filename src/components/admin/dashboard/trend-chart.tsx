"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SeriesPoint } from "@/lib/admin/dashboard-client";

interface TrendChartProps {
  title: string;
  data: SeriesPoint[];
  /** Tailwind-ish hex colour for the line/area. */
  color?: string;
  /** Format a y value for the tooltip + axis (e.g. currency). */
  formatValue?: (value: number) => string;
}

/** Short axis label like "12 Jun". */
function formatDay(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/**
 * A 30-day area trend chart (Recharts). Self-sizing via ResponsiveContainer, so
 * the parent must provide a height.
 */
export function TrendChart({
  title,
  data,
  color = "#6366f1",
  formatValue = (v) => String(v),
}: TrendChartProps) {
  const gradientId = `grad-${title.replace(/\s+/g, "-").toLowerCase()}`;
  const total = data.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">
          {formatValue(total)} total
        </span>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 8, left: -12, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-border"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDay}
              tick={{ fontSize: 11 }}
              stroke="currentColor"
              className="text-muted-foreground"
              tickLine={false}
              axisLine={false}
              minTickGap={28}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              stroke="currentColor"
              className="text-muted-foreground"
              tickLine={false}
              axisLine={false}
              width={48}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--color-foreground)",
              }}
              labelFormatter={(label) => formatDay(String(label))}
              formatter={(value) => [formatValue(Number(value)), title]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
