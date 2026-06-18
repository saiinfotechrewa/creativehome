import type { LeadSource, Priority } from "@prisma/client";

import { cn } from "@/lib/utils";
import {
  sourceLabel,
  priorityMeta,
  type CommunicationChannel,
} from "@/lib/admin/leads-client";

const SOURCE_BADGE: Record<LeadSource, string> = {
  CONTACT: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  DEMO: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  CONSULTATION: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  WHATSAPP: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

/** Coloured pill for where the lead came from. */
export function SourceBadge({ source }: { source: LeadSource }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        SOURCE_BADGE[source],
      )}
    >
      {sourceLabel(source)}
    </span>
  );
}

/** Neutral pill for the lead's business type (falls back to a dash). */
export function BusinessBadge({ type }: { type: string | null }) {
  if (!type) return <span className="text-xs text-muted-foreground/60">—</span>;
  return (
    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-foreground">
      {type}
    </span>
  );
}

/** Inline priority label coloured by urgency. */
export function PriorityTag({ priority }: { priority: Priority }) {
  const pr = priorityMeta(priority);
  return <span className={cn("text-xs font-medium", pr.badge)}>{pr.label}</span>;
}

export const CHANNEL_META: Record<
  CommunicationChannel,
  { label: string; badge: string }
> = {
  email: { label: "Email", badge: "bg-sky-500/15 text-sky-400" },
  whatsapp: { label: "WhatsApp", badge: "bg-emerald-500/15 text-emerald-400" },
  call: { label: "Call", badge: "bg-violet-500/15 text-violet-400" },
};
