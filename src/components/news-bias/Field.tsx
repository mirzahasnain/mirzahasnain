import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  value: ReactNode;
  valueClassName?: string;
  className?: string;
}

/** Labelled tile used by every result card, so they stay visually identical. */
export function Field({
  label,
  value,
  valueClassName = "text-nb-text",
  className = "",
}: FieldProps) {
  return (
    <div
      className={`rounded-xl border border-nb-border bg-nb-elevated px-4 py-3 ${className}`}
    >
      <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-nb-muted">
        {label}
      </dt>
      <dd className={`mt-1 text-sm font-bold text-balance ${valueClassName}`}>{value}</dd>
    </div>
  );
}
