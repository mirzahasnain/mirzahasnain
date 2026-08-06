import {
  EMPTY_VALUE,
  HISTORICAL_LABELS,
} from "@/lib/news-bias/constants";
import type { Analysis } from "@/lib/news-bias/types/interfaces";

interface HistoricalStatsPanelProps {
  analysis: Analysis;
}

export function HistoricalStatsPanel({ analysis }: HistoricalStatsPanelProps) {
  const { historical, pair } = analysis;
  if (!historical) {
    return (
      <p className="text-sm text-nb-muted">
        No historical sample is configured for this release yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-nb-text">{historical.label}</p>

      <dl className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-nb-elevated/60 px-3 py-3">
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-nb-faint">
            {HISTORICAL_LABELS.averageMove} · {pair.displayName}
          </dt>
          <dd className="mt-1 font-mono text-base tabular-nums text-nb-text">
            {historical.averageMove === null
              ? EMPTY_VALUE
              : `${historical.averageMove} ${historical.unit ?? ""}`}
          </dd>
        </div>
        <div className="rounded-xl bg-nb-elevated/60 px-3 py-3">
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-nb-faint">
            {HISTORICAL_LABELS.winRate}
          </dt>
          <dd className="mt-1 font-mono text-base tabular-nums text-nb-text">
            {historical.winRate === null ? EMPTY_VALUE : `${historical.winRate}%`}
          </dd>
        </div>
      </dl>

      {historical.highlights.length > 0 ? (
        <ul className="divide-y divide-nb-border">
          {historical.highlights.map((row) => (
            <li
              key={row.pairId}
              className="flex items-baseline justify-between gap-3 py-2 text-sm"
            >
              <span className="font-semibold text-nb-text-soft">{row.name}</span>
              <span className="font-mono tabular-nums text-nb-muted">
                {row.averageMove} {row.unit}
                <span className="ml-2 text-nb-faint">{row.winRate}%</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
