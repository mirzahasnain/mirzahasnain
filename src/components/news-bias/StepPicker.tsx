"use client";

import { Check } from "lucide-react";

export interface StepOption<TValue extends string> {
  value: TValue;
  label: string;
  description?: string;
}

interface StepPickerProps<TValue extends string> {
  step: string;
  title: string;
  options: StepOption<TValue>[];
  value: TValue | null;
  onChange: (value: TValue) => void;
  /** Short labels fit two per row on a phone; long ones need the full width. */
  columns?: 1 | 2;
}

/** One tap picks an option. Only the step being answered is ever rendered. */
export function StepPicker<TValue extends string>({
  step,
  title,
  options,
  value,
  onChange,
  columns = 1,
}: StepPickerProps<TValue>) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#0b1119]/70 p-5 sm:p-6">
      <div className="flex items-baseline gap-3">
        <span className="text-xs font-bold tabular-nums text-sky-400">
          {step}
        </span>
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {title}
        </h2>
      </div>

      <div
        role="group"
        aria-label={title}
        className={`mt-4 grid gap-2 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}
      >
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={`flex min-h-14 items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 ${
                isSelected
                  ? "border-sky-400/60 bg-sky-400/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/25"
              }`}
            >
              <span className="min-w-0">
                <span
                  className={`block truncate text-base font-semibold ${
                    isSelected ? "text-sky-200" : "text-slate-100"
                  }`}
                >
                  {option.label}
                </span>
                {option.description ? (
                  <span className="block truncate text-xs text-slate-500">
                    {option.description}
                  </span>
                ) : null}
              </span>
              {isSelected ? (
                <Check aria-hidden className="size-4 shrink-0 text-sky-400" />
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
