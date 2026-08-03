import { Card } from "@/components/news-bias/Card";
import { Field } from "@/components/news-bias/Field";
import {
  CARD_COPY,
  IMPACT_LABELS,
  STRENGTH_LABELS,
  SURPRISE_SIGN_LABELS,
} from "@/lib/news-bias/constants";
import type {
  ReleaseValues,
  SurpriseReading,
  SurpriseStrength,
} from "@/lib/news-bias/types/interfaces";
import {
  formatSurprise,
  calculateSurprise,
} from "@/lib/news-bias/utils/calculateSurprise";

interface SurpriseCardProps {
  surprise: SurpriseReading;
  values: ReleaseValues;
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

export function SurpriseCard({ surprise, values }: SurpriseCardProps) {
  const { labels } = CARD_COPY.surprise;

  return (
    <Card title={CARD_COPY.surprise.title}>
      <dl className="grid gap-3 sm:grid-cols-2">
        <Field
          label={labels.surprise}
          value={formatSurprise(surprise.value)}
          valueClassName="text-base tabular-nums text-slate-50"
        />
        <Field
          label={labels.reading}
          value={SURPRISE_SIGN_LABELS[surprise.sign]}
        />
        <Field
          label={labels.strength}
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
          label={labels.impact}
          value={IMPACT_LABELS[surprise.impact]}
        />
        {values.previous === null ? null : (
          <Field
            label={labels.previous}
            value={formatSurprise(
              calculateSurprise(values.actual, values.previous),
            )}
            valueClassName="tabular-nums text-slate-100"
            className="sm:col-span-2"
          />
        )}
      </dl>
    </Card>
  );
}
