import { Card } from "@/components/news-bias/Card";
import { Field } from "@/components/news-bias/Field";
import { ACTION_LABELS, CARD_COPY } from "@/lib/news-bias/constants";
import type { Analysis, TradeAction } from "@/lib/news-bias/types/interfaces";
import { formatConfidence } from "@/lib/news-bias/utils/calculateConfidence";

interface TradeDecisionCardProps {
  analysis: Analysis;
}

const ACTION_TEXT: Record<TradeAction, string> = {
  buy: "text-emerald-400",
  sell: "text-red-400",
  wait: "text-amber-300",
};

const ACTION_BAR: Record<TradeAction, string> = {
  buy: "bg-emerald-400",
  sell: "bg-red-400",
  wait: "bg-amber-300",
};

export function TradeDecisionCard({ analysis }: TradeDecisionCardProps) {
  const { labels } = CARD_COPY.decision;
  const { action, surprise } = analysis;

  return (
    <Card title={CARD_COPY.decision.title}>
      <dl className="grid gap-3 sm:grid-cols-3">
        <Field label={labels.pair} value={analysis.pair.label} />
        <Field
          label={labels.recommendation}
          value={ACTION_LABELS[action]}
          valueClassName={`text-base ${ACTION_TEXT[action]}`}
        />
        <Field
          label={labels.confidence}
          value={
            <span className="block">
              <span className="tabular-nums">
                {formatConfidence(surprise.confidence)}
              </span>
              <span className="mt-2 block h-1 w-full overflow-hidden rounded-full bg-white/10">
                <span
                  className={`block h-full rounded-full ${ACTION_BAR[action]}`}
                  style={{ width: `${surprise.confidence}%` }}
                />
              </span>
            </span>
          }
        />
      </dl>

      <dl className="mt-3">
        <Field
          label={labels.reason}
          value={analysis.reason}
          valueClassName="text-sm font-normal leading-relaxed text-slate-300"
        />
      </dl>
    </Card>
  );
}
