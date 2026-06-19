"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  MessageCircle,
  Building2,
  Pencil,
  Package,
  ShoppingCart,
  MessagesSquare,
  StickyNote,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { inputClass, labelClass } from "@/components/admin/ui/form";
import { Modal } from "@/components/admin/ui/modal";
import { formatINR } from "@/lib/admin/dashboard-client";
import { OrderStatusBadge } from "@/components/admin/orders/order-badges";
import {
  fetchCustomer,
  updateCustomer,
  customerKeys,
  type CustomerDetail as CustomerDetailType,
  type CustomerUpdateInput,
} from "@/lib/admin/customers-client";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const fieldRow = "flex items-start gap-2.5 text-sm";

export function CustomerDetail({
  customerId,
  canManage,
}: {
  customerId: string;
  canManage: boolean;
}) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: customer, isPending, isError, error } = useQuery({
    queryKey: customerKeys.detail(customerId),
    queryFn: () => fetchCustomer(customerId),
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading customer…
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

  const products = Array.isArray(customer.activeProducts)
    ? customer.activeProducts
    : [];
  const orders = customer.orders ?? [];
  const comms = [...(customer.communications ?? [])].reverse();
  const notes = [...(customer.lead?.notes ?? [])].reverse();

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/admin/customers"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to customers
      </Link>

      <header className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold text-foreground">
          {customer.name}
        </h1>
        <span className="ml-auto text-xs text-muted-foreground">
          Customer since {formatDate(customer.createdAt)}
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        {/* ───────────────── Left: profile ───────────────── */}
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Profile</h2>
              {canManage && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-foreground transition hover:bg-accent"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              <a
                href={`mailto:${customer.email}`}
                className={cn(fieldRow, "hover:text-primary")}
              >
                <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <span className="break-all">{customer.email}</span>
              </a>
              {customer.phone && (
                <a
                  href={`tel:${customer.phone}`}
                  className={cn(fieldRow, "hover:text-primary")}
                >
                  <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  {customer.phone}
                </a>
              )}
              {customer.whatsapp && (
                <div className={fieldRow}>
                  <MessageCircle className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  {customer.whatsapp}
                </div>
              )}
              {customer.businessName && (
                <div className={fieldRow}>
                  <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  {customer.businessName}
                  {customer.businessType ? ` · ${customer.businessType}` : ""}
                </div>
              )}
            </div>

            <dl className="mt-4 space-y-1.5 border-t border-border pt-3 text-xs">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">GSTIN</dt>
                <dd className="text-foreground">
                  {customer.gstNumber || "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total spent</dt>
                <dd className="font-medium text-foreground">
                  {formatINR(customer.totalSpent)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Orders</dt>
                <dd className="text-foreground">
                  {customer._count?.orders ?? customer.ordersCount}
                </dd>
              </div>
              {customer.leadId && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Origin</dt>
                  <dd>
                    <Link
                      href={`/admin/leads/${customer.leadId}`}
                      className="text-primary hover:underline"
                    >
                      View lead
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Active subscriptions */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Package className="h-4 w-4" /> Active subscriptions
            </h2>
            {products.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No active products.
              </p>
            ) : (
              <ul className="space-y-2">
                {products.map((p, i) => (
                  <li
                    key={`${p.slug}-${i}`}
                    className="rounded-lg border border-border/60 p-3 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        {p.slug}
                      </span>
                      {p.plan && (
                        <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-xs font-medium text-emerald-400">
                          {p.plan}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {p.since ? `Since ${formatDate(p.since)}` : ""}
                      {p.renewsOn ? ` · Renews ${formatDate(p.renewsOn)}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* ───────────────── Right: history ───────────────── */}
        <div className="space-y-6">
          {/* Order history */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShoppingCart className="h-4 w-4" /> Order history
            </h2>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <th className="py-2 pr-3">Order #</th>
                      <th className="py-2 pr-3">Product</th>
                      <th className="py-2 pr-3 text-right">Amount</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td className="py-2 pr-3">
                          <Link
                            href={`/admin/orders/${o.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {o.orderNumber}
                          </Link>
                        </td>
                        <td className="py-2 pr-3 text-foreground">
                          {o.product?.name ?? "—"}
                        </td>
                        <td className="py-2 pr-3 text-right text-foreground">
                          {o.pricing?.total != null
                            ? formatINR(o.pricing.total)
                            : "—"}
                        </td>
                        <td className="py-2 pr-3">
                          <OrderStatusBadge status={o.status} />
                        </td>
                        <td className="py-2 text-right text-xs text-muted-foreground">
                          {formatDate(o.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Communication log */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <MessagesSquare className="h-4 w-4" /> Communication
            </h2>
            {comms.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No communication logged.
              </p>
            ) : (
              <ul className="space-y-3">
                {comms.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-lg border border-border/60 p-3"
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs">
                      <span className="rounded bg-muted px-1.5 py-0.5 font-medium capitalize text-foreground">
                        {c.channel}
                      </span>
                      <span className="ml-auto text-muted-foreground">
                        {formatDateTime(c.at)}
                      </span>
                    </div>
                    {c.subject && (
                      <p className="text-sm font-medium text-foreground">
                        {c.subject}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {c.summary}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Notes (from the originating lead) */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <StickyNote className="h-4 w-4" /> Notes
            </h2>
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes.</p>
            ) : (
              <ul className="space-y-3">
                {notes.map((n) => (
                  <li
                    key={n.id}
                    className="rounded-lg border border-border/60 p-3"
                  >
                    <p className="whitespace-pre-wrap text-sm text-foreground">
                      {n.text}
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {n.byName ?? "Unknown"} · {formatDateTime(n.at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <EditCustomerModal
        customer={customer}
        open={editing}
        onClose={() => setEditing(false)}
        onSaved={() => {
          qc.invalidateQueries({ queryKey: customerKeys.detail(customerId) });
          qc.invalidateQueries({ queryKey: customerKeys.all });
          setEditing(false);
        }}
      />
    </div>
  );
}

function EditCustomerModal({
  customer,
  open,
  onClose,
  onSaved,
}: {
  customer: CustomerDetailType;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<CustomerUpdateInput>({
    name: customer.name,
    email: customer.email,
    phone: customer.phone ?? "",
    whatsapp: customer.whatsapp ?? "",
    businessName: customer.businessName ?? "",
    businessType: customer.businessType ?? "",
    gstNumber: customer.gstNumber ?? "",
  });

  const patch = (p: Partial<CustomerUpdateInput>) =>
    setForm((f) => ({ ...f, ...p }));

  const mutation = useMutation({
    mutationFn: () => updateCustomer(customer.id, form),
    onSuccess: () => {
      toast.success("Customer updated");
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit customer"
      description="Update the customer's contact and business details."
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
            disabled={!form.name?.trim() || !form.email?.trim() || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {mutation.isPending ? "Saving…" : "Save changes"}
          </button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <ModalField label="Name">
          <input
            value={form.name ?? ""}
            onChange={(e) => patch({ name: e.target.value })}
            className={inputClass}
          />
        </ModalField>
        <ModalField label="Email">
          <input
            value={form.email ?? ""}
            onChange={(e) => patch({ email: e.target.value })}
            className={inputClass}
          />
        </ModalField>
        <ModalField label="Phone">
          <input
            value={form.phone ?? ""}
            onChange={(e) => patch({ phone: e.target.value })}
            className={inputClass}
          />
        </ModalField>
        <ModalField label="WhatsApp">
          <input
            value={form.whatsapp ?? ""}
            onChange={(e) => patch({ whatsapp: e.target.value })}
            className={inputClass}
          />
        </ModalField>
        <ModalField label="Business name">
          <input
            value={form.businessName ?? ""}
            onChange={(e) => patch({ businessName: e.target.value })}
            className={inputClass}
          />
        </ModalField>
        <ModalField label="Business type">
          <input
            value={form.businessType ?? ""}
            onChange={(e) => patch({ businessType: e.target.value })}
            className={inputClass}
          />
        </ModalField>
        <ModalField label="GSTIN" className="sm:col-span-2">
          <input
            value={form.gstNumber ?? ""}
            onChange={(e) => patch({ gstNumber: e.target.value.toUpperCase() })}
            placeholder="22AAAAA0000A1Z5"
            className={inputClass}
          />
        </ModalField>
      </div>
    </Modal>
  );
}

function ModalField({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}
