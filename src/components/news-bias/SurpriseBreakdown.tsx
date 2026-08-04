import { Field } from "@/components/news-bias/Field";
import {
  BREAKDOWN_LABELS,
  EMPTY_VALUE,
  IMPACT_LABELS,
  STRENGTH_LABELS,
  SURPRISE_SIGN_LABELS,
} from "@/lib/news-bias/constants";
import type {
  Analysis,
  SurpriseStrength,
} from "@/lib/news-bias/types/interfaces";
import {
  calculateSurprise,
  formatSurprise,
} from "@/lib/news-bias/utils/calculateSurprise";

interface SurpriseBreakdownProps {
  analysis: Analysis;
}

const STRENGTH_DOT: Record<SurpriseStrength, string> = {
  neutral: "bg-slate-400",
  weak: "bg-emerald-400",
  moderate: "bg-yellow-400",
  strong: "bg-orange-400",
  extreme: "bg-red-500",
};

const STRENGTH_TEXT: Record<SurpriseStrength, string> = {
  neutral: "text-slate-300",
  weak: "text-emerald-300",
  moderate: "text-yellow-300",
  strong: "text-orange-300",
  extreme: "text-red-300",
};

export function SurpriseBreakdown({ analysis }: SurpriseBreakdownProps) {
  const { surprise, values } = analysis;

  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      <Field
        label={BREAKDOWN_LABELS.surprise}
        value={
          surprise.value === null
            ? EMPTY_VALUE
            : formatSurprise(surprise.value)
        }
        valueClassName="text-base tabular-nums text-slate-50"
      />
      <Field
        label={BREAKDOWN_LABELS.reading}
        value={SURPRISE_SIGN_LABELS[surprise.sign]}
      />
      <Field
        label={BREAKDOWN_LABELS.strength}
        value={
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className={`size-2.5 shrink-0 rounded-full ${STRENGTH_DOT[surprise.strength]}`}
            />
            <span className={STRENGTH_TEXT[surprise.strength]}>
              {STRENGTH_LABELS[surprise.strength]}
            </span>
          </span>
        }
      />
      <Field
        label={BREAKDOWN_LABELS.impact}
        value={IMPACT_LABELS[surprise.impact]}
      />
      {values && values.previous !== null ? (
        <Field
          label={BREAKDOWN_LABELS.previous}
          value={formatSurprise(
            calculateSurprise(values.actual, values.previous),
          )}
          valueClassName="tabular-nums text-slate-100"
          className="sm:col-span-2"
        />
      ) : null}
    </dl>
  );
}
