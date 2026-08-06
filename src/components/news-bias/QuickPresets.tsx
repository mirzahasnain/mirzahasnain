"use client";

import { Star } from "lucide-react";
import { GROUP_LABELS } from "@/lib/news-bias/constants";
import type { DropdownOption } from "@/lib/news-bias/types/interfaces";

interface QuickPresetsProps<TValue extends string> {
  options: DropdownOption<TValue>[];
  value: TValue | null;
  onSelect: (value: TValue) => void;
}

/** One tap straight to the releases traders watch most. */
export function QuickPresets<TValue extends string>({
  options,
  value,
  onSelect,
}: QuickPresetsProps<TValue>) {
  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-nb-faint">
        {GROUP_LABELS.presets}
      </p>
      <div
        role="group"
        aria-label={GROUP_LABELS.presets}
        className="mt-2 flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option.value)}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70 ${
                isSelected
                  ? "border-nb-accent/60 bg-nb-accent/10 text-nb-accent"
                  : "border-nb-border bg-nb-elevated text-nb-text-soft hover:border-nb-border-strong"
              }`}
            >
              <Star
                aria-hidden
                className={`size-3.5 ${isSelected ? "fill-current" : ""}`}
              />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
