"use client";

import type { SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface TiSelectOption {
  value: string;
  label: string;
}

export interface TiSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: TiSelectOption[];
}

export function TiSelect({ className, label, options, id, ...rest }: TiSelectProps) {
  const selectId = id ?? rest.name;
  return (
    <label className="flex flex-col gap-1 text-sm text-[var(--nb-text-soft)]">
      {label ? <span className="font-medium text-[var(--nb-text)]">{label}</span> : null}
      <select
        id={selectId}
        className={cn(
          "min-h-11 rounded-md border border-[var(--nb-border)] bg-[var(--nb-input)] px-3 text-[var(--nb-text)] outline-none focus:border-[var(--nb-accent)]",
          className,
        )}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
