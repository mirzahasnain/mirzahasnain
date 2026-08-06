"use client";

import { HISTORICAL_INTEL_COPY } from "@/lib/news-bias/constants";
import type { HistoricalIntelligenceView } from "@/lib/news-bias/types/interfaces";

interface HistoricalMatchCardProps {
  intel: HistoricalIntelligenceView;
}

/** Up/down vote card for similar historical releases. */
export function HistoricalMatchCard({ intel }: HistoricalMatchCardProps) {
  if (intel.surprise === null) {
    return (
      <p className="text-sm text-nb-muted">{HISTORICAL_INTEL_COPY.empty}</p>
    );
  }

  if (intel.sampleSize === 0) {
    return (
      <p className="text-sm text-nb-muted">{HISTORICAL_INTEL_COPY.noMatches}</p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-nb-text">
          {HISTORICAL_INTEL_COPY.matchTitle}
        </p>
        <p className="mt-1 text-xs text-nb-muted">
          {intel.sampleSize} {HISTORICAL_INTEL_COPY.similarFound}
          <span className="mx-1.5 text-nb-faint">·</span>
          Similarity {intel.confidenceScore}%
        </p>
        {intel.band ? (
          <p className="mt-1 font-mono text-[11px] tabular-nums text-nb-faint">
            Band {formatSigned(intel.band.min)} → {formatSigned(intel.band.max)}
          </p>
        ) : null}
      </div>

      <ul className="divide-y divide-nb-border">
        {intel.assets.map((asset) => (
          <li
            key={asset.key}
            className="flex items-center justify-between gap-3 py-2.5 text-sm"
          >
            <span className="font-semibold text-nb-text">{asset.label}</span>
            <span className="flex items-center gap-3 font-mono tabular-nums">
              <span className="text-nb-down">
                {HISTORICAL_INTEL_COPY.down} {asset.down}
              </span>
              <span className="text-nb-up">
                {HISTORICAL_INTEL_COPY.up} {asset.up}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}
