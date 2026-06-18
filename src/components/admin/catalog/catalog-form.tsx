"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Field, inputClass, textareaClass, labelClass } from "@/components/admin/ui/form";
import { IconPicker } from "@/components/admin/ui/icon-picker";
import { ColorPicker } from "@/components/admin/ui/color-picker";
import {
  type CatalogRow,
  type FieldDef,
  type ResourceMeta,
  CONTENT_STATUSES,
  type ContentStatus,
} from "@/lib/admin/catalog-admin-client";

/** Slugify a name for the create form (lowercase, dash-separated). */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function prettyJson(value: unknown, type: FieldDef["type"]): string {
  if (value == null) return type === "json-array" || type === "string-list" ? "[]" : "{}";
  if (type === "string-list") {
    return Array.isArray(value) ? (value as string[]).join("\n") : "";
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

interface CatalogFormProps {
  meta: ResourceMeta;
  /** Existing record when editing; omit for create. */
  item?: CatalogRow | null;
  saving: boolean;
  onSubmit: (payload: Record<string, unknown>) => void;
  onCancel: () => void;
}

export function CatalogForm({ meta, item, saving, onSubmit, onCancel }: CatalogFormProps) {
  const isEdit = Boolean(item);

  const [name, setName] = useState(String(item?.name ?? ""));
  const [slug, setSlug] = useState(String(item?.slug ?? ""));
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [status, setStatus] = useState<ContentStatus>(
    (item?.status as ContentStatus) ?? "DRAFT",
  );
  const [order, setOrder] = useState<number>(Number(item?.order ?? 0));
  const [icon, setIcon] = useState(String(item?.icon ?? ""));
  const [color, setColor] = useState(String(item?.color ?? ""));

  // Simple + advanced fields are tracked as raw string editor values.
  const allFields = useMemo(
    () => [...meta.simpleFields, ...meta.advancedFields],
    [meta],
  );
  const [values, setValues] = useState<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    for (const f of allFields) {
      if (f.type === "text" || f.type === "textarea") {
        out[f.key] = String(item?.[f.key] ?? "");
      } else {
        out[f.key] = prettyJson(item?.[f.key], f.type);
      }
    }
    return out;
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (key: string, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  function buildPayload(): Record<string, unknown> | null {
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) nextErrors.name = "Name must be at least 2 characters";
    const finalSlug = slug || slugify(name);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(finalSlug)) {
      nextErrors.slug = "Use lowercase letters, numbers and dashes";
    }

    const payload: Record<string, unknown> = {
      name: name.trim(),
      slug: finalSlug,
      status,
      order: Number.isFinite(order) ? order : 0,
    };
    if (icon) payload.icon = icon;
    if (color) payload.color = color;

    for (const f of allFields) {
      const raw = values[f.key] ?? "";
      if (f.type === "text" || f.type === "textarea") {
        if (raw.trim()) payload[f.key] = raw.trim();
        continue;
      }
      if (f.type === "string-list") {
        const list = raw
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        payload[f.key] = list;
        continue;
      }
      // JSON object / array
      const trimmed = raw.trim();
      if (!trimmed) {
        payload[f.key] = f.type === "json-array" ? [] : {};
        continue;
      }
      try {
        const parsed = JSON.parse(trimmed);
        const isArr = Array.isArray(parsed);
        if (f.type === "json-array" && !isArr) {
          nextErrors[f.key] = "Expected a JSON array ([…])";
        } else if (f.type === "json-object" && (isArr || typeof parsed !== "object")) {
          nextErrors[f.key] = "Expected a JSON object ({…})";
        } else {
          payload[f.key] = parsed;
        }
      } catch {
        nextErrors[f.key] = "Invalid JSON";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0 ? payload : null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = buildPayload();
    if (payload) onSubmit(payload);
  }

  const advancedErrorCount = meta.advancedFields.filter((f) => errors[f.key]).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Common fields */}
      <Field label="Name" error={errors.name}>
        <input
          className={inputClass}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          placeholder={`${meta.singular} name`}
          autoFocus
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Slug" error={errors.slug} hint={isEdit ? "Changing the slug changes its URL" : undefined}>
          <input
            className={inputClass}
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="auto-from-name"
          />
        </Field>
        <Field label="Display order">
          <input
            type="number"
            className={inputClass}
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
        </Field>
      </div>

      <Field label="Status">
        <select
          className={inputClass}
          value={status}
          onChange={(e) => setStatus(e.target.value as ContentStatus)}
        >
          {CONTENT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Icon</label>
          <IconPicker value={icon} onChange={(v) => setIcon(v)} />
        </div>
        <ColorPicker label="Accent colour" value={color} onChange={(v) => setColor(v)} />
      </div>

      {/* Simple resource-specific fields */}
      {meta.simpleFields.map((f) => (
        <Field key={f.key} label={f.label} hint={f.hint} error={errors[f.key]}>
          {f.type === "textarea" ? (
            <textarea
              className={textareaClass}
              value={values[f.key] ?? ""}
              onChange={(e) => setValue(f.key, e.target.value)}
            />
          ) : (
            <input
              className={inputClass}
              value={values[f.key] ?? ""}
              onChange={(e) => setValue(f.key, e.target.value)}
            />
          )}
        </Field>
      ))}

      {/* Advanced content (JSON / lists) */}
      {meta.advancedFields.length > 0 && (
        <div className="rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground"
          >
            <span className="flex items-center gap-2">
              {showAdvanced ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              Advanced content
              {advancedErrorCount > 0 && (
                <span className="rounded bg-rose-500/15 px-1.5 py-0.5 text-xs text-rose-400">
                  {advancedErrorCount} error{advancedErrorCount === 1 ? "" : "s"}
                </span>
              )}
            </span>
            <span className="text-xs text-muted-foreground">
              {meta.advancedFields.length} fields
            </span>
          </button>
          {showAdvanced && (
            <div className="space-y-3 border-t border-border px-3 py-3">
              {meta.advancedFields.map((f) => (
                <Field
                  key={f.key}
                  label={f.label}
                  error={errors[f.key]}
                  hint={
                    f.type === "string-list"
                      ? "One item per line"
                      : f.type === "json-array"
                        ? "JSON array"
                        : "JSON object"
                  }
                >
                  <textarea
                    className={cn(textareaClass, "font-mono text-xs")}
                    spellCheck={false}
                    value={values[f.key] ?? ""}
                    onChange={(e) => setValue(f.key, e.target.value)}
                  />
                </Field>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="h-9 rounded-md border border-border px-3 text-sm text-foreground transition hover:bg-accent disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Save changes" : `Create ${meta.singular.toLowerCase()}`}
        </button>
      </div>
    </form>
  );
}
