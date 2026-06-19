"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, AlertTriangle } from "lucide-react";

import { Modal } from "@/components/admin/ui/modal";
import { inputClass, labelClass } from "@/components/admin/ui/form";
import {
  sendCommunication,
  type LeadDetail,
  type CommunicationResult,
} from "@/lib/admin/leads-client";

/**
 * Compose + send an email to a lead. The recipient is fixed to the lead's
 * email; subject and body are free text (the body is sent as preformatted HTML).
 */
export function EmailComposer({
  lead,
  open,
  onClose,
  onSent,
}: {
  lead: LeadDetail;
  open: boolean;
  onClose: () => void;
  onSent: (result: CommunicationResult) => void;
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      sendCommunication(lead.id, {
        channel: "email",
        subject: subject.trim() || undefined,
        message: body,
      }),
    onSuccess: (result) => {
      if (result.delivered) toast.success("Email sent");
      else toast.warning("Logged, but the email service did not confirm send");
      onSent(result);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Send email"
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
            disabled={!body.trim() || !lead.email || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            <Mail className="h-4 w-4" />
            {mutation.isPending ? "Sending…" : "Send"}
          </button>
        </>
      }
    >
      {!lead.email && (
        <p className="mb-3 flex items-center gap-1.5 rounded-md bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
          <AlertTriangle className="h-3.5 w-3.5" /> This lead has no email
          address.
        </p>
      )}

      <label className={labelClass}>To</label>
      <input
        value={lead.email ?? ""}
        readOnly
        className={`${inputClass} mb-4 cursor-not-allowed opacity-70`}
      />

      <label className={labelClass}>Subject</label>
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="A message from CreativeDox"
        className={`${inputClass} mb-4`}
      />

      <label className={labelClass}>Message</label>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={8}
        placeholder="Write your email…"
        className="min-h-[160px] w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </Modal>
  );
}
