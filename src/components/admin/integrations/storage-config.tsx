"use client";

import {
  useIntegration,
  ConfigGate,
  ConfigCard,
  TextField,
  SecretField,
  SelectField,
  Toggle,
  TestConnectionButton,
} from "@/components/admin/integrations/integration-kit";
import {
  ConfigHeader,
  SaveBar,
  ConfigLayout,
  useConfigDraft,
} from "@/components/admin/integrations/config-shell";
import { cfgStr, cfgBool, isMasked } from "@/lib/admin/integrations-client";

const PROVIDERS = [
  { value: "cloudinary", label: "Cloudinary" },
  { value: "s3", label: "Amazon S3" },
];

export function StorageConfig() {
  // The storage integration is keyed `cloudinary` server-side.
  const state = useIntegration("cloudinary");
  return (
    <ConfigLayout>
      <ConfigGate state={state}>
        <StorageInner key={state.data?.updatedAt ?? "new"} state={state} />
      </ConfigGate>
    </ConfigLayout>
  );
}

function StorageInner({
  state,
}: {
  state: ReturnType<typeof useIntegration>;
}) {
  const { config, isActive, setField, setIsActive, dirty } = useConfigDraft(
    state.data,
  );
  const provider = cfgStr(config, "provider") || "cloudinary";

  return (
    <>
      <ConfigHeader
        entryId="cloudinary"
        isActive={isActive}
        onToggleActive={setIsActive}
        configured={state.data?.configured}
      />

      <div className="space-y-6">
        <ConfigCard title="Provider" description="Where uploaded media is stored.">
          <div className="space-y-4">
            <SelectField
              label="Provider"
              value={provider}
              onChange={(v) => setField("provider", v)}
              options={PROVIDERS}
            />

            {provider === "cloudinary" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Cloud name"
                  value={cfgStr(config, "cloudName")}
                  onChange={(v) => setField("cloudName", v)}
                  mono
                />
                <TextField
                  label="API key"
                  value={cfgStr(config, "apiKey")}
                  onChange={(v) => setField("apiKey", v)}
                  mono
                />
                <SecretField
                  label="API secret"
                  value={cfgStr(config, "apiSecret")}
                  masked={isMasked(config.apiSecret)}
                  onChange={(v) => setField("apiSecret", v)}
                />
              </div>
            )}

            {provider === "s3" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Bucket"
                  value={cfgStr(config, "bucket")}
                  onChange={(v) => setField("bucket", v)}
                  mono
                />
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

            <TestConnectionButton integrationKey="cloudinary" />
            {provider === "s3" && (
              <p className="text-xs text-muted-foreground">
                Connection test currently validates Cloudinary credentials; S3
                verification ships with the storage backend.
              </p>
            )}
          </div>
        </ConfigCard>

        <ConfigCard title="Upload settings">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Upload folder"
              value={cfgStr(config, "uploadFolder")}
              onChange={(v) => setField("uploadFolder", v)}
              placeholder="uploads"
            />
            <TextField
              label="Max upload size (MB)"
              type="number"
              value={cfgStr(config, "maxSizeMb")}
              onChange={(v) => setField("maxSizeMb", v)}
              placeholder="10"
            />
          </div>
          <div className="mt-4">
            <Toggle
              label="Auto-optimize images"
              description="Compress and convert to modern formats on upload."
              checked={cfgBool(config, "autoOptimize", true)}
              onChange={(v) => setField("autoOptimize", v)}
            />
          </div>
        </ConfigCard>
      </div>

      <SaveBar
        onSave={() => state.save({ isActive, config })}
        saving={state.saving}
        dirty={dirty}
      />
    </>
  );
}
