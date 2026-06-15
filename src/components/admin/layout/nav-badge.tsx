"use client";

import { useQuery } from "@tanstack/react-query";

import type { BadgeKey } from "@/lib/admin/nav";

interface NavCounts {
  newLeads: number;
  pendingOrders: number;
  pendingTestimonials: number;
}

/**
 * Live count pill next to a nav item. All instances share one query (React
 * Query dedupes by key), so the whole sidebar makes a single /nav-counts
 * request that refreshes on an interval.
 */
export function NavBadge({ badgeKey }: { badgeKey: BadgeKey }) {
  const { data } = useQuery({
    queryKey: ["admin", "nav-counts"],
    queryFn: async (): Promise<NavCounts> => {
      const res = await fetch("/api/admin/nav-counts");
      if (!res.ok) throw new Error("Failed to load nav counts");
      const json = await res.json();
      return json.data as NavCounts;
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const count = data?.[badgeKey] ?? 0;
  if (!count) return null;

  return (
    <span className="ml-auto inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary-foreground">
      {count > 99 ? "99+" : count}
    </span>
  );
}
