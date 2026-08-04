"use client";

import { ArrowDownRight, ArrowUpRight, Equal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { OUTCOME_OPTIONS, STEP_COPY } from "@/lib/news-bias/constants";
import type { SurpriseSign } from "@/lib/news-bias/types/interfaces";

interface OutcomeButtonsProps {
  value: SurpriseSign | null;
  onChange: (sign: SurpriseSign) => void;
}

const ICONS: Record<SurpriseSign, LucideIcon> = {
  positive: ArrowUpRight,
  negative: ArrowDownRight,
  flat: Equal,
};

const SELECTED_CLASS: Record<SurpriseSign, string> = {
  positive: "border-emerald-400/70 bg-emerald-400/10 text-emerald-300",
  negative: "border-red-400/70 bg-red-400/10 text-red-300",
  flat: "border-white/25 bg-white/[0.06] text-slate-200",
};

export function OutcomeButtons({ value, onChange }: OutcomeButtonsProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#0b1119]/70 p-5 sm:p-6">
      <div className="flex items-baseline gap-3">
        <span className="text-xs font-bold tabular-nums text-sky-400">
          {STEP_COPY.outcome.step}
        </span>
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {STEP_COPY.outcome.title}
        </h2>
      </div>

      <div
        role="group"
        aria-label={STEP_COPY.outcome.title}
        className="mt-4 grid gap-3"
      >
        {OUTCOME_OPTIONS.map((option) => {
          const Icon = ICONS[option.sign];
          const isSelected = value === option.sign;

          return (
            <button
              key={option.sign}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.sign)}
              className={`flex min-h-16 items-center gap-4 rounded-2xl border px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 ${
                isSelected
                  ? SELECTED_CLASS[option.sign]
                  : "border-white/10 bg-white/[0.03] text-slate-200 hover:border-white/25"
              }`}
            >
              <Icon aria-hidden className="size-6 shrink-0" />
              <span>
                <span className="block text-lg font-bold tracking-tight">
                  {option.label}
                </span>
                <span className="block text-xs uppercase tracking-[0.18em] text-slate-500">
                  {option.caption}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
