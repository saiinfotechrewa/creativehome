"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  MessageCircle,
  Building2,
  Users,
  CalendarClock,
  CheckCircle2,
  StickyNote,
  History,
  PhoneCall,
  UserPlus,
  XCircle,
  Trash2,
  MessagesSquare,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { inputClass, labelClass } from "@/components/admin/ui/form";
import { Modal, ConfirmDialog } from "@/components/admin/ui/modal";
import {
  fetchLead,
  fetchAssignees,
  updateLeadStatus,
  updateLeadPriority,
  assignLead,
  addLeadNote,
  sendCommunication,
  convertLead,
  deleteLead,
  leadKeys,
  LEAD_STATUSES,
  LEAD_PRIORITIES,
  sourceLabel,
  priorityMeta,
  type LeadActivity,
  type Communication,
  type LeadDetail as LeadDetailType,
} from "@/lib/admin/leads-client";
import { LeadStatusBadge } from "@/components/admin/leads/lead-status-badge";
import { SourceBadge, CHANNEL_META } from "@/components/admin/leads/lead-badges";
import { WhatsAppComposer } from "@/components/admin/leads/whatsapp-composer";
import { EmailComposer } from "@/components/admin/leads/email-composer";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Human sentence for an activity log entry. */
function describeActivity(a: LeadActivity): string {
  const who = a.userName ?? "Someone";
  switch (a.action) {
    case "create":
      return a.details?.note ? `${who} added a note` : `${who} created this lead`;
    case "status_change":
      return `${who} moved status ${String(a.details?.from)} → ${String(a.details?.to)}`;
    case "delete":
      return `${who} deleted the lead`;
    case "update":
      if (a.details?.convertedToCustomer) return `${who} converted to a customer`;
      if (a.details?.communication)
        return `${who} sent a ${String(a.details.communication)} message`;
      if (a.details?.assignedTo || a.details?.unassigned)
        return `${who} changed the assignee`;
      return `${who} updated the lead`;
    default:
      return `${who} · ${a.action}`;
  }
}

const fieldRow = "flex items-start gap-2.5 text-sm";

type ModalKind = "whatsapp" | "email" | "call" | "convert" | "lost" | "delete";

export function LeadDetail({
  leadId,
  canManage,
}: {
  leadId: string;
  canManage: boolean;
}) {
  const qc = useQueryClient();
  const router = useRouter();
  const [noteText, setNoteText] = useState("");
  const [modal, setModal] = useState<ModalKind | null>(null);
  const close = () => setModal(null);

  const { data: lead, isPending, isError, error } = useQuery({
    queryKey: leadKeys.detail(leadId),
    queryFn: () => fetchLead(leadId),
  });

  const { data: assignees } = useQuery({
    queryKey: leadKeys.assignees,
    queryFn: fetchAssignees,
    staleTime: 5 * 60_000,
    enabled: canManage,
  });

  function invalidate() {
    qc.invalidateQueries({ queryKey: leadKeys.detail(leadId) });
    qc.invalidateQueries({ queryKey: leadKeys.all });
    qc.invalidateQueries({ queryKey: ["admin", "nav-counts"] });
  }

  const statusMutation = useMutation({
    mutationFn: (status: LeadDetailType["status"]) =>
      updateLeadStatus(leadId, status),
    onSuccess: () => {
      toast.success("Status updated");
      invalidate();
      close();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const priorityMutation = useMutation({
    mutationFn: (priority: LeadDetailType["priority"]) =>
      updateLeadPriority(leadId, priority),
    onSuccess: () => {
      toast.success("Priority updated");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const assignMutation = useMutation({
    mutationFn: (assignedTo: string | null) => assignLead(leadId, assignedTo),
    onSuccess: () => {
      toast.success("Assignment updated");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const noteMutation = useMutation({
    mutationFn: (text: string) => addLeadNote(leadId, text),
    onSuccess: () => {
      toast.success("Note added");
      setNoteText("");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const consultationDoneMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultation: { ...(lead?.consultation ?? {}), status: "completed" },
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error ?? "Update failed");
      }
    },
    onSuccess: () => {
      toast.success("Consultation marked complete");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const callMutation = useMutation({
    mutationFn: (message: string) =>
      sendCommunication(leadId, { channel: "call", message }),
    onSuccess: () => {
      toast.success("Call logged");
      invalidate();
      close();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteLead(leadId),
    onSuccess: () => {
      toast.success("Lead deleted");
      qc.invalidateQueries({ queryKey: leadKeys.all });
      router.push("/admin/leads");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading lead…
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

  const pr = priorityMeta(lead.priority);
  const consultation = lead.consultation as {
    date?: string;
    time?: string;
    mode?: string;
    method?: string;
    status?: string;
    notes?: string;
  };
  const hasConsultation = consultation && Object.keys(consultation).length > 0;
  const consultationDone = consultation?.status === "completed";
  const notesNewestFirst = [...lead.notes].reverse();
  const comms = [...lead.communications].reverse();

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/admin/leads"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to leads
      </Link>

      <header className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold text-foreground">{lead.name}</h1>
        <LeadStatusBadge status={lead.status} />
        <span className={cn("text-sm font-medium", pr.badge)}>
          {pr.label} priority
        </span>
        <SourceBadge source={lead.source} />
        <span className="ml-auto text-xs text-muted-foreground">
          Received {formatDateTime(lead.createdAt)}
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.85fr_1fr]">
        {/* ───────────────── Left 65% ───────────────── */}
        <div className="space-y-6">
          {/* Lead info + quick actions */}
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <ActionButton
                icon={PhoneCall}
                label="Call"
                href={lead.phone ? `tel:${lead.phone}` : undefined}
                disabled={!lead.phone}
              />
              <ActionButton
                icon={Mail}
                label="Email"
                onClick={() => setModal("email")}
                disabled={!canManage || !lead.email}
              />
              <ActionButton
                icon={MessageCircle}
                label="WhatsApp"
                onClick={() => setModal("whatsapp")}
                disabled={!canManage || !(lead.whatsapp || lead.phone)}
                tone="emerald"
              />
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {lead.email && (
                <a href={`mailto:${lead.email}`} className={cn(fieldRow, "hover:text-primary")}>
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span className="break-all">{lead.email}</span>
                </a>
              )}
              {lead.phone && (
                <a href={`tel:${lead.phone}`} className={cn(fieldRow, "hover:text-primary")}>
                  <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  {lead.phone}
                </a>
              )}
              {lead.whatsapp && (
                <div className={fieldRow}>
                  <MessageCircle className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  {lead.whatsapp}
                </div>
              )}
              {lead.businessName && (
                <div className={fieldRow}>
                  <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  {lead.businessName}
                  {lead.businessType ? ` · ${lead.businessType}` : ""}
                </div>
              )}
              {lead.teamSize && (
                <div className={fieldRow}>
                  <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  Team size: {lead.teamSize}
                </div>
              )}
            </div>

            {lead.interestedProducts.length > 0 && (
              <div className="mt-4">
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Interested in
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {lead.interestedProducts.map((p) => (
                    <span
                      key={p}
                      className="rounded-md bg-muted px-2 py-0.5 text-xs text-foreground"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {lead.description && (
              <div className="mt-4">
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Message
                </p>
                <p className="whitespace-pre-wrap text-sm text-foreground">
                  {lead.description}
                </p>
              </div>
            )}
          </section>

          {/* Consultation */}
          {hasConsultation && (
            <section className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <CalendarClock className="h-4 w-4" /> Consultation
              </h2>
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm">
                  <p className="text-foreground">
                    {[consultation.date, consultation.time]
                      .filter(Boolean)
                      .join(" · ") || "Requested"}
                  </p>
                  {(consultation.method || consultation.mode) && (
                    <p className="text-muted-foreground">
                      Method: {consultation.method ?? consultation.mode}
                    </p>
                  )}
                  {consultation.notes && (
                    <p className="mt-1 text-muted-foreground">{consultation.notes}</p>
                  )}
                  <span
                    className={cn(
                      "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      consultationDone
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-amber-500/15 text-amber-400",
                    )}
                  >
                    {consultationDone ? "Completed" : "Scheduled"}
                  </span>
                </div>
                {canManage && !consultationDone && (
                  <button
                    type="button"
                    disabled={consultationDoneMutation.isPending}
                    onClick={() => consultationDoneMutation.mutate()}
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-foreground transition hover:bg-accent disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Mark complete
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Communication log */}
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MessagesSquare className="h-4 w-4" /> Communication
              </h2>
              {canManage && (
                <div className="flex flex-wrap gap-1.5">
                  <LogButton
                    icon={MessageCircle}
                    label="WhatsApp"
                    onClick={() => setModal("whatsapp")}
                  />
                  <LogButton
                    icon={Mail}
                    label="Email"
                    onClick={() => setModal("email")}
                  />
                  <LogButton
                    icon={PhoneCall}
                    label="Log call"
                    onClick={() => setModal("call")}
                  />
                </div>
              )}
            </div>

            {comms.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No communication logged yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {comms.map((c) => (
                  <CommunicationItem key={c.id} comm={c} />
                ))}
              </ul>
            )}
          </section>

          {/* Notes */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <StickyNote className="h-4 w-4" /> Notes
            </h2>

            {canManage && (
              <div className="mb-4 flex flex-col gap-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={2}
                  placeholder="Add an internal note…"
                  className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  disabled={!noteText.trim() || noteMutation.isPending}
                  onClick={() => noteMutation.mutate(noteText.trim())}
                  className="self-end rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {noteMutation.isPending ? "Adding…" : "Add note"}
                </button>
              </div>
            )}

            {notesNewestFirst.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes yet.</p>
            ) : (
              <ul className="space-y-3">
                {notesNewestFirst.map((n) => (
                  <li key={n.id} className="rounded-lg border border-border/60 p-3">
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

        {/* ───────────────── Right 35% ───────────────── */}
        <div className="space-y-6">
          {/* Status / pipeline */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Status</h2>

            <label className={labelClass}>Stage</label>
            <select
              disabled={!canManage || statusMutation.isPending}
              value={lead.status}
              onChange={(e) =>
                statusMutation.mutate(e.target.value as LeadDetailType["status"])
              }
              className={cn(inputClass, "mb-4")}
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <label className={labelClass}>Priority</label>
            <select
              disabled={!canManage || priorityMutation.isPending}
              value={lead.priority}
              onChange={(e) =>
                priorityMutation.mutate(
                  e.target.value as LeadDetailType["priority"],
                )
              }
              className={cn(inputClass, "mb-4")}
            >
              {LEAD_PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>

            <label className={labelClass}>Assigned to</label>
            <select
              disabled={!canManage || assignMutation.isPending}
              value={lead.assignedTo ?? ""}
              onChange={(e) =>
                assignMutation.mutate(e.target.value === "" ? null : e.target.value)
              }
              className={cn(inputClass, "mb-4")}
            >
              <option value="">Unassigned</option>
              {assignees?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <dl className="space-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <dt>Source</dt>
                <dd className="text-foreground">{sourceLabel(lead.source)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Created</dt>
                <dd className="text-foreground">{formatDateTime(lead.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Updated</dt>
                <dd className="text-foreground">{formatDateTime(lead.updatedAt)}</dd>
              </div>
            </dl>

            {!canManage && (
              <p className="mt-3 text-xs text-muted-foreground">
                You have read-only access to leads.
              </p>
            )}
          </section>

          {/* Actions */}
          {canManage && (
            <section className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Actions</h2>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setModal("convert")}
                  disabled={lead.status === "CONVERTED"}
                  className="flex w-full items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4" />
                  {lead.status === "CONVERTED"
                    ? "Already converted"
                    : "Convert to customer"}
                </button>
                <button
                  type="button"
                  onClick={() => setModal("lost")}
                  disabled={lead.status === "LOST"}
                  className="flex w-full items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground transition hover:bg-accent disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" /> Mark as lost
                </button>
                <button
                  type="button"
                  onClick={() => setModal("delete")}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-rose-400 transition hover:bg-rose-500/10"
                >
                  <Trash2 className="h-4 w-4" /> Delete lead
                </button>
              </div>
            </section>
          )}

          {/* Activity timeline */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <History className="h-4 w-4" /> Activity
            </h2>
            {lead.activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              <ul className="space-y-3">
                {lead.activities.map((a) => (
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

      {/* ───────────────── Modals ───────────────── */}
      <WhatsAppComposer
        lead={lead}
        open={modal === "whatsapp"}
        onClose={close}
        onSent={() => {
          invalidate();
          close();
        }}
      />
      <EmailComposer
        lead={lead}
        open={modal === "email"}
        onClose={close}
        onSent={() => {
          invalidate();
          close();
        }}
      />
      <LogCallModal
        open={modal === "call"}
        onClose={close}
        onSubmit={(summary) => callMutation.mutate(summary)}
        loading={callMutation.isPending}
      />
      <ConvertModal
        lead={lead}
        open={modal === "convert"}
        onClose={close}
        onConverted={() => {
          invalidate();
          close();
        }}
      />
      <ConfirmDialog
        open={modal === "lost"}
        onClose={close}
        onConfirm={() => statusMutation.mutate("LOST")}
        title="Mark lead as lost?"
        message="This sets the lead's stage to Lost. You can move it back later."
        confirmLabel="Mark lost"
        tone="default"
        loading={statusMutation.isPending}
      />
      <ConfirmDialog
        open={modal === "delete"}
        onClose={close}
        onConfirm={() => deleteMutation.mutate()}
        title="Delete this lead?"
        message="This permanently removes the lead and its notes and communication log. Any linked customer is kept. This cannot be undone."
        confirmLabel="Delete lead"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

// ─────────────────────────── Sub-components ──────────────────────────────────

function ActionButton({
  icon: Icon,
  label,
  href,
  onClick,
  disabled,
  tone = "default",
}: {
  icon: typeof Mail;
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "default" | "emerald";
}) {
  const cls = cn(
    "inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40",
    tone === "emerald"
      ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
      : "border-border text-foreground hover:bg-accent",
  );
  if (href && !disabled) {
    return (
      <a href={href} className={cls}>
        <Icon className="h-4 w-4" /> {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

function LogButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Mail;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-foreground transition hover:bg-accent"
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function CommunicationItem({ comm }: { comm: Communication }) {
  const meta = CHANNEL_META[comm.channel];
  const delivered = comm.status === "sent" || comm.status === "logged";
  return (
    <li className="rounded-lg border border-border/60 p-3">
      <div className="mb-1 flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium",
            meta.badge,
          )}
        >
          {meta.label}
        </span>
        <span
          className={cn(
            "text-xs",
            delivered ? "text-emerald-400" : "text-rose-400",
          )}
        >
          {comm.status === "logged"
            ? "logged"
            : comm.status === "sent"
              ? "sent"
              : "not delivered"}
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          {formatDateTime(comm.at)}
        </span>
      </div>
      {comm.subject && (
        <p className="text-sm font-medium text-foreground">{comm.subject}</p>
      )}
      <p className="whitespace-pre-wrap text-sm text-muted-foreground">
        {comm.summary}
      </p>
      {comm.byName && (
        <p className="mt-1 text-xs text-muted-foreground/70">by {comm.byName}</p>
      )}
    </li>
  );
}

function LogCallModal({
  open,
  onClose,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (summary: string) => void;
  loading: boolean;
}) {
  const [summary, setSummary] = useState("");
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log a call"
      description="Record the outcome of a phone conversation."
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
            disabled={!summary.trim() || loading}
            onClick={() => onSubmit(summary.trim())}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            <PhoneCall className="h-4 w-4" />
            {loading ? "Saving…" : "Log call"}
          </button>
        </>
      }
    >
      <label className={labelClass}>Call summary</label>
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={5}
        placeholder="What was discussed? Next steps?"
        className="min-h-[120px] w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </Modal>
  );
}

function ConvertModal({
  lead,
  open,
  onClose,
  onConverted,
}: {
  lead: LeadDetailType;
  open: boolean;
  onClose: () => void;
  onConverted: () => void;
}) {
  const [email, setEmail] = useState(lead.email ?? "");
  const [phone, setPhone] = useState(lead.phone ?? "");
  const [gstNumber, setGstNumber] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      convertLead(lead.id, {
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        gstNumber: gstNumber.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success("Lead converted to customer");
      onConverted();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Convert to customer"
      description="Create a customer record from this lead. The lead is marked converted and a welcome email is sent."
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
            disabled={!email.trim() || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-emerald-600 px-3 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" />
            {mutation.isPending ? "Converting…" : "Convert"}
          </button>
        </>
      }
    >
      <label className={labelClass}>Email (required)</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="customer@example.com"
        className={`${inputClass} mb-4`}
      />
      <label className={labelClass}>Phone</label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={`${inputClass} mb-4`}
      />
      <label className={labelClass}>GSTIN (optional)</label>
      <input
        value={gstNumber}
        onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
        placeholder="22AAAAA0000A1Z5"
        className={inputClass}
      />
    </Modal>
  );
}
