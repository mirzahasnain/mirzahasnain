"use client";

import { HISTORICAL_INTEL_COPY } from "@/lib/news-bias/constants";
import type { HistoricalIntelligenceView } from "@/lib/news-bias/types/interfaces";

interface HistoricalProbabilityPanelProps {
  intel: HistoricalIntelligenceView;
}

export function HistoricalProbabilityPanel({
  intel,
}: HistoricalProbabilityPanelProps) {
  if (intel.sampleSize === 0) {
    return (
      <p className="text-sm text-nb-muted">{HISTORICAL_INTEL_COPY.noMatches}</p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-nb-faint">
        {HISTORICAL_INTEL_COPY.probability}
      </p>
      <ul className="space-y-2">
        {intel.assets.map((asset) => {
          const bearish = asset.bearishProbability >= asset.bullishProbability;
          const pct = bearish
            ? asset.bearishProbability
            : asset.bullishProbability;
          const label = bearish ? "Bearish" : "Bullish";
          return (
            <li
              key={asset.key}
              className="flex items-baseline justify-between gap-3 text-sm"
            >
              <span className="text-nb-text-soft">
                {asset.label}{" "}
                <span
                  className={bearish ? "text-nb-down" : "text-nb-up"}
                >
                  {label}
                </span>
              </span>
              <span className="font-mono font-semibold tabular-nums text-nb-text">
                {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
