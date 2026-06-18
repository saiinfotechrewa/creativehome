"use client";

import { toast } from "sonner";
import { RotateCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { ConfigCard, StubNotice } from "@/components/admin/integrations/integration-kit";

export interface MessageLogRow {
  id: string;
  date: string;
  to: string;
  template: string;
  status: "sent" | "delivered" | "failed";
}

const SAMPLE_LOGS: MessageLogRow[] = [
  {
    id: "1",
    date: "2026-06-17 09:14",
    to: "+91 98•••• 4321",
    template: "Lead welcome",
    status: "delivered",
  },
  {
    id: "2",
    date: "2026-06-17 08:02",
    to: "ria@acme.in",
    template: "Order Confirmation",
    status: "sent",
  },
  {
    id: "3",
    date: "2026-06-16 19:40",
    to: "+91 90•••• 1188",
    template: "Payment failed retry",
    status: "failed",
  },
];

const STATUS_BADGE: Record<MessageLogRow["status"], string> = {
  sent: "bg-blue-500/15 text-blue-400",
  delivered: "bg-emerald-500/15 text-emerald-400",
  failed: "bg-rose-500/15 text-rose-400",
};

/** Message-delivery log. Front-end preview with sample rows. */
export function MessageLogs({ rows = SAMPLE_LOGS }: { rows?: MessageLogRow[] }) {
  return (
    <ConfigCard title="Message logs" description="Recent outbound messages.">
      <StubNotice>
        Front-end preview with sample data — live logs ship with the messaging
        backend.
      </StubNotice>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">To</th>
              <th className="px-3 py-2">Template</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Resend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">
                  {r.date}
                </td>
                <td className="px-3 py-2 text-foreground">{r.to}</td>
                <td className="px-3 py-2 text-muted-foreground">{r.template}</td>
                <td className="px-3 py-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      STATUS_BADGE[r.status],
                    )}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => toast.info("Resend ships with the messaging backend.")}
                    className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2 text-xs font-medium text-foreground transition hover:bg-accent"
                  >
                    <RotateCw className="h-3.5 w-3.5" /> Resend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ConfigCard>
  );
}
