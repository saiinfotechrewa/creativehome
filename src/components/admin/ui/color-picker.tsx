"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { labelClass } from "@/components/admin/ui/form";

/**
 * Curated accent palette. `value` is the Tailwind text-colour class stored in
 * the section content (e.g. `text-sky-400`) — the same convention the public
 * cards use; `hex` only drives the swatch preview in this picker.
 */
export const COLOR_PRESETS: { name: string; value: string; hex: string }[] = [
  { name: "Sky", value: "text-sky-400", hex: "#38bdf8" },
  { name: "Blue", value: "text-blue-400", hex: "#60a5fa" },
  { name: "Indigo", value: "text-indigo-400", hex: "#818cf8" },
  { name: "Violet", value: "text-violet-400", hex: "#a78bfa" },
  { name: "Fuchsia", value: "text-fuchsia-400", hex: "#e879f9" },
  { name: "Rose", value: "text-rose-400", hex: "#fb7185" },
  { name: "Orange", value: "text-orange-400", hex: "#fb923c" },
  { name: "Amber", value: "text-amber-400", hex: "#fbbf24" },
  { name: "Emerald", value: "text-emerald-400", hex: "#34d399" },
  { name: "Green", value: "text-green-400", hex: "#4ade80" },
  { name: "Teal", value: "text-teal-400", hex: "#2dd4bf" },
  { name: "Cyan", value: "text-cyan-400", hex: "#22d3ee" },
];

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/** Swatch-grid colour picker that emits a Tailwind text-colour class. */
export function ColorPicker({
  value,
  onChange,
  label,
  error,
  disabled,
  className,
}: ColorPickerProps) {
  return (
    <div className={className}>
      {label && <label className={labelClass}>{label}</label>}
      <div className="flex flex-wrap gap-1.5">
        {COLOR_PRESETS.map((c) => {
          const active = c.value === value;
          return (
            <button
              key={c.value}
              type="button"
              disabled={disabled}
              title={c.name}
              onClick={() => onChange(c.value)}
              style={{ backgroundColor: c.hex }}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition disabled:opacity-50",
                active ? "ring-2 ring-foreground" : "hover:scale-110",
              )}
            >
              {active && <Check className="h-3.5 w-3.5 text-black/80" />}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  );
}
