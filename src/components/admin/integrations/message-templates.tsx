"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { inputClass, labelClass, textareaClass } from "@/components/admin/ui/form";
import { Modal } from "@/components/admin/ui/modal";
import { ConfigCard, StubNotice } from "@/components/admin/integrations/integration-kit";

export interface MessageTemplate {
  id: string;
  name: string;
  /** Email only. */
  subject?: string;
  body: string;
  status: "active" | "draft";
}

/** Extract distinct `{{variable}}` names from a template body (+ subject). */
function extractVariables(...parts: (string | undefined)[]): string[] {
  const found = new Set<string>();
  for (const part of parts) {
    if (!part) continue;
    for (const m of part.matchAll(/\{\{(\w+)\}\}/g)) found.add(m[1]!);
  }
  return [...found];
}

/** Substitute `{{var}}` placeholders from a sample-values map for the preview. */
function renderPreview(
  text: string,
  values: Record<string, string>,
): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) =>
    values[k]?.trim() ? values[k] : `{{${k}}}`,
  );
}

export const WHATSAPP_TEMPLATES: MessageTemplate[] = [
  {
    id: "welcome",
    name: "Lead welcome",
    body:
      "Hi {{name}}, thanks for reaching out to CreativeDox! How can we help you today?",
    status: "active",
  },
  {
    id: "consultation",
    name: "Consultation confirmed",
    body:
      "Hi {{name}}, your consultation is confirmed for {{date}} at {{time}}. See you then!",
    status: "active",
  },
  {
    id: "credentials",
    name: "Order credentials",
    body:
      "Hi {{name}}, your {{product}} account is ready. Login: {{loginUrl}}",
    status: "draft",
  },
];

export const EMAIL_TEMPLATES: MessageTemplate[] = [
  {
    id: "welcome",
    name: "Welcome",
    subject: "Welcome to CreativeDox, {{name}}!",
    body: "Hi {{name}},\n\nWelcome aboard! We're thrilled to have {{company}} with us.",
    status: "active",
  },
  {
    id: "lead_notification",
    name: "Lead Notification",
    subject: "New lead: {{name}}",
    body: "A new lead came in from {{source}}.\n\nName: {{name}}\nEmail: {{email}}",
    status: "active",
  },
  {
    id: "order_confirmation",
    name: "Order Confirmation",
    subject: "Your order {{orderNumber}} is confirmed",
    body: "Hi {{name}},\n\nThanks for your purchase of {{product}} ({{amount}}).",
    status: "active",
  },
  {
    id: "invoice",
    name: "Invoice",
    subject: "Invoice {{orderNumber}}",
    body: "Hi {{name}},\n\nPlease find invoice {{orderNumber}} attached.",
    status: "draft",
  },
  {
    id: "password_reset",
    name: "Password Reset",
    subject: "Reset your password",
    body: "Hi {{name}},\n\nReset your password using this link: {{resetUrl}}",
    status: "active",
  },
];

export function TemplatesSection({
  kind,
  initial,
}: {
  kind: "whatsapp" | "email";
  initial: MessageTemplate[];
}) {
  const [templates, setTemplates] = useState<MessageTemplate[]>(initial);
  const [editing, setEditing] = useState<MessageTemplate | null>(null);
  const [open, setOpen] = useState(false);

  function startAdd() {
    setEditing(null);
    setOpen(true);
  }
  function startEdit(t: MessageTemplate) {
    setEditing(t);
    setOpen(true);
  }
  function handleSave(t: MessageTemplate) {
    setTemplates((prev) => {
      const exists = prev.some((p) => p.id === t.id);
      return exists ? prev.map((p) => (p.id === t.id ? t : p)) : [...prev, t];
    });
    setOpen(false);
  }

  return (
    <ConfigCard
      title="Message templates"
      description="Reusable messages with {{variable}} placeholders."
    >
      <StubNotice>
        Front-end preview — templates are not yet saved to the server.
      </StubNotice>

      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={startAdd}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium text-foreground transition hover:bg-accent"
        >
          <Plus className="h-4 w-4" /> New template
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Preview</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {templates.map((t) => (
              <tr key={t.id}>
                <td className="px-3 py-2 font-medium text-foreground">
                  {t.name}
                </td>
                <td className="max-w-[18rem] truncate px-3 py-2 text-muted-foreground">
                  {t.subject ? `${t.subject} — ` : ""}
                  {t.body}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      t.status === "active"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-amber-500/15 text-amber-400",
                    )}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => startEdit(t)}
                    aria-label="Edit template"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground transition hover:bg-accent"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TemplateEditor
        kind={kind}
        open={open}
        editing={editing}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </ConfigCard>
  );
}

function TemplateEditor({
  kind,
  open,
  editing,
  onClose,
  onSave,
}: {
  kind: "whatsapp" | "email";
  open: boolean;
  editing: MessageTemplate | null;
  onClose: () => void;
  onSave: (t: MessageTemplate) => void;
}) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<MessageTemplate["status"]>("draft");

  // Re-seed when the modal opens.
  useEffect(() => {
    if (!open) return;
    setName(editing?.name ?? "");
    setSubject(editing?.subject ?? "");
    setBody(editing?.body ?? "");
    setStatus(editing?.status ?? "draft");
  }, [open, editing]);

  const variables = extractVariables(subject, body);
  const sample = Object.fromEntries(
    variables.map((v) => [v, `<${v}>`]),
  ) as Record<string, string>;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit template" : "New template"}
      className="max-w-2xl"
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
            disabled={!name.trim() || !body.trim()}
            onClick={() =>
              onSave({
                id: editing?.id ?? `tpl_${Date.now()}`,
                name: name.trim(),
                subject: kind === "email" ? subject.trim() : undefined,
                body,
                status,
              })
            }
            className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            Save template
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

        {kind === "email" && (
          <div>
            <label className={labelClass}>Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Use {{variables}} here too"
              className={inputClass}
            />
          </div>
        )}

        <div>
          <label className={labelClass}>
            {kind === "email" ? "Body (rich text / HTML)" : "Message"}
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={kind === "email" ? 8 : 4}
            placeholder="Hi {{name}}, …"
            className={cn(textareaClass, "min-h-[120px] font-mono text-xs")}
          />
        </div>

        <div>
          <label className={labelClass}>Variables</label>
          {variables.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Add <code>{"{{placeholders}}"}</code> to your message to create
              variables.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {variables.map((v) => (
                <span
                  key={v}
                  className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
                >
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className={labelClass}>Preview</label>
          <div className="rounded-md border border-border bg-muted/30 p-3 text-sm">
            {kind === "email" && subject && (
              <p className="mb-1 font-medium text-foreground">
                {renderPreview(subject, sample)}
              </p>
            )}
            <p className="whitespace-pre-wrap text-muted-foreground">
              {renderPreview(body, sample) || "Nothing to preview yet."}
            </p>
          </div>
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as MessageTemplate["status"])
            }
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}
