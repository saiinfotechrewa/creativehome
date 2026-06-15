import type { LeadStatus } from "@prisma/client";

import { cn } from "@/lib/utils";
import { statusMeta } from "@/lib/admin/leads-client";

/** Coloured pill for a lead's pipeline status. */
export function LeadStatusBadge({
  status,
  className,
}: {
  status: LeadStatus;
  className?: string;
}) {
  const meta = statusMeta(status);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        meta.badge,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}
