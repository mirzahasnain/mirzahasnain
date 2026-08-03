"use client";

import { Card } from "@/components/news-bias/Card";
import { DEVIATION_LABELS, STRENGTH_LABELS } from "@/lib/news-bias/constants";
import { DEVIATION_SIZES, getImpactStrength } from "@/lib/news-bias/logic";
import type {
  DeviationSize,
  ImpactStrength,
  ReleaseOutcome,
} from "@/lib/news-bias/types";

interface ImpactStrengthCardProps {
  outcome: ReleaseOutcome;
  value: DeviationSize;
  onChange: (deviation: DeviationSize) => void;
}

const DOT_CLASS: Record<ImpactStrength, string> = {
  weak: "bg-emerald-400",
  moderate: "bg-yellow-400",
  strong: "bg-orange-400",
  "very-strong": "bg-red-500",
};

export function ImpactStrengthCard({
  outcome,
  value,
  onChange,
}: ImpactStrengthCardProps) {
  return (
    <Card
      title="Impact Strength"
      hint="How far the actual landed from the forecast. Selected manually in this version."
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {DEVIATION_SIZES.map((deviation) => {
          const strength = getImpactStrength(deviation);
          const isSelected = deviation === value;

          return (
            <button
              key={deviation}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(deviation)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 ${
                isSelected
                  ? "border-sky-400/60 bg-sky-400/10"
                  : "border-white/10 bg-[#0d131d] hover:border-white/25"
              }`}
            >
              <span
                aria-hidden
                className={`size-3 shrink-0 rounded-full ${DOT_CLASS[strength]}`}
              />
              <span className="min-w-0">
                <span
                  className={`block text-sm font-bold ${
                    isSelected ? "text-sky-200" : "text-slate-100"
                  }`}
                >
                  {STRENGTH_LABELS[strength]}
                </span>
                <span className="block text-xs text-slate-500">
                  {DEVIATION_LABELS[outcome][deviation]}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
