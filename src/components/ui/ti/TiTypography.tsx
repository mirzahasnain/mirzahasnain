import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export function TiHeading({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold tracking-tight text-[var(--nb-text)]",
        className,
      )}
      {...rest}
    >
      {children}
    </h2>
  );
}

export function TiText({
  children,
  className,
  muted,
  ...rest
}: HTMLAttributes<HTMLParagraphElement> & { children: ReactNode; muted?: boolean }) {
  return (
    <p
      className={cn(
        "text-sm leading-relaxed",
        muted ? "text-[var(--nb-muted)]" : "text-[var(--nb-text-soft)]",
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
}

export function TiMono({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { children: ReactNode }) {
  return (
    <span
      className={cn("font-mono tabular-nums text-[var(--nb-text)]", className)}
      {...rest}
    >
      {children}
    </span>
  );
}
