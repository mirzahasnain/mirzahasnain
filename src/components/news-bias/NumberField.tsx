"use client";

import { useId } from "react";

interface NumberFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function NumberField({
  label,
  placeholder,
  value,
  onChange,
}: NumberFieldProps) {
  const inputId = useId();

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-nb-text0"
      >
        {label}
      </label>
      <input
        id={inputId}
        type="number"
        inputMode="decimal"
        step="any"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-xl border border-nb-border bg-nb-input px-4 py-3.5 text-base font-semibold tabular-nums text-nb-text placeholder:font-normal placeholder:text-nb-faint hover:border-nb-border-strong focus:border-nb-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
}
