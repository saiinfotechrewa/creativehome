"use client";

import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Plug,
  Info,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { labelClass } from "@/components/admin/ui/form";
import {
  fetchIntegration,
  updateIntegration,
  testIntegration,
  integrationKeys,
  type IntegrationKey,
  type IntegrationSummary,
  type TestResult,
} from "@/lib/admin/integrations-client";

// ─────────────────────────── Form primitives ────────────────────────────────

const baseInput =
  "h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50";

/** Labelled text/number input bound to a config field. */
export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
  mono,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: "text" | "number";
  mono?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(baseInput, mono && "font-mono text-xs")}
      />
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/**
 * Masked secret input. Starts read-only showing the server's `••••1234`
 * preview; "Change" unlocks it for entry. Submitting an untouched field sends
 * the mask back, so the stored secret is preserved.
 */
export function SecretField({
  label,
  value,
  onChange,
  masked,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  /** Whether the current value is still the server's masked placeholder. */
  masked: boolean;
  placeholder?: string;
  hint?: string;
}) {
  const [reveal, setReveal] = useState(false);
  const editing = !masked;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className={cn(labelClass, "mb-0")}>{label}</label>
        <div className="flex items-center gap-2">
          {editing && (
            <button
              type="button"
              onClick={() => setReveal((r) => !r)}
              className="text-muted-foreground transition hover:text-foreground"
              aria-label={reveal ? "Hide" : "Show"}
            >
              {reveal ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type={editing && reveal ? "text" : "password"}
          value={value}
          readOnly={masked}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(baseInput, "font-mono text-xs", masked && "text-muted-foreground")}
        />
        {masked ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="h-10 shrink-0 rounded-md border border-border px-3 text-xs font-medium text-foreground transition hover:bg-accent"
          >
            Change
          </button>
        ) : (
          value.length > 0 && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="h-10 shrink-0 rounded-md border border-border px-3 text-xs font-medium text-muted-foreground transition hover:bg-accent"
            >
              Clear
            </button>
          )
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={baseInput}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Read-only field with a copy-to-clipboard button (e.g. a webhook URL). */
export function CopyField({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  }
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex gap-2">
        <input
          readOnly
          value={value}
          onFocus={(e) => e.currentTarget.select()}
          className={cn(baseInput, "font-mono text-xs text-muted-foreground")}
        />
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium text-foreground transition hover:bg-accent"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Accessible on/off switch. */
export function Toggle({
  checked,
  onChange,
  disabled,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
}) {
  const sw = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition disabled:opacity-50",
        checked ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition",
          checked ? "translate-x-4" : "translate-x-0.5",
        )}
      />
    </button>
  );

  if (!label) return sw;

  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span>
        <span className="block text-sm font-medium text-foreground">
          {label}
        </span>
        {description && (
          <span className="block text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      {sw}
    </label>
  );
}

/** Banner marking a section as front-end-only (no backend persistence yet). */
export function StubNotice({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/** Titled card used to group fields on a config page. */
export function ConfigCard({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("rounded-xl border border-border bg-card p-5", className)}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          )}
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

// ─────────────────────────── Test Connection ────────────────────────────────

export function TestConnectionButton({
  integrationKey,
  className,
}: {
  integrationKey: IntegrationKey;
  className?: string;
}) {
  const [result, setResult] = useState<TestResult | null>(null);
  const mutation = useMutation({
    mutationFn: () => testIntegration(integrationKey),
    onSuccess: (r) => {
      setResult(r);
      if (r.success) toast.success(r.message);
      else toast.error(r.message);
    },
  });

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <button
        type="button"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium text-foreground transition hover:bg-accent disabled:opacity-50"
      >
        {mutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plug className="h-4 w-4" />
        )}
        Test connection
      </button>
      {result && (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-sm",
            result.success ? "text-emerald-400" : "text-rose-400",
          )}
        >
          {result.success ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {result.message}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────── useIntegration hook ────────────────────────────

export interface IntegrationFormState {
  /** Live integration record from the server (config has masked secrets). */
  data: IntegrationSummary | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  /** Persist `{ isActive, config }`. */
  save: (body: { isActive?: boolean; config: Record<string, unknown> }) => void;
  saving: boolean;
}

/** Loads a single integration and exposes a save mutation with cache sync. */
export function useIntegration(key: IntegrationKey): IntegrationFormState {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: integrationKeys.detail(key),
    queryFn: () => fetchIntegration(key),
  });

  const mutation = useMutation({
    mutationFn: (body: {
      isActive?: boolean;
      config: Record<string, unknown>;
    }) => updateIntegration(key, body),
    onSuccess: (updated) => {
      qc.setQueryData(integrationKeys.detail(key), updated);
      qc.invalidateQueries({ queryKey: integrationKeys.list });
      toast.success("Saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return {
    data: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: (query.error as Error) ?? null,
    save: mutation.mutate,
    saving: mutation.isPending,
  };
}

/** Loading / error gate shared by every config page. */
export function ConfigGate({
  state,
  children,
}: {
  state: IntegrationFormState;
  children: ReactNode;
}) {
  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading configuration…
      </div>
    );
  }
  if (state.isError) {
    return (
      <div className="py-24 text-center text-sm text-rose-400">
        {state.error?.message ?? "Failed to load"}
      </div>
    );
  }
  return <>{children}</>;
}
