import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface TiCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  asInteractive?: boolean;
}

/** Surface container using nb elevated tokens — interactive only when needed. */
export function TiCard({
  children,
  className,
  asInteractive = false,
  ...rest
}: TiCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--nb-border)] bg-[var(--nb-surface)] text-[var(--nb-text)]",
        asInteractive && "cursor-pointer hover:border-[var(--nb-border-strong)]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
