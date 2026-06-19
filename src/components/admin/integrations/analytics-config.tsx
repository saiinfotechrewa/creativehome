"use client";

import type { ReactNode } from "react";

import {
  useIntegration,
  ConfigGate,
  ConfigCard,
  Toggle,
} from "@/components/admin/integrations/integration-kit";
import {
  ConfigHeader,
  SaveBar,
  ConfigLayout,
  useConfigDraft,
} from "@/components/admin/integrations/config-shell";
import { labelClass } from "@/components/admin/ui/form";
import { cn } from "@/lib/utils";
import { cfgStr, cfgBool } from "@/lib/admin/integrations-client";

interface Tool {
  id: string;
  label: string;
  idField: string;
  enabledField: string;
  placeholder: string;
  hint: string;
}

const TOOLS: Tool[] = [
  {
    id: "ga4",
    label: "Google Analytics 4",
    idField: "measurementId",
    enabledField: "ga4Enabled",
    placeholder: "G-XXXXXXXXXX",
    hint: "Measurement ID from your GA4 data stream.",
  },
  {
    id: "gtm",
    label: "Google Tag Manager",
    idField: "gtmId",
    enabledField: "gtmEnabled",
    placeholder: "GTM-XXXXXXX",
    hint: "Container ID.",
  },
  {
    id: "pixel",
    label: "Facebook Pixel",
    idField: "fbPixelId",
    enabledField: "fbPixelEnabled",
    placeholder: "123456789012345",
    hint: "Pixel ID from Meta Events Manager.",
  },
  {
    id: "hotjar",
    label: "Hotjar",
    idField: "hotjarId",
    enabledField: "hotjarEnabled",
    placeholder: "1234567",
    hint: "Hotjar Site ID.",
  },
  {
    id: "clarity",
    label: "Microsoft Clarity",
    idField: "clarityId",
    enabledField: "clarityEnabled",
    placeholder: "abcdefghij",
    hint: "Clarity project ID.",
  },
];

const baseInput =
  "h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono text-xs";

export function AnalyticsConfig() {
  const state = useIntegration("analytics");
  return (
    <ConfigLayout>
      <ConfigGate state={state}>
        <AnalyticsInner key={state.data?.updatedAt ?? "new"} state={state} />
      </ConfigGate>
    </ConfigLayout>
  );
}

function AnalyticsInner({
  state,
}: {
  state: ReturnType<typeof useIntegration>;
}) {
  const { config, isActive, setField, setIsActive, dirty } = useConfigDraft(
    state.data,
  );

  return (
    <>
      <ConfigHeader
        entryId="analytics"
        isActive={isActive}
        onToggleActive={setIsActive}
        configured={state.data?.configured}
      />

      <div className="space-y-3">
        {TOOLS.map((tool) => {
          const enabled = cfgBool(config, tool.enabledField);
          return (
            <ToolRow
              key={tool.id}
              enabled={enabled}
              label={tool.label}
              toggle={
                <Toggle
                  checked={enabled}
                  onChange={(v) => setField(tool.enabledField, v)}
                />
              }
              body={
                <div className="mt-3">
                  <label className={labelClass}>Tracking ID</label>
                  <input
                    value={cfgStr(config, tool.idField)}
                    onChange={(e) => setField(tool.idField, e.target.value)}
                    placeholder={tool.placeholder}
                    disabled={!enabled}
                    className={cn(baseInput, !enabled && "opacity-50")}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {tool.hint}
                  </p>
                </div>
              }
            />
          );
        })}
      </div>

      <SaveBar
        onSave={() => state.save({ isActive, config })}
        saving={state.saving}
        dirty={dirty}
      />
    </>
  );
}

function ToolRow({
  enabled,
  label,
  toggle,
  body,
}: {
  enabled: boolean;
  label: string;
  toggle: ReactNode;
  body: ReactNode;
}) {
  return (
    <ConfigCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              enabled ? "bg-emerald-400" : "bg-muted-foreground/40",
            )}
          />
          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        </div>
        {toggle}
      </div>
      {body}
    </ConfigCard>
  );
}
