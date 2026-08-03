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
        className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
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
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d131d] px-4 py-3.5 text-base font-semibold tabular-nums text-slate-50 placeholder:font-normal placeholder:text-slate-600 hover:border-white/25 focus:border-sky-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
}
