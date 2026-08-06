import { Field } from "@/components/news-bias/Field";
import {
  ACTION_LABELS,
  DIRECTION_LABELS,
  EMPTY_VALUE,
  PLAYBOOK_LABELS,
} from "@/lib/news-bias/constants";
import type { Analysis } from "@/lib/news-bias/types/interfaces";
import { formatConfidence } from "@/lib/news-bias/utils/calculateConfidence";

interface TradePlaybookPanelProps {
  analysis: Analysis;
}

export function TradePlaybookPanel({ analysis }: TradePlaybookPanelProps) {
  const { playbook } = analysis;

  return (
    <div className="space-y-4">
      <dl className="grid gap-3 sm:grid-cols-2">
        <Field
          label={PLAYBOOK_LABELS.direction}
          value={ACTION_LABELS[playbook.direction]}
          valueClassName="text-base font-bold uppercase text-nb-text"
        />
        <Field
          label={PLAYBOOK_LABELS.confidence}
          value={formatConfidence(playbook.confidence)}
          valueClassName="text-base tabular-nums text-nb-text"
        />
        <Field
          label={PLAYBOOK_LABELS.bias}
          value={DIRECTION_LABELS[playbook.bias]}
        />
        <Field
          label={PLAYBOOK_LABELS.expectedMove}
          value={playbook.expectedMove?.label ?? EMPTY_VALUE}
        />
      </dl>
      <p className="text-sm leading-relaxed text-nb-text-soft">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nb-faint">
          {PLAYBOOK_LABELS.reason}
        </span>
        <span className="mt-1 block">{playbook.reason}</span>
      </p>
    </div>
  );
}
