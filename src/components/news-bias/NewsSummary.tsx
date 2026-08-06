"use client";

import { memo } from "react";
import { SelectionBar } from "@/components/news-bias/SelectionBar";
import type { SelectionChip } from "@/components/news-bias/SelectionBar";
import { SUMMARY_LABELS } from "@/lib/news-bias/constants";
import type { Analysis } from "@/lib/news-bias/types/interfaces";
import {
  formatNumber,
  formatSurprise,
} from "@/lib/news-bias/utils/calculateSurprise";

interface NewsSummaryProps {
  chips: SelectionChip[];
  analysis: Analysis | null;
}

/**
 * The selection, plus the numbers behind it once they exist. Doubles as the way
 * back into any step, so it replaces a separate breadcrumb.
 */
function NewsSummaryComponent({ chips, analysis }: NewsSummaryProps) {
  const values = analysis?.values ?? null;

  return (
    <div className="space-y-3">
      {chips.length > 0 ? <SelectionBar chips={chips} /> : null}

      {values && analysis ? (
        <dl className="nb-fade flex flex-wrap gap-x-6 gap-y-2 rounded-2xl border border-nb-border bg-nb-surface px-4 py-3">
          <Stat
            label={SUMMARY_LABELS.forecast}
            value={formatNumber(values.forecast)}
          />
          <Stat
            label={SUMMARY_LABELS.actual}
            value={formatNumber(values.actual)}
          />
          <Stat
            label={SUMMARY_LABELS.surprise}
            value={formatSurprise(analysis.surprise.value ?? 0)}
          />
        </dl>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-nb-faint">
        {label}
      </dt>
      <dd className="text-sm font-bold tabular-nums text-nb-text">{value}</dd>
    </div>
  );
}

export const NewsSummary = memo(NewsSummaryComponent);
