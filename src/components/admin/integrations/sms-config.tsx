"use client";

import {
  useIntegration,
  ConfigGate,
  ConfigCard,
  TextField,
  SecretField,
  SelectField,
  TestConnectionButton,
} from "@/components/admin/integrations/integration-kit";
import {
  ConfigHeader,
  SaveBar,
  ConfigLayout,
  useConfigDraft,
} from "@/components/admin/integrations/config-shell";
import {
  TemplatesSection,
} from "@/components/admin/integrations/message-templates";
import { cfgStr, isMasked } from "@/lib/admin/integrations-client";
import type { MessageTemplate } from "@/components/admin/integrations/message-templates";

const PROVIDERS = [
  { value: "twilio", label: "Twilio" },
  { value: "msg91", label: "MSG91" },
  { value: "textlocal", label: "Textlocal" },
];

const SMS_TEMPLATES: MessageTemplate[] = [
  {
    id: "otp",
    name: "OTP",
    body: "Your CreativeDox OTP is {{otp}}. Valid for 10 minutes.",
    status: "active",
  },
  {
    id: "order",
    name: "Order placed",
    body: "Hi {{name}}, your order {{orderNumber}} is confirmed.",
    status: "active",
  },
];

export function SmsConfig() {
  const state = useIntegration("sms");
  return (
    <ConfigLayout>
      <ConfigGate state={state}>
        <SmsInner key={state.data?.updatedAt ?? "new"} state={state} />
      </ConfigGate>
    </ConfigLayout>
  );
}

function SmsInner({ state }: { state: ReturnType<typeof useIntegration> }) {
  const { config, isActive, setField, setIsActive, dirty } = useConfigDraft(
    state.data,
  );
  const provider = cfgStr(config, "provider") || "twilio";

  return (
    <>
      <ConfigHeader
        entryId="sms"
        isActive={isActive}
        onToggleActive={setIsActive}
        configured={state.data?.configured}
      />

      <div className="space-y-6">
        <ConfigCard title="Provider" description="Transactional SMS gateway.">
          <div className="space-y-4">
            <SelectField
              label="Provider"
              value={provider}
              onChange={(v) => setField("provider", v)}
              options={PROVIDERS}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label={provider === "twilio" ? "Account SID" : "API key / user"}
                value={cfgStr(config, "accountSid")}
                onChange={(v) => setField("accountSid", v)}
                mono
              />
              <SecretField
                label={provider === "twilio" ? "Auth Token" : "API secret"}
                value={cfgStr(config, "authToken")}
                masked={isMasked(config.authToken)}
                onChange={(v) => setField("authToken", v)}
              />
              <TextField
                label="From number"
                value={cfgStr(config, "fromNumber")}
                onChange={(v) => setField("fromNumber", v)}
                placeholder="+14155238886"
                mono
              />
              <TextField
                label="Sender ID"
                value={cfgStr(config, "senderId")}
                onChange={(v) => setField("senderId", v)}
                placeholder="CRTVDX"
                hint="6-char alphanumeric sender (where supported)."
              />
            </div>
            <TestConnectionButton integrationKey="sms" />
            <p className="text-xs text-muted-foreground">
              Test verifies Twilio credentials. Other gateways check with the
              messaging backend.
            </p>
          </div>
        </ConfigCard>

        <TemplatesSection kind="whatsapp" initial={SMS_TEMPLATES} />
      </div>

      <SaveBar
        onSave={() => state.save({ isActive, config })}
        saving={state.saving}
        dirty={dirty}
      />
    </>
  );
}
