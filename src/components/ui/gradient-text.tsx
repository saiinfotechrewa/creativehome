import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  /** Element to render. Default `span`. */
  as?: ElementType;
  /** Slowly shifts the gradient across the text. Default true. */
  animated?: boolean;
}

/**
 * Blue → purple gradient text. With `animated` (default) the gradient
 * drifts slowly; the animation is pure CSS and disabled automatically
 * under `prefers-reduced-motion`.
 *
 * @example
 * <h1>Automate <GradientText>everything</GradientText></h1>
 */
export function GradientText({
  children,
  className,
  as: Tag = "span",
  animated = true,
}: GradientTextProps) {
  return (
    <Tag
      className={cn(
        animated ? "text-gradient-animated" : "text-gradient",
        className
      )}
    >
      {children}
    </Tag>
  );
}
