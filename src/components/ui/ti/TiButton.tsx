"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type TiButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type TiButtonSize = "sm" | "md" | "lg";

export interface TiButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: TiButtonVariant;
  size?: TiButtonSize;
}

const variantClass: Record<TiButtonVariant, string> = {
  primary:
    "bg-[var(--nb-accent)] text-[var(--nb-bg)] hover:opacity-90 border border-transparent",
  secondary:
    "bg-[var(--nb-elevated)] text-[var(--nb-text)] border border-[var(--nb-border)] hover:border-[var(--nb-border-strong)]",
  ghost:
    "bg-transparent text-[var(--nb-text-soft)] hover:bg-[var(--nb-elevated)] border border-transparent",
  danger:
    "bg-[var(--nb-down)]/15 text-[var(--nb-down)] border border-[var(--nb-down)]/40",
};

const sizeClass: Record<TiButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs min-h-9",
  md: "px-4 py-2 text-sm min-h-11",
  lg: "px-5 py-3 text-base min-h-12",
};

/**
 * TradeImpact button primitive — uses existing nb-* design tokens.
 * Does not replace landing-page Button; scoped for trading surfaces.
 */
export function TiButton({
  children,
  className,
  variant = "secondary",
  size = "md",
  type = "button",
  ...rest
}: TiButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-opacity disabled:opacity-50 disabled:pointer-events-none",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
