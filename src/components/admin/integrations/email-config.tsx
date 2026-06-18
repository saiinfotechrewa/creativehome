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
  EMAIL_TEMPLATES,
} from "@/components/admin/integrations/message-templates";
import {
  AutomationRules,
  EMAIL_RULES,
} from "@/components/admin/integrations/automation-rules";
import { cfgStr, isMasked } from "@/lib/admin/integrations-client";

const PROVIDERS = [
  { value: "sendgrid", label: "SendGrid" },
  { value: "smtp", label: "SMTP" },
  { value: "ses", label: "Amazon SES" },
];

export function EmailConfig() {
  const state = useIntegration("email");
  return (
    <ConfigLayout>
      <ConfigGate state={state}>
        <EmailInner key={state.data?.updatedAt ?? "new"} state={state} />
      </ConfigGate>
    </ConfigLayout>
  );
}

function EmailInner({ state }: { state: ReturnType<typeof useIntegration> }) {
  const { config, isActive, setField, setIsActive, dirty } = useConfigDraft(
    state.data,
  );
  const provider = cfgStr(config, "provider") || "sendgrid";

  return (
    <>
      <ConfigHeader
        entryId="email"
        isActive={isActive}
        onToggleActive={setIsActive}
        configured={state.data?.configured}
      />

      <div className="space-y-6">
        <ConfigCard title="Provider" description="How transactional email is sent.">
          <div className="space-y-4">
            <SelectField
              label="Provider"
              value={provider}
              onChange={(v) => setField("provider", v)}
              options={PROVIDERS}
            />

            {provider === "sendgrid" && (
              <SecretField
                label="API key"
                value={cfgStr(config, "apiKey")}
                masked={isMasked(config.apiKey)}
                onChange={(v) => setField("apiKey", v)}
                hint="Create a key with Mail Send permission."
              />
            )}

            {provider === "smtp" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Host"
                  value={cfgStr(config, "host")}
                  onChange={(v) => setField("host", v)}
                  placeholder="smtp.example.com"
                  mono
                />
                <TextField
                  label="Port"
                  type="number"
                  value={cfgStr(config, "port")}
                  onChange={(v) => setField("port", v)}
                  placeholder="587"
                />
                <TextField
                  label="Username"
                  value={cfgStr(config, "user")}
                  onChange={(v) => setField("user", v)}
                  mono
                />
                <SecretField
                  label="Password"
                  value={cfgStr(config, "pass")}
                  masked={isMasked(config.pass)}
                  onChange={(v) => setField("pass", v)}
                />
              </div>
            )}

            {provider === "ses" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Region"
                  value={cfgStr(config, "region")}
                  onChange={(v) => setField("region", v)}
                  placeholder="ap-south-1"
                  mono
                />
                <TextField
                  label="Access key ID"
                  value={cfgStr(config, "accessKeyId")}
                  onChange={(v) => setField("accessKeyId", v)}
                  mono
                />
                <SecretField
                  label="Secret access key"
                  value={cfgStr(config, "secretAccessKey")}
                  masked={isMasked(config.secretAccessKey)}
                  onChange={(v) => setField("secretAccessKey", v)}
                />
              </div>
            )}
          </div>
        </ConfigCard>

        <ConfigCard title="Sender" description="The default From identity.">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="From email"
              value={cfgStr(config, "fromEmail")}
              onChange={(v) => setField("fromEmail", v)}
              placeholder="hello@creativedox.com"
            />
            <TextField
              label="From name"
              value={cfgStr(config, "fromName")}
              onChange={(v) => setField("fromName", v)}
              placeholder="CreativeDox"
            />
          </div>
          <div className="mt-4">
            <TestConnectionButton integrationKey="email" />
            <p className="mt-2 text-xs text-muted-foreground">
              Verifies SendGrid or SMTP credentials. SES verification ships with
              the email backend.
            </p>
          </div>
        </ConfigCard>

        <TemplatesSection kind="email" initial={EMAIL_TEMPLATES} />
        <AutomationRules title="Automation rules" rules={EMAIL_RULES} />
      </div>

      <SaveBar
        onSave={() => state.save({ isActive, config })}
        saving={state.saving}
        dirty={dirty}
      />
    </>
  );
}
