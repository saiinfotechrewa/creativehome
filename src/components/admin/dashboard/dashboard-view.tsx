"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  BarChart3,
  FilePlus2,
  Home,
  Inbox,
  Loader2,
  PackagePlus,
  Plug,
  ShoppingCart,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  dashboardKeys,
  fetchDashboard,
  fetchRecentActivity,
  fetchRecentLeads,
  formatINR,
  formatNumber,
} from "@/lib/admin/dashboard-client";
import { sourceLabel } from "@/lib/admin/leads-client";
import { LeadStatusBadge } from "@/components/admin/leads/lead-status-badge";
import { MetricCard } from "@/components/admin/dashboard/metric-card";
import { TrendChart } from "@/components/admin/dashboard/trend-chart";

interface DashboardViewProps {
  userName: string;
  canViewLeads: boolean;
  canViewActivity: boolean;
}

/** Compact relative time, e.g. "3h ago". */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

const QUICK_ACTIONS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Add Product", href: "/admin/products", icon: PackagePlus },
  { label: "New Blog Post", href: "/admin/blog", icon: FilePlus2 },
  { label: "View Leads", href: "/admin/leads", icon: Target },
  { label: "Edit Homepage", href: "/admin/homepage", icon: Home },
  { label: "Integrations", href: "/admin/integrations", icon: Plug },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

/** Humanise an activity action token, e.g. "status_change" → "changed status". */
function actionLabel(action: string): string {
  const map: Record<string, string> = {
    create: "created",
    update: "updated",
    delete: "deleted",
    status_change: "changed status of",
    assign: "assigned",
  };
  return map[action] ?? action.replace(/_/g, " ");
}

export function DashboardView({
  userName,
  canViewLeads,
  canViewActivity,
}: DashboardViewProps) {
  const router = useRouter();

  const metricsQuery = useQuery({
    queryKey: dashboardKeys.metrics(30),
    queryFn: () => fetchDashboard(30),
    staleTime: 60_000,
  });

  const leadsQuery = useQuery({
    queryKey: dashboardKeys.recentLeads,
    queryFn: () => fetchRecentLeads(10),
    enabled: canViewLeads,
    staleTime: 30_000,
  });

  const activityQuery = useQuery({
    queryKey: dashboardKeys.recentActivity,
    queryFn: () => fetchRecentActivity(8),
    enabled: canViewActivity,
    staleTime: 30_000,
  });

  const m = metricsQuery.data?.metrics;
  const charts = metricsQuery.data?.charts;
  const recentLeads = leadsQuery.data?.data ?? [];
  const activity = activityQuery.data?.data ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {userName} · last 30 days
        </p>
      </header>

      {/* ── Metric cards ─────────────────────────────────────────────── */}
      <section>
        {metricsQuery.isPending ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[116px] animate-pulse rounded-xl border border-border bg-card"
              />
            ))}
          </div>
        ) : metricsQuery.isError ? (
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-rose-400">
            {(metricsQuery.error as Error).message}
          </div>
        ) : m ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MetricCard
              label="Leads"
              value={formatNumber(m.leads.value)}
              change={m.leads.change}
              icon={Target}
            />
            <MetricCard
              label="Orders"
              value={formatNumber(m.orders.value)}
              change={m.orders.change}
              icon={ShoppingCart}
            />
            <MetricCard
              label="Revenue"
              value={formatINR(m.revenue.value)}
              change={m.revenue.change}
              icon={TrendingUp}
            />
            <MetricCard
              label="Users"
              value={formatNumber(m.users.value)}
              change={m.users.change}
              icon={Users}
            />
          </div>
        ) : null}
      </section>

      {/* ── Trend charts ─────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {metricsQuery.isPending ? (
          <>
            <div className="h-[280px] animate-pulse rounded-xl border border-border bg-card" />
            <div className="h-[280px] animate-pulse rounded-xl border border-border bg-card" />
          </>
        ) : charts ? (
          <>
            <TrendChart
              title="Leads"
              data={charts.leads}
              color="#6366f1"
              formatValue={formatNumber}
            />
            <TrendChart
              title="Revenue"
              data={charts.revenue}
              color="#10b981"
              formatValue={formatINR}
            />
          </>
        ) : null}
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ── Recent leads ───────────────────────────────────────────── */}
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Leads
            </h2>
            <Link
              href="/admin/leads"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="grid grid-cols-12 gap-2 border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <div className="col-span-5">Lead</div>
              <div className="col-span-3">Source</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Received</div>
            </div>

            {!canViewLeads ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                You don&apos;t have access to leads.
              </div>
            ) : leadsQuery.isPending ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : leadsQuery.isError ? (
              <div className="py-12 text-center text-sm text-rose-400">
                {(leadsQuery.error as Error).message}
              </div>
            ) : recentLeads.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
                <Inbox className="h-6 w-6" />
                No leads yet.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recentLeads.map((lead) => (
                  <li
                    key={lead.id}
                    onClick={() => router.push(`/admin/leads/${lead.id}`)}
                    className="grid cursor-pointer grid-cols-12 items-center gap-2 px-4 py-3 text-sm transition hover:bg-accent/50"
                  >
                    <div className="col-span-5 min-w-0">
                      <div className="truncate font-medium text-foreground">
                        {lead.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {lead.email || lead.phone || "—"}
                        {lead.businessName ? ` · ${lead.businessName}` : ""}
                      </div>
                    </div>
                    <div className="col-span-3 text-muted-foreground">
                      {sourceLabel(lead.source)}
                    </div>
                    <div className="col-span-2">
                      <LeadStatusBadge status={lead.status} />
                    </div>
                    <div className="col-span-2 text-right text-xs text-muted-foreground">
                      {timeAgo(lead.createdAt)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ── Quick actions + recent activity ────────────────────────── */}
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 transition hover:border-primary/40 hover:bg-accent/50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Activity className="h-4 w-4 text-muted-foreground" />
              Recent Activity
            </h2>
            <div className="rounded-xl border border-border bg-card p-2">
              {!canViewActivity ? (
                <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                  No access to the activity log.
                </p>
              ) : activityQuery.isPending ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                </div>
              ) : activityQuery.isError ? (
                <p className="px-2 py-8 text-center text-sm text-rose-400">
                  {(activityQuery.error as Error).message}
                </p>
              ) : activity.length === 0 ? (
                <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                  Nothing logged yet.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {activity.map((item) => (
                    <li key={item.id} className="px-2 py-2.5 text-sm">
                      <p className="text-foreground">
                        <span className="font-medium">
                          {item.user?.name ?? item.userName ?? "System"}
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {actionLabel(item.action)}
                        </span>{" "}
                        <span className="font-medium">
                          {item.entityName ?? item.module}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className={cn("capitalize")}>{item.module}</span>{" "}
                        · {timeAgo(item.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
