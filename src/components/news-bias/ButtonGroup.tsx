"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { OUTCOME_LABELS } from "@/lib/news-bias/constants";
import type { ReleaseOutcome } from "@/lib/news-bias/types";

type ButtonGroupProps = {
  value: ReleaseOutcome | null;
  onChange: (outcome: ReleaseOutcome) => void;
  disabled?: boolean;
};

const OPTIONS: {
  outcome: ReleaseOutcome;
  icon: typeof ArrowUpRight;
  activeClass: string;
}[] = [
  {
    outcome: "above",
    icon: ArrowUpRight,
    activeClass: "border-emerald-400/70 bg-emerald-400/10 text-emerald-300",
  },
  {
    outcome: "below",
    icon: ArrowDownRight,
    activeClass: "border-red-400/70 bg-red-400/10 text-red-300",
  },
];

export function ButtonGroup({ value, onChange, disabled }: ButtonGroupProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {OPTIONS.map(({ outcome, icon: Icon, activeClass }) => {
        const isActive = value === outcome;

        return (
          <button
            key={outcome}
            type="button"
            disabled={disabled}
            aria-pressed={isActive}
            onClick={() => onChange(outcome)}
            className={`flex items-center justify-center gap-3 rounded-xl border px-4 py-5 text-lg font-bold tracking-tight transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 disabled:cursor-not-allowed disabled:opacity-40 sm:py-6 ${
              isActive
                ? activeClass
                : "border-white/10 bg-[#0d131d] text-slate-200 enabled:hover:border-white/25 enabled:hover:bg-[#111a25]"
            }`}
          >
            <Icon aria-hidden className="size-6 shrink-0" />
            {OUTCOME_LABELS[outcome]}
          </button>
        );
      })}
    </div>
  );
}
