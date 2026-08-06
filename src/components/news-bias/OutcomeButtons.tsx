"use client";

import { ArrowDownRight, ArrowUpRight, Equal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { memo } from "react";
import {
  handleOptionKeyDown,
  OPTION_ATTRIBUTE,
} from "@/components/news-bias/optionKeyboard";
import { OUTCOME_OPTIONS, STEP_COPY } from "@/lib/news-bias/constants";
import type { SurpriseSign } from "@/lib/news-bias/types/interfaces";

interface OutcomeButtonsProps {
  value: SurpriseSign | null;
  onChange: (sign: SurpriseSign) => void;
  onCancel?: () => void;
}

const ICONS: Record<SurpriseSign, LucideIcon> = {
  positive: ArrowUpRight,
  negative: ArrowDownRight,
  flat: Equal,
};

const SELECTED_CLASS: Record<SurpriseSign, string> = {
  positive: "border-nb-up/70 bg-nb-up/10 text-nb-up",
  negative: "border-nb-down/70 bg-nb-down/10 text-nb-down",
  flat: "border-nb-border-strong bg-nb-elevated text-nb-text",
};

function OutcomeButtonsComponent({
  value,
  onChange,
  onCancel,
}: OutcomeButtonsProps) {
  return (
    <section className="nb-fade rounded-3xl border border-nb-border bg-nb-surface p-5 sm:p-6">
      <div className="flex items-baseline gap-3">
        <span className="text-xs font-bold tabular-nums text-nb-accent">
          {STEP_COPY.outcome.step}
        </span>
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-nb-muted">
          {STEP_COPY.outcome.title}
        </h2>
      </div>

      <div
        role="group"
        aria-label={STEP_COPY.outcome.title}
        onKeyDown={(event) => handleOptionKeyDown(event, onCancel)}
        className="mt-4 grid gap-3"
      >
        {OUTCOME_OPTIONS.map((option) => {
          const Icon = ICONS[option.sign];
          const isSelected = value === option.sign;

          return (
            <button
              key={option.sign}
              type="button"
              {...{ [OPTION_ATTRIBUTE]: "" }}
              aria-pressed={isSelected}
              onClick={() => onChange(option.sign)}
              className={`flex min-h-16 items-center gap-4 rounded-2xl border px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70 ${
                isSelected
                  ? SELECTED_CLASS[option.sign]
                  : "border-nb-border bg-nb-elevated text-nb-text-soft hover:border-nb-border-strong"
              }`}
            >
              <Icon aria-hidden className="size-6 shrink-0" />
              <span>
                <span className="block text-lg font-bold tracking-tight">
                  {option.label}
                </span>
                <span className="block text-xs uppercase tracking-[0.18em] text-nb-faint">
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

export const OutcomeButtons = memo(OutcomeButtonsComponent);
