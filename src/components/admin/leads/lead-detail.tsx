"use client";

import { useState } from "react";
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
  Users,
  CalendarClock,
  StickyNote,
  History,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  fetchLead,
  fetchAssignees,
  updateLeadStatus,
  assignLead,
  addLeadNote,
  leadKeys,
  LEAD_STATUSES,
  sourceLabel,
  priorityMeta,
  type LeadActivity,
  type LeadDetail as LeadDetailType,
} from "@/lib/admin/leads-client";
import { LeadStatusBadge } from "@/components/admin/leads/lead-status-badge";

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
      return a.details?.note
        ? `${who} added a note`
        : `${who} created this lead`;
    case "status_change":
      return `${who} moved status ${String(a.details?.from)} → ${String(a.details?.to)}`;
    case "update":
      return a.details?.assignedTo || a.details?.unassigned
        ? `${who} changed the assignee`
        : `${who} updated the lead`;
    default:
      return `${who} · ${a.action}`;
  }
}

const fieldRow = "flex items-start gap-2.5 text-sm";

export function LeadDetail({
  leadId,
  canManage,
}: {
  leadId: string;
  canManage: boolean;
}) {
  const qc = useQueryClient();
  const [noteText, setNoteText] = useState("");

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
    notes?: string;
  };
  const hasConsultation = consultation && Object.keys(consultation).length > 0;
  const notesNewestFirst = [...lead.notes].reverse();

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/leads"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to leads
      </Link>

      <header className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold text-foreground">{lead.name}</h1>
        <LeadStatusBadge status={lead.status} />
        <span className={cn("text-sm font-medium", pr.badge)}>{pr.label} priority</span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {sourceLabel(lead.source)}
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          Received {formatDateTime(lead.createdAt)}
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Contact</h2>
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
                    <span key={p} className="rounded-md bg-muted px-2 py-0.5 text-xs text-foreground">
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
                <p className="whitespace-pre-wrap text-sm text-foreground">{lead.description}</p>
              </div>
            )}

            {hasConsultation && (
              <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-muted/40 p-3 text-sm">
                <CalendarClock className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Requested consultation</p>
                  <p className="text-muted-foreground">
                    {[consultation.date, consultation.time, consultation.mode]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {consultation.notes && (
                    <p className="mt-1 text-muted-foreground">{consultation.notes}</p>
                  )}
                </div>
              </div>
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
                    <p className="whitespace-pre-wrap text-sm text-foreground">{n.text}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {n.byName ?? "Unknown"} · {formatDateTime(n.at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Pipeline</h2>
            <label className="mb-1.5 block text-xs text-muted-foreground">Status</label>
            <select
              disabled={!canManage || statusMutation.isPending}
              value={lead.status}
              onChange={(e) =>
                statusMutation.mutate(e.target.value as LeadDetailType["status"])
              }
              className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <label className="mb-1.5 mt-4 block text-xs text-muted-foreground">
              Assigned to
            </label>
            <select
              disabled={!canManage || assignMutation.isPending}
              value={lead.assignedTo ?? ""}
              onChange={(e) =>
                assignMutation.mutate(e.target.value === "" ? null : e.target.value)
              }
              className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            >
              <option value="">Unassigned</option>
              {assignees?.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>

            {!canManage && (
              <p className="mt-3 text-xs text-muted-foreground">
                You have read-only access to leads.
              </p>
            )}
          </section>

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
    </div>
  );
}
