import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type TiBadgeTone = "neutral" | "up" | "down" | "wait" | "accent";

export interface TiBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: TiBadgeTone;
}

const toneClass: Record<TiBadgeTone, string> = {
  neutral: "bg-[var(--nb-elevated)] text-[var(--nb-text-soft)]",
  up: "bg-[var(--nb-up)]/15 text-[var(--nb-up)]",
  down: "bg-[var(--nb-down)]/15 text-[var(--nb-down)]",
  wait: "bg-[var(--nb-wait)]/15 text-[var(--nb-wait)]",
  accent: "bg-[var(--nb-accent)]/15 text-[var(--nb-accent)]",
};

export function TiBadge({
  children,
  className,
  tone = "neutral",
  ...rest
}: TiBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        toneClass[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
