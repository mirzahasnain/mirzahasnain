"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface TiInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export function TiInput({ className, label, hint, id, ...rest }: TiInputProps) {
  const inputId = id ?? rest.name;
  return (
    <label className="flex flex-col gap-1 text-sm text-[var(--nb-text-soft)]">
      {label ? <span className="font-medium text-[var(--nb-text)]">{label}</span> : null}
      <input
        id={inputId}
        className={cn(
          "min-h-11 rounded-md border border-[var(--nb-border)] bg-[var(--nb-input)] px-3 text-[var(--nb-text)] outline-none focus:border-[var(--nb-accent)]",
          className,
        )}
        {...rest}
      />
      {hint ? <span className="text-xs text-[var(--nb-muted)]">{hint}</span> : null}
    </label>
  );
}
