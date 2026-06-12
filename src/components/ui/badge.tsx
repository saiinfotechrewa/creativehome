import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning";

const variants: Record<BadgeVariant, string> = {
  default: "border-border bg-accent text-muted-foreground",
  primary: "border-primary/30 bg-primary/10 text-primary",
  secondary: "border-secondary/30 bg-secondary/10 text-secondary",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  /**
   * Featured style — replaces the static border with an animated
   * blue→purple gradient border that rotates around the pill.
   */
  featured?: boolean;
  /** Adds a subtle primary-colored glow behind the pill. */
  glow?: boolean;
  className?: string;
}

/** Small pill label for statuses, tags, and eyebrow text. */
export function Badge({
  children,
  variant = "default",
  featured,
  glow,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        featured
          ? "gradient-border-animated text-foreground [--gradient-border-fill:var(--color-accent)]"
          : variants[variant],
        glow && "shadow-[0_0_16px_0_var(--color-glow-primary)]",
        className
      )}
    >
      {children}
    </span>
  );
}
