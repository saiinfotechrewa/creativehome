"use client";

import Link from "next/link";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "accent";
export type ButtonSize = "sm" | "md" | "lg";

const MotionLink = motion.create(Link);

const baseStyles =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30",
  secondary:
    "border border-border bg-transparent text-foreground hover:bg-accent hover:border-muted",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-accent hover:border-muted",
  ghost: "bg-transparent text-foreground hover:bg-accent",
  accent:
    "bg-linear-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-secondary/25 hover:brightness-110 hover:shadow-secondary/40",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

const hoverMotion = { scale: 1.02, y: -1 };
const tapMotion = { scale: 0.97 };
const motionTransition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
} as const;

/** Compose the final class string for any button-like element. */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
): string {
  return cn(baseStyles, variantStyles[variant], sizeStyles[size], className);
}

/** Light sweep that travels across filled buttons on hover. */
function Shimmer() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
    />
  );
}

const hasShimmer = (variant: ButtonVariant) =>
  variant === "primary" || variant === "accent";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon rendered before the label. */
  iconLeft?: ReactNode;
  /** Icon rendered after the label. */
  iconRight?: ReactNode;
  children?: ReactNode;
}

/** Styled native `<button>` with hover/tap motion and shimmer on hover. */
export function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      className={buttonClasses(variant, size, className)}
      whileHover={hoverMotion}
      whileTap={tapMotion}
      transition={motionTransition}
      {...rest}
    >
      {hasShimmer(variant) && <Shimmer />}
      {iconLeft}
      {children}
      {iconRight}
    </motion.button>
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  external?: boolean;
  children: ReactNode;
}

/** Button-styled link — internal Next.js `<Link>` or external `<a>`. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  className,
  external,
  children,
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);
  const content = (
    <>
      {hasShimmer(variant) && <Shimmer />}
      {iconLeft}
      {children}
      {iconRight}
    </>
  );

  if (external || href.startsWith("http")) {
    return (
      <motion.a
        href={href}
        className={classes}
        target="_blank"
        rel="noreferrer noopener"
        whileHover={hoverMotion}
        whileTap={tapMotion}
        transition={motionTransition}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <MotionLink
      href={href}
      className={classes}
      whileHover={hoverMotion}
      whileTap={tapMotion}
      transition={motionTransition}
    >
      {content}
    </MotionLink>
  );
}
