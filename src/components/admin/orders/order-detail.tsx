"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  User,
  Package,
  Receipt,
  CreditCard,
  RefreshCw,
  RotateCcw,
  FileText,
  Mail,
  Link2,
  ExternalLink,
  History,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { inputClass, labelClass } from "@/components/admin/ui/form";
import { Modal } from "@/components/admin/ui/modal";
import { formatINR } from "@/lib/admin/dashboard-client";
import {
  fetchOrder,
  updateOrderStatus,
  refundOrder,
  invoiceUrl,
  razorpayUrl,
  orderKeys,
  ORDER_STATUSES,
  type OrderActivity,
  type OrderDetail as OrderDetailType,
} from "@/lib/admin/orders-client";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/admin/orders/order-badges";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function describeActivity(a: OrderActivity): string {
  const who = a.userName ?? "Someone";
  switch (a.action) {
    case "create":
      return `${who} created this order`;
    case "status_change":
      if (a.details?.refundId) return `${who} issued a refund`;
      return `${who} changed status ${String(a.details?.from ?? "")} → ${String(
        a.details?.to ?? "",
      )}`.replace(" →  ", "");
    case "export":
      return `${who} generated the invoice`;
    default:
      return `${who} · ${a.action}`;
  }
}

export function OrderDetail({
  orderId,
  canManage,
}: {
  orderId: string;
  canManage: boolean;
}) {
  const qc = useQueryClient();
  const [modal, setModal] = useState<"refund" | null>(null);

  const { data: order, isPending, isError, error } = useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => fetchOrder(orderId),
  });

  function invalidate() {
    qc.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
    qc.invalidateQueries({ queryKey: orderKeys.all });
    qc.invalidateQueries({ queryKey: ["admin", "nav-counts"] });
  }

  const statusMutation = useMutation({
    mutationFn: (status: OrderDetailType["status"]) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      toast.success("Order status updated");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading order…
      </div>
    );
  }
  if (isError) {
    return (
      <div className="py-24 text-center text-sm text-rose-400">
        {(error as Error).message}
      </div>
    );
  }

  const { pricing, product, payment, subscription, customerInfo, customer } =
    order;
  const currency = pricing.currency ?? "INR";
  const email = customer?.email || customerInfo.email;
  const rpUrl = razorpayUrl(payment);
  const canRefund =
    canManage && order.status !== "REFUNDED" && !!payment.paymentId;
  const isPaid = order.status === "PAID" || order.status === "ACTIVE";

  // "Send invoice email" / "Send payment link" compose a mailto: on the client
  // (there's no transactional-email endpoint for orders yet).
  const invoiceMailto = email
    ? `mailto:${email}?subject=${encodeURIComponent(
        `Invoice for order ${order.orderNumber}`,
      )}&body=${encodeURIComponent(
        `Hi ${customerInfo.name ?? customer?.name ?? "there"},\n\n` +
          `Please find your invoice for order ${order.orderNumber} ` +
          `(${formatINR(pricing.total ?? 0)}).\n\nThank you for your business.`,
      )}`
    : undefined;
  const paymentLinkMailto = email
    ? `mailto:${email}?subject=${encodeURIComponent(
        `Complete your payment — order ${order.orderNumber}`,
      )}&body=${encodeURIComponent(
        `Hi ${customerInfo.name ?? customer?.name ?? "there"},\n\n` +
          `Your order ${order.orderNumber} for ${formatINR(
            pricing.total ?? 0,
          )} is awaiting payment. ` +
          `Reply to this email and we'll share a secure payment link.`,
      )}`
    : undefined;

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <header className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold text-foreground">
          {order.orderNumber}
        </h1>
        <OrderStatusBadge status={order.status} />
        <PaymentStatusBadge status={payment.status} />
        <span className="ml-auto text-xs text-muted-foreground">
          Placed {formatDateTime(order.createdAt)}
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.85fr_1fr]">
        {/* ───────────────── Left ───────────────── */}
        <div className="space-y-6">
          {/* Order summary / pricing */}
          <Section icon={Receipt} title="Order summary">
            <dl className="space-y-2 text-sm">
              <Row label="Subtotal">
                {formatINR(pricing.subtotal ?? 0)}
              </Row>
              <Row label="Tax">{formatINR(pricing.tax ?? 0)}</Row>
              {!!pricing.discount && (
                <Row label="Discount">
                  −{formatINR(pricing.discount ?? 0)}
                </Row>
              )}
              <div className="flex items-center justify-between border-t border-border pt-2 text-base font-semibold text-foreground">
                <dt>Total</dt>
                <dd>{formatINR(pricing.total ?? 0)}</dd>
              </div>
              <p className="text-right text-xs text-muted-foreground">
                Currency: {currency}
              </p>
            </dl>
          </Section>

          {/* Product info */}
          <Section icon={Package} title="Product">
            <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <Row label="Name">{product.name ?? "—"}</Row>
              <Row label="Slug">{product.slug ?? "—"}</Row>
              <Row label="Plan / tier">
                {product.plan ?? product.tier ?? "—"}
              </Row>
              <Row label="Quantity">{product.qty ?? 1}</Row>
            </dl>
          </Section>

          {/* Customer info */}
          <Section icon={User} title="Customer">
            <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <Row label="Name">
                {customer?.name ?? customerInfo.name ?? "Guest"}
              </Row>
              <Row label="Email">{email ?? "—"}</Row>
              <Row label="Phone">
                {customer?.phone ?? customerInfo.phone ?? "—"}
              </Row>
              <Row label="GSTIN">
                {customerInfo.gstNumber ?? customerInfo.gst ?? "—"}
              </Row>
            </dl>
            {customer && (
              <Link
                href={`/admin/customers/${customer.id}`}
                className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View customer profile <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}
          </Section>

          {/* Payment info */}
          <Section icon={CreditCard} title="Payment">
            <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <Row label="Gateway status">
                <PaymentStatusBadge status={payment.status} />
              </Row>
              <Row label="Method">{payment.method ?? "—"}</Row>
              <Row label="Razorpay order">
                <code className="break-all text-xs">
                  {payment.razorpayOrderId ?? "—"}
                </code>
              </Row>
              <Row label="Payment ID">
                <code className="break-all text-xs">
                  {payment.paymentId ?? "—"}
                </code>
              </Row>
              {payment.refundId && (
                <Row label="Refund ID">
                  <code className="break-all text-xs">{payment.refundId}</code>
                </Row>
              )}
              {payment.refundedAmount != null && (
                <Row label="Refunded">
                  {formatINR(payment.refundedAmount)}
                </Row>
              )}
            </dl>
          </Section>

          {/* Subscription info */}
          {subscription && Object.keys(subscription).length > 0 && (
            <Section icon={RefreshCw} title="Subscription">
              <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <Row label="Interval">{subscription.interval ?? "—"}</Row>
                <Row label="Auto-renew">
                  {subscription.autoRenew ? "Yes" : "No"}
                </Row>
                <Row label="Starts">
                  {subscription.startDate
                    ? formatDateTime(subscription.startDate)
                    : "—"}
                </Row>
                <Row label="Renews / ends">
                  {subscription.endDate
                    ? formatDateTime(subscription.endDate)
                    : "—"}
                </Row>
              </dl>
            </Section>
          )}
        </div>

        {/* ───────────────── Right ───────────────── */}
        <div className="space-y-6">
          {/* Status */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Status</h2>
            <label className={labelClass}>Order status</label>
            <select
              disabled={!canManage || statusMutation.isPending}
              value={order.status}
              onChange={(e) =>
                statusMutation.mutate(
                  e.target.value as OrderDetailType["status"],
                )
              }
              className={cn(inputClass, "mb-2")}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {!canManage && (
              <p className="text-xs text-muted-foreground">
                You have read-only access to orders.
              </p>
            )}
          </section>

          {/* Actions */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Actions
            </h2>
            <div className="space-y-2">
              {canManage && (
                <button
                  type="button"
                  onClick={() => setModal("refund")}
                  disabled={!canRefund}
                  className="flex w-full items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition hover:bg-accent disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  {order.status === "REFUNDED"
                    ? "Already refunded"
                    : "Initiate refund"}
                </button>
              )}

              <a
                href={invoiceUrl(order.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition hover:bg-accent"
              >
                <FileText className="h-4 w-4" /> Generate invoice PDF
              </a>

              <ActionLink
                href={invoiceMailto}
                icon={Mail}
                label="Send invoice email"
                disabledLabel="No customer email"
              />

              {!isPaid && (
                <ActionLink
                  href={paymentLinkMailto}
                  icon={Link2}
                  label="Send payment link"
                  disabledLabel="No customer email"
                />
              )}

              <ActionLink
                href={rpUrl ?? undefined}
                icon={ExternalLink}
                label="View in Razorpay"
                external
                disabledLabel="No payment yet"
              />
            </div>
          </section>

          {/* Activity */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <History className="h-4 w-4" /> Activity
            </h2>
            {order.activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              <ul className="space-y-3">
                {order.activities.map((a) => (
                  <li key={a.id} className="text-sm">
                    <p className="text-foreground">{describeActivity(a)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(a.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <RefundModal
        order={order}
        open={modal === "refund"}
        onClose={() => setModal(null)}
        onDone={() => {
          invalidate();
          setModal(null);
        }}
      />
    </div>
  );
}

// ─────────────────────────── Sub-components ──────────────────────────────────

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Receipt;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="h-4 w-4" /> {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right text-foreground">{children}</dd>
    </div>
  );
}

function ActionLink({
  href,
  icon: Icon,
  label,
  external,
  disabledLabel,
}: {
  href: string | undefined;
  icon: typeof Mail;
  label: string;
  external?: boolean;
  disabledLabel: string;
}) {
  if (!href) {
    return (
      <button
        type="button"
        disabled
        className="flex w-full cursor-not-allowed items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground opacity-50"
      >
        <Icon className="h-4 w-4" /> {label}
        <span className="ml-auto text-xs">{disabledLabel}</span>
      </button>
    );
  }
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="flex w-full items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition hover:bg-accent"
    >
      <Icon className="h-4 w-4" /> {label}
    </a>
  );
}

function RefundModal({
  order,
  open,
  onClose,
  onDone,
}: {
  order: OrderDetailType;
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  const fullAmount = order.pricing.total ?? 0;
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [speed, setSpeed] = useState<"normal" | "optimum">("normal");

  const mutation = useMutation({
    mutationFn: () =>
      refundOrder(order.id, {
        amount: amount.trim() ? Number(amount) : undefined,
        reason: reason.trim() || undefined,
        speed,
      }),
    onSuccess: () => {
      toast.success("Refund initiated");
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Initiate refund"
      description={`Refund payment for order ${order.orderNumber}.`}
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
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-rose-600 px-3 text-sm font-medium text-white transition hover:bg-rose-500 disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            {mutation.isPending ? "Refunding…" : "Refund"}
          </button>
        </>
      }
    >
      <label className={labelClass}>Amount (₹)</label>
      <input
        type="number"
        min={1}
        max={fullAmount}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={`Full refund: ${formatINR(fullAmount)}`}
        className={`${inputClass} mb-1`}
      />
      <p className="mb-4 text-xs text-muted-foreground">
        Leave blank to refund the full amount.
      </p>

      <label className={labelClass}>Reason</label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        placeholder="Internal note / reason for the refund"
        className="mb-4 min-h-[80px] w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      <label className={labelClass}>Speed</label>
      <select
        value={speed}
        onChange={(e) => setSpeed(e.target.value as "normal" | "optimum")}
        className={inputClass}
      >
        <option value="normal">Normal (free, 5–7 days)</option>
        <option value="optimum">Optimum (instant, fees apply)</option>
      </select>
    </Modal>
  );
}
