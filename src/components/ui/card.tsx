import type { ReactNode } from "react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { cn } from "@/lib/utils";

export type CardVariant =
  | "default"
  | "hover-lift"
  | "glow-border"
  | "spotlight";

const variantStyles: Record<Exclude<CardVariant, "spotlight">, string> = {
  default: "",
  "hover-lift":
    "group relative transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5",
  "glow-border": "gradient-border-animated glow-primary",
};

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  /** @deprecated Use `variant="hover-lift"` instead. */
  interactive?: boolean;
}

/** Surface container that matches the dark SaaS design system. */
export function Card({
  children,
  className,
  variant = "default",
  interactive,
}: CardProps) {
  if (variant === "spotlight") {
    return <SpotlightCard className={className}>{children}</SpotlightCard>;
  }

  const resolved = interactive ? "hover-lift" : variant;

  return (
    <div
      className={cn(
        "border-border bg-card rounded-lg border p-6",
        variantStyles[resolved],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-foreground text-lg font-semibold", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn("text-muted-foreground text-sm leading-relaxed", className)}
    >
      {children}
    </p>
  );
}
