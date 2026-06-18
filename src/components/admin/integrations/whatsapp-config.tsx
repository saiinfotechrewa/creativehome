"use client";

import {
  useIntegration,
  ConfigGate,
  ConfigCard,
  TextField,
  SecretField,
  SelectField,
  CopyField,
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
  WHATSAPP_TEMPLATES,
} from "@/components/admin/integrations/message-templates";
import {
  AutomationRules,
  WHATSAPP_RULES,
} from "@/components/admin/integrations/automation-rules";
import { MessageLogs } from "@/components/admin/integrations/message-logs";
import { cfgStr, isMasked } from "@/lib/admin/integrations-client";

const PROVIDERS = [
  { value: "twilio", label: "Twilio" },
  { value: "meta", label: "Meta (WhatsApp Cloud API)" },
  { value: "wati", label: "Wati" },
];

export function WhatsappConfig() {
  const state = useIntegration("whatsapp");
  return (
    <ConfigLayout>
      <ConfigGate state={state}>
        <WhatsappInner key={state.data?.updatedAt ?? "new"} state={state} />
      </ConfigGate>
    </ConfigLayout>
  );
}

function WhatsappInner({
  state,
}: {
  state: ReturnType<typeof useIntegration>;
}) {
  const { config, isActive, setField, setIsActive, dirty } = useConfigDraft(
    state.data,
  );
  const provider = cfgStr(config, "provider") || "twilio";

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const webhookUrl = `${origin}/api/webhooks/whatsapp`;

  return (
    <>
      <ConfigHeader
        entryId="whatsapp"
        isActive={isActive}
        onToggleActive={setIsActive}
        configured={state.data?.configured}
      />

      <div className="space-y-6">
        <ConfigCard title="Provider" description="Choose your WhatsApp transport.">
          <div className="space-y-4">
            <SelectField
              label="Provider"
              value={provider}
              onChange={(v) => setField("provider", v)}
              options={PROVIDERS}
            />

            {provider === "twilio" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Account SID"
                  value={cfgStr(config, "accountSid")}
                  onChange={(v) => setField("accountSid", v)}
                  placeholder="ACxxxxxxxx"
                  mono
                />
                <SecretField
                  label="Auth Token"
                  value={cfgStr(config, "authToken")}
                  masked={isMasked(config.authToken)}
                  onChange={(v) => setField("authToken", v)}
                />
                <TextField
                  label="From number"
                  value={cfgStr(config, "fromNumber")}
                  onChange={(v) => setField("fromNumber", v)}
                  placeholder="whatsapp:+14155238886"
                  mono
                />
                <TextField
                  label="Messaging Service SID"
                  value={cfgStr(config, "messagingServiceSid")}
                  onChange={(v) => setField("messagingServiceSid", v)}
                  placeholder="MGxxxxxxxx (optional)"
                  mono
                />
              </div>
            )}

            {provider === "meta" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Phone number ID"
                  value={cfgStr(config, "phoneNumberId")}
                  onChange={(v) => setField("phoneNumberId", v)}
                  mono
                />
                <TextField
                  label="Business account ID"
                  value={cfgStr(config, "businessAccountId")}
                  onChange={(v) => setField("businessAccountId", v)}
                  mono
                />
                <SecretField
                  label="Access token"
                  value={cfgStr(config, "token")}
                  masked={isMasked(config.token)}
                  onChange={(v) => setField("token", v)}
                />
                <TextField
                  label="API URL"
                  value={cfgStr(config, "apiUrl")}
                  onChange={(v) => setField("apiUrl", v)}
                  placeholder="https://graph.facebook.com/v19.0 (optional)"
                  mono
                />
              </div>
            )}

            {provider === "wati" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="API endpoint"
                  value={cfgStr(config, "apiUrl")}
                  onChange={(v) => setField("apiUrl", v)}
                  placeholder="https://live-server-xxxx.wati.io"
                  mono
                />
                <SecretField
                  label="Access token"
                  value={cfgStr(config, "token")}
                  masked={isMasked(config.token)}
                  onChange={(v) => setField("token", v)}
                />
              </div>
            )}
          </div>
        </ConfigCard>

        <ConfigCard
          title="Inbound webhook"
          description="Point your provider's inbound webhook here."
        >
          <CopyField
            label="Webhook URL"
            value={webhookUrl}
            hint="The inbound message handler ships with the messaging backend."
          />
          <div className="mt-4">
            <TestConnectionButton integrationKey="whatsapp" />
            <p className="mt-2 text-xs text-muted-foreground">
              Test verifies Twilio credentials. Meta / Wati checks ship with the
              messaging backend.
            </p>
          </div>
        </ConfigCard>

        <TemplatesSection kind="whatsapp" initial={WHATSAPP_TEMPLATES} />
        <AutomationRules title="Automation rules" rules={WHATSAPP_RULES} />
        <MessageLogs />
      </div>

      <SaveBar
        onSave={() => state.save({ isActive, config })}
        saving={state.saving}
        dirty={dirty}
      />
    </>
  );
}
