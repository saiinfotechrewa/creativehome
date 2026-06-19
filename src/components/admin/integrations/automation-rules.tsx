"use client";

import { useState } from "react";

import { ConfigCard, Toggle, StubNotice } from "@/components/admin/integrations/integration-kit";

export interface AutomationRule {
  id: string;
  label: string;
  description: string;
  /** Default enabled state for the front-end preview. */
  defaultOn?: boolean;
}

/** WhatsApp automation rules. */
export const WHATSAPP_RULES: AutomationRule[] = [
  {
    id: "new_lead_reply",
    label: "New lead auto-reply",
    description: "Send an instant acknowledgement when a lead comes in.",
    defaultOn: true,
  },
  {
    id: "consultation_confirmation",
    label: "Consultation confirmation",
    description: "Confirm date & time when a consultation is booked.",
    defaultOn: true,
  },
  {
    id: "order_credentials",
    label: "Order credentials delivery",
    description: "Send product login credentials after a successful order.",
  },
  {
    id: "payment_failed_retry",
    label: "Payment failed retry",
    description: "Nudge the customer to retry a failed payment.",
  },
  {
    id: "subscription_expiring",
    label: "Subscription expiring",
    description: "Remind customers before a subscription lapses.",
  },
  {
    id: "no_response_follow_up",
    label: "No-response follow-up",
    description: "Follow up with leads who haven't replied in 48 hours.",
  },
];

/** Email automation rules. */
export const EMAIL_RULES: AutomationRule[] = [
  {
    id: "welcome",
    label: "Welcome email",
    description: "Greet a customer the first time they convert.",
    defaultOn: true,
  },
  {
    id: "lead_notification",
    label: "Lead notification",
    description: "Alert the sales team when a new lead arrives.",
    defaultOn: true,
  },
  {
    id: "order_confirmation",
    label: "Order confirmation",
    description: "Email a receipt after a successful purchase.",
    defaultOn: true,
  },
  {
    id: "invoice",
    label: "Invoice delivery",
    description: "Attach the PDF invoice once payment is captured.",
  },
  {
    id: "password_reset",
    label: "Password reset",
    description: "Send reset links on request.",
    defaultOn: true,
  },
];

/**
 * Automation-rule toggles. Front-end preview only — wiring these to the
 * messaging engine ships with the automation backend.
 */
export function AutomationRules({
  title,
  rules,
}: {
  title: string;
  rules: AutomationRule[];
}) {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(rules.map((r) => [r.id, !!r.defaultOn])),
  );

  return (
    <ConfigCard title={title} description="Trigger messages automatically.">
      <StubNotice>
        Front-end preview — automation triggers ship with the messaging backend
        and are not yet persisted.
      </StubNotice>
      <div className="divide-y divide-border">
        {rules.map((rule) => (
          <div key={rule.id} className="py-3 first:pt-0 last:pb-0">
            <Toggle
              label={rule.label}
              description={rule.description}
              checked={!!state[rule.id]}
              onChange={(v) => setState((s) => ({ ...s, [rule.id]: v }))}
            />
          </div>
        ))}
      </div>
    </ConfigCard>
  );
}
