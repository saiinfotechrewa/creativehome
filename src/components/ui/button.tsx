import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/20",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-accent hover:border-muted",
  ghost: "bg-transparent text-foreground hover:bg-accent",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

/** Compose the final class string for any button-like element. */
export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string
): string {
  return cn(baseStyles, variantStyles[variant], sizeStyles[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

/** Styled native `<button>`. */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
  children: ReactNode;
}

/** Button-styled link — internal Next.js `<Link>` or external `<a>`. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  external,
  children,
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);

  if (external || href.startsWith("http")) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noreferrer noopener"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
