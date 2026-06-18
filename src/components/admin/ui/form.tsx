import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Shared, lightly-styled form primitives for the admin panel. Designed to pair
 * with react-hook-form's `register(...)` spread:
 *
 *   <Field label="Company name" error={errors.companyName?.message}>
 *     <input className={inputClass} {...register("companyName")} />
 *   </Field>
 */

export const inputClass =
  "h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50";

export const textareaClass =
  "min-h-[88px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50";

export const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

/** Labelled form-control wrapper with optional hint and error text. */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  );
}

/** A titled card used to group related fields inside a settings tab. */
export function FormSection({
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
    <section className={cn("space-y-4", className)}>
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
