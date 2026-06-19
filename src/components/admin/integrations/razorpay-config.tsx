"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";

import {
  useIntegration,
  ConfigGate,
  ConfigCard,
  TextField,
  SecretField,
  SelectField,
  CopyField,
  Toggle,
  TestConnectionButton,
} from "@/components/admin/integrations/integration-kit";
import {
  ConfigHeader,
  SaveBar,
  ConfigLayout,
  useConfigDraft,
} from "@/components/admin/integrations/config-shell";
import {
  cfgStr,
  cfgBool,
  cfgArr,
  isMasked,
} from "@/lib/admin/integrations-client";
import { formatINR } from "@/lib/admin/dashboard-client";
import { fetchOrders, orderKeys } from "@/lib/admin/orders-client";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/admin/orders/order-badges";

const WEBHOOK_EVENTS = [
  "payment.captured",
  "payment.failed",
  "payment.authorized",
  "order.paid",
  "refund.created",
  "refund.processed",
  "subscription.charged",
  "subscription.cancelled",
];

const CURRENCIES = [
  { value: "INR", label: "INR — Indian Rupee" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — Pound Sterling" },
];

export function RazorpayConfig() {
  const state = useIntegration("razorpay");
  return (
    <ConfigLayout>
      <ConfigGate state={state}>
        <RazorpayInner key={state.data?.updatedAt ?? "new"} state={state} />
      </ConfigGate>
    </ConfigLayout>
  );
}

function RazorpayInner({
  state,
}: {
  state: ReturnType<typeof useIntegration>;
}) {
  const { config, isActive, setField, setIsActive, dirty } = useConfigDraft(
    state.data,
  );
  const mode = cfgStr(config, "mode") || "test";
  const selectedEvents = cfgArr(config, "webhookEvents");

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const webhookUrl = `${origin}/api/webhooks/razorpay`;

  function toggleEvent(ev: string, on: boolean) {
    const next = on
      ? [...new Set([...selectedEvents, ev])]
      : selectedEvents.filter((e) => e !== ev);
    setField("webhookEvents", next);
  }

  return (
    <>
      <ConfigHeader
        entryId="razorpay"
        isActive={isActive}
        onToggleActive={setIsActive}
        configured={state.data?.configured}
      />

      <div className="space-y-6">
        {/* Mode */}
        <ConfigCard title="Mode">
          <div className="flex items-center justify-between gap-4">
            <SelectField
              label="Environment"
              value={mode}
              onChange={(v) => setField("mode", v)}
              options={[
                { value: "test", label: "Test mode" },
                { value: "live", label: "Live mode" },
              ]}
            />
          </div>
          {mode === "live" && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Live mode processes real payments. Make sure you are using your
                live keys and webhook secret.
              </span>
            </div>
          )}
        </ConfigCard>

        {/* Keys */}
        <ConfigCard title="API keys">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Key ID"
              value={cfgStr(config, "keyId")}
              onChange={(v) => setField("keyId", v)}
              placeholder={mode === "live" ? "rzp_live_…" : "rzp_test_…"}
              mono
            />
            <SecretField
              label="Key Secret"
              value={cfgStr(config, "keySecret")}
              masked={isMasked(config.keySecret)}
              onChange={(v) => setField("keySecret", v)}
            />
          </div>
        </ConfigCard>

        {/* Webhook */}
        <ConfigCard title="Webhook">
          <div className="space-y-4">
            <CopyField
              label="Webhook URL"
              value={webhookUrl}
              hint="Add this URL in your Razorpay dashboard → Webhooks."
            />
            <SecretField
              label="Webhook Secret"
              value={cfgStr(config, "webhookSecret")}
              masked={isMasked(config.webhookSecret)}
              onChange={(v) => setField("webhookSecret", v)}
              hint="Used to verify the x-razorpay-signature on incoming events."
            />

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">
                Subscribed events
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {WEBHOOK_EVENTS.map((ev) => {
                  const checked = selectedEvents.includes(ev);
                  return (
                    <label
                      key={ev}
                      className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition hover:bg-accent"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => toggleEvent(ev, e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <code className="text-xs">{ev}</code>
                    </label>
                  );
                })}
              </div>
            </div>

            <TestConnectionButton integrationKey="razorpay" />
          </div>
        </ConfigCard>

        {/* Payment settings */}
        <ConfigCard title="Payment settings">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Default currency"
              value={cfgStr(config, "currency") || "INR"}
              onChange={(v) => setField("currency", v)}
              options={CURRENCIES}
            />
            <TextField
              label="GST rate (%)"
              type="number"
              value={cfgStr(config, "gstRate")}
              onChange={(v) => setField("gstRate", v)}
              placeholder="18"
            />
            <TextField
              label="Invoice prefix"
              value={cfgStr(config, "invoicePrefix")}
              onChange={(v) => setField("invoicePrefix", v)}
              placeholder="CD-"
            />
            <div className="flex items-end pb-1">
              <Toggle
                label="Auto-capture payments"
                description="Capture funds immediately on authorization."
                checked={cfgBool(config, "autoCapture", true)}
                onChange={(v) => setField("autoCapture", v)}
              />
            </div>
          </div>
        </ConfigCard>

        <RecentTransactions />
      </div>

      <SaveBar
        onSave={() => state.save({ isActive, config })}
        saving={state.saving}
        dirty={dirty}
      />
    </>
  );
}

function RecentTransactions() {
  const { data, isPending, isError } = useQuery({
    queryKey: orderKeys.list({ page: 1 }),
    queryFn: () => fetchOrders({ page: 1 }),
  });

  const orders = (data?.data ?? []).slice(0, 8);

  return (
    <ConfigCard
      title="Recent transactions"
      description="Latest orders from the store."
    >
      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : isError ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load transactions.
        </p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">No transactions yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Order #</th>
                <th className="px-3 py-2">Payment ID</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2">Payment</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-3 py-2 font-medium text-foreground">
                    {o.orderNumber}
                  </td>
                  <td className="px-3 py-2">
                    <code className="text-xs text-muted-foreground">
                      {o.payment?.paymentId ?? "—"}
                    </code>
                  </td>
                  <td className="px-3 py-2 text-right text-foreground">
                    {o.pricing?.total != null ? formatINR(o.pricing.total) : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <PaymentStatusBadge status={o.payment?.status} />
                  </td>
                  <td className="px-3 py-2">
                    <OrderStatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ConfigCard>
  );
}
