import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning";

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
  className?: string;
}

/** Small pill label for statuses, tags, and eyebrow text. */
export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
