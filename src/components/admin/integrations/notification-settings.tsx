"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  BellRing,
  Loader2,
  Mail,
  MessageCircle,
  Smartphone,
  Plus,
  X,
  Save,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ConfigCard, Toggle } from "@/components/admin/integrations/integration-kit";
import {
  fetchNotificationSettings,
  updateNotificationSetting,
  integrationKeys,
  emptyChannels,
  NOTIFICATION_EVENT_META,
  type NotificationChannels,
  type NotificationEvent,
  type NotificationSettingItem,
} from "@/lib/admin/integrations-client";

export function NotificationSettings() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: integrationKeys.notifications,
    queryFn: fetchNotificationSettings,
  });

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/integrations"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Integration Hub
      </Link>

      <header className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-pink-400">
          <BellRing className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Notification settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose which channels fire for each event, and who receives them.
          </p>
        </div>
      </header>

      {isPending ? (
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : isError ? (
        <div className="py-24 text-center text-sm text-rose-400">
          {(error as Error).message}
        </div>
      ) : (
        <div className="space-y-4">
          {NOTIFICATION_EVENT_META.map((meta) => {
            const row = data?.find((d) => d.event === meta.event);
            return (
              <EventCard
                key={meta.event}
                event={meta.event}
                label={meta.label}
                description={meta.description}
                initial={row}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function EventCard({
  event,
  label,
  description,
  initial,
}: {
  event: NotificationEvent;
  label: string;
  description: string;
  initial: NotificationSettingItem | undefined;
}) {
  const qc = useQueryClient();
  const [channels, setChannels] = useState<NotificationChannels>(
    initial?.channels ?? emptyChannels(),
  );
  const [baseline, setBaseline] = useState(
    JSON.stringify(initial?.channels ?? emptyChannels()),
  );

  useEffect(() => {
    if (initial?.channels) {
      setChannels(initial.channels);
      setBaseline(JSON.stringify(initial.channels));
    }
  }, [initial?.channels]);

  const dirty = baseline !== JSON.stringify(channels);

  const mutation = useMutation({
    mutationFn: () => updateNotificationSetting(event, channels),
    onSuccess: (saved) => {
      toast.success(`${label} updated`);
      setBaseline(JSON.stringify(saved.channels));
      qc.invalidateQueries({ queryKey: integrationKeys.notifications });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const setEmail = (p: Partial<NotificationChannels["email"]>) =>
    setChannels((c) => ({ ...c, email: { ...c.email, ...p } }));
  const setWhatsapp = (p: Partial<NotificationChannels["whatsapp"]>) =>
    setChannels((c) => ({ ...c, whatsapp: { ...c.whatsapp, ...p } }));
  const setSms = (p: Partial<NotificationChannels["sms"]>) =>
    setChannels((c) => ({ ...c, sms: { ...c.sms, ...p } }));

  return (
    <ConfigCard>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{label}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <button
          type="button"
          onClick={() =>
            toast.info("Test send ships with the notification dispatcher.")
          }
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-foreground transition hover:bg-accent"
        >
          <BellRing className="h-3.5 w-3.5" /> Test
        </button>
      </div>

      <div className="space-y-3">
        <ChannelBlock
          icon={Mail}
          label="Email"
          enabled={channels.email.enabled}
          onToggle={(v) => setEmail({ enabled: v })}
          recipients={channels.email.recipients}
          onChangeRecipients={(r) => setEmail({ recipients: r })}
          placeholder="name@example.com"
        />
        <ChannelBlock
          icon={MessageCircle}
          label="WhatsApp"
          enabled={channels.whatsapp.enabled}
          onToggle={(v) => setWhatsapp({ enabled: v })}
          recipients={channels.whatsapp.numbers}
          onChangeRecipients={(r) => setWhatsapp({ numbers: r })}
          placeholder="+91…"
        />
        <ChannelBlock
          icon={Smartphone}
          label="SMS"
          enabled={channels.sms.enabled}
          onToggle={(v) => setSms({ enabled: v })}
          recipients={channels.sms.numbers}
          onChangeRecipients={(r) => setSms({ numbers: r })}
          placeholder="+91…"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={!dirty || mutation.isPending}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save
        </button>
      </div>
    </ConfigCard>
  );
}

function ChannelBlock({
  icon: Icon,
  label,
  enabled,
  onToggle,
  recipients,
  onChangeRecipients,
  placeholder,
}: {
  icon: typeof Mail;
  label: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  recipients: string[];
  onChangeRecipients: (r: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const v = draft.trim();
    if (!v || recipients.includes(v)) return;
    onChangeRecipients([...recipients, v]);
    setDraft("");
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border p-3 transition",
        !enabled && "opacity-70",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Icon className="h-4 w-4 text-muted-foreground" /> {label}
        </span>
        <Toggle checked={enabled} onChange={onToggle} />
      </div>

      {enabled && (
        <div className="mt-3">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {recipients.length === 0 ? (
              <span className="text-xs text-muted-foreground">
                No recipients yet.
              </span>
            ) : (
              recipients.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs text-foreground"
                >
                  {r}
                  <button
                    type="button"
                    onClick={() =>
                      onChangeRecipients(recipients.filter((x) => x !== r))
                    }
                    aria-label={`Remove ${r}`}
                    className="text-muted-foreground hover:text-rose-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  add();
                }
              }}
              placeholder={placeholder}
              className="h-9 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={add}
              className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-2.5 text-sm font-medium text-foreground transition hover:bg-accent"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
