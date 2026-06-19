"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Send,
  Webhook as WebhookIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { inputClass, labelClass } from "@/components/admin/ui/form";
import { Modal } from "@/components/admin/ui/modal";
import {
  ConfigCard,
  StubNotice,
  Toggle,
} from "@/components/admin/integrations/integration-kit";

interface CustomWebhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  lastTriggered: string | null;
}

interface DeliveryLog {
  id: string;
  webhook: string;
  event: string;
  status: number;
  at: string;
}

const EVENT_OPTIONS = [
  "lead.created",
  "order.paid",
  "order.refunded",
  "customer.created",
  "testimonial.submitted",
];

const SAMPLE_WEBHOOKS: CustomWebhook[] = [
  {
    id: "1",
    name: "CRM sync",
    url: "https://hooks.example.com/crm",
    events: ["lead.created", "customer.created"],
    active: true,
    lastTriggered: "2026-06-17 09:14",
  },
  {
    id: "2",
    name: "Slack alerts",
    url: "https://hooks.slack.com/services/…",
    events: ["order.paid"],
    active: false,
    lastTriggered: null,
  },
];

const SAMPLE_LOGS: DeliveryLog[] = [
  { id: "1", webhook: "CRM sync", event: "lead.created", status: 200, at: "2026-06-17 09:14" },
  { id: "2", webhook: "CRM sync", event: "customer.created", status: 200, at: "2026-06-17 08:40" },
  { id: "3", webhook: "Slack alerts", event: "order.paid", status: 500, at: "2026-06-16 21:02" },
];

export function WebhooksManager() {
  const [webhooks, setWebhooks] = useState<CustomWebhook[]>(SAMPLE_WEBHOOKS);
  const [open, setOpen] = useState(false);

  function addWebhook(w: Omit<CustomWebhook, "id" | "lastTriggered">) {
    setWebhooks((prev) => [
      ...prev,
      { ...w, id: `wh_${Date.now()}`, lastTriggered: null },
    ]);
    setOpen(false);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/integrations"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Integration Hub
      </Link>

      <header className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-rose-400">
            <WebhookIcon className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Webhooks</h1>
            <p className="text-sm text-muted-foreground">
              Send events to your own endpoints.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add webhook
        </button>
      </header>

      <div className="space-y-6">
        <ConfigCard title="Endpoints">
          <StubNotice>
            Front-end preview — custom webhooks are not yet persisted (no backend
            model). The Razorpay webhook is configured on its own page.
          </StubNotice>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">URL</th>
                  <th className="px-3 py-2">Events</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Last triggered</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {webhooks.map((w) => (
                  <tr key={w.id}>
                    <td className="px-3 py-2 font-medium text-foreground">
                      {w.name}
                    </td>
                    <td className="max-w-[14rem] truncate px-3 py-2">
                      <code className="text-xs text-muted-foreground">
                        {w.url}
                      </code>
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {w.events.length} event{w.events.length === 1 ? "" : "s"}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          w.active
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {w.active ? "Active" : "Paused"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {w.lastTriggered ?? "Never"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            toast.info("Test delivery ships with the webhook backend.")
                          }
                          aria-label="Test webhook"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground transition hover:bg-accent"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setWebhooks((prev) =>
                              prev.filter((x) => x.id !== w.id),
                            )
                          }
                          aria-label="Delete webhook"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-rose-400 transition hover:bg-rose-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ConfigCard>

        <ConfigCard title="Delivery logs" description="Recent webhook attempts.">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2">When</th>
                  <th className="px-3 py-2">Webhook</th>
                  <th className="px-3 py-2">Event</th>
                  <th className="px-3 py-2 text-right">Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SAMPLE_LOGS.map((l) => (
                  <tr key={l.id}>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {l.at}
                    </td>
                    <td className="px-3 py-2 text-foreground">{l.webhook}</td>
                    <td className="px-3 py-2">
                      <code className="text-xs text-muted-foreground">
                        {l.event}
                      </code>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span
                        className={cn(
                          "font-mono text-xs font-medium",
                          l.status < 300 ? "text-emerald-400" : "text-rose-400",
                        )}
                      >
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ConfigCard>
      </div>

      <AddWebhookModal
        open={open}
        onClose={() => setOpen(false)}
        onAdd={addWebhook}
      />
    </div>
  );
}

function AddWebhookModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (w: Omit<CustomWebhook, "id" | "lastTriggered">) => void;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [active, setActive] = useState(true);

  function toggleEvent(ev: string) {
    setEvents((prev) =>
      prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev],
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add webhook"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-md border border-border px-3 text-sm text-foreground transition hover:bg-accent"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!name.trim() || !url.trim() || events.length === 0}
            onClick={() => {
              onAdd({ name: name.trim(), url: url.trim(), events, active });
              setName("");
              setUrl("");
              setEvents([]);
              setActive(true);
            }}
            className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            Add webhook
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Endpoint URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Events</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {EVENT_OPTIONS.map((ev) => (
              <label
                key={ev}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition hover:bg-accent"
              >
                <input
                  type="checkbox"
                  checked={events.includes(ev)}
                  onChange={() => toggleEvent(ev)}
                  className="h-4 w-4 rounded border-border"
                />
                <code className="text-xs">{ev}</code>
              </label>
            ))}
          </div>
        </div>
        <Toggle
          label="Active"
          checked={active}
          onChange={setActive}
        />
      </div>
    </Modal>
  );
}
