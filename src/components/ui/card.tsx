import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Adds an interactive hover lift + border highlight. */
  interactive?: boolean;
}

/** Surface container that matches the dark SaaS design system. */
export function Card({ children, className, interactive }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-6",
        interactive &&
          "group relative transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5",
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
    <h3 className={cn("text-lg font-semibold text-foreground", className)}>
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
    <p className={cn("text-sm leading-relaxed text-muted-foreground", className)}>
      {children}
    </p>
  );
}
