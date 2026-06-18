"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageCircle, CheckCircle2, AlertTriangle } from "lucide-react";

import { Modal } from "@/components/admin/ui/modal";
import { inputClass, labelClass } from "@/components/admin/ui/form";
import {
  sendCommunication,
  WHATSAPP_TEMPLATES,
  renderTemplate,
  type LeadDetail,
  type CommunicationResult,
} from "@/lib/admin/leads-client";

/**
 * Compose + send a WhatsApp message to a lead. Pick a template, fill its
 * variables (name is pre-filled from the lead), preview the resolved text, then
 * send. Shows the delivery status returned by the channel.
 */
export function WhatsAppComposer({
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
  const [templateId, setTemplateId] = useState(WHATSAPP_TEMPLATES[0]!.id);
  const [vars, setVars] = useState<Record<string, string>>({ name: lead.name });
  const [freeText, setFreeText] = useState("");
  const [useFreeText, setUseFreeText] = useState(false);

  const template = useMemo(
    () => WHATSAPP_TEMPLATES.find((t) => t.id === templateId)!,
    [templateId],
  );

  const message = useFreeText
    ? freeText
    : renderTemplate(template.body, { name: lead.name, ...vars });

  const destination = lead.whatsapp ?? lead.phone;

  const mutation = useMutation({
    mutationFn: () =>
      sendCommunication(lead.id, { channel: "whatsapp", message }),
    onSuccess: (result) => {
      if (result.delivered) toast.success("WhatsApp message sent");
      else toast.warning("Logged, but the channel did not confirm delivery");
      onSent(result);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Send WhatsApp"
      description={destination ? `To ${destination}` : undefined}
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
            disabled={!message.trim() || !destination || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-emerald-600 px-3 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
          >
            <MessageCircle className="h-4 w-4" />
            {mutation.isPending ? "Sending…" : "Send"}
          </button>
        </>
      }
    >
      {!destination && (
        <p className="mb-3 flex items-center gap-1.5 rounded-md bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
          <AlertTriangle className="h-3.5 w-3.5" /> This lead has no WhatsApp or
          phone number.
        </p>
      )}

      {/* Template selector */}
      <label className={labelClass}>Template</label>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {WHATSAPP_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTemplateId(t.id);
              setUseFreeText(false);
            }}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
              !useFreeText && templateId === t.id
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setUseFreeText(true)}
          className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
            useFreeText
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
              : "border-border text-muted-foreground hover:bg-accent"
          }`}
        >
          Custom
        </button>
      </div>

      {useFreeText ? (
        <>
          <label className={labelClass}>Message</label>
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            rows={5}
            placeholder="Type your message…"
            className="min-h-[120px] w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </>
      ) : (
        <>
          {/* Editable variables */}
          {template.variables.length > 0 && (
            <div className="mb-4 grid gap-2 sm:grid-cols-2">
              {template.variables.map((key) => (
                <div key={key}>
                  <label className="mb-1 block text-xs capitalize text-muted-foreground">
                    {key}
                  </label>
                  <input
                    value={key === "name" ? (vars.name ?? lead.name) : (vars[key] ?? "")}
                    onChange={(e) =>
                      setVars((v) => ({ ...v, [key]: e.target.value }))
                    }
                    placeholder={`{{${key}}}`}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Preview */}
          <label className={labelClass}>Preview</label>
          <div className="whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 text-sm text-foreground">
            {message}
          </div>
        </>
      )}

      {mutation.isSuccess && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {mutation.data.delivered ? "Delivered" : "Logged (delivery unconfirmed)"}
        </p>
      )}
    </Modal>
  );
}
