"use client";

import { HISTORICAL_INTEL_COPY } from "@/lib/news-bias/constants";
import { formatAverageMove } from "@/lib/news-bias/engine/statisticsEngine";
import type { HistoricalIntelligenceView } from "@/lib/news-bias/types/interfaces";

interface HistoricalAverageMovePanelProps {
  intel: HistoricalIntelligenceView;
}

export function HistoricalAverageMovePanel({
  intel,
}: HistoricalAverageMovePanelProps) {
  if (intel.sampleSize === 0) {
    return (
      <p className="text-sm text-nb-muted">{HISTORICAL_INTEL_COPY.noMatches}</p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-nb-faint">
        {HISTORICAL_INTEL_COPY.averageMove}
      </p>
      <dl className="grid grid-cols-2 gap-2">
        {intel.assets.map((asset) => (
          <div
            key={asset.key}
            className="rounded-xl bg-nb-elevated/60 px-3 py-2.5"
          >
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-nb-faint">
              {asset.label}
            </dt>
            <dd className="mt-1 font-mono text-sm tabular-nums text-nb-text">
              {formatAverageMove(asset)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
