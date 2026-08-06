"use client";

import { useState } from "react";
import { HISTORICAL_INTEL_COPY } from "@/lib/news-bias/constants";
import {
  formatNumber,
  formatSurprise,
} from "@/lib/news-bias/utils/calculateSurprise";
import type { HistoricalIntelligenceView } from "@/lib/news-bias/types/interfaces";

interface HistoricalTimelineProps {
  intel: HistoricalIntelligenceView;
}

type TimelineRow = HistoricalIntelligenceView["timeline"][number];

export function HistoricalTimeline({ intel }: HistoricalTimelineProps) {
  const [selected, setSelected] = useState<TimelineRow | null>(null);
  const rows = intel.timeline;

  return (
    <div className="space-y-3">
      <p className="text-xs text-nb-muted">{HISTORICAL_INTEL_COPY.timelineHint}</p>

      <ul className="max-h-72 divide-y divide-nb-border overflow-y-auto">
        {rows.map((row) => {
          const active = selected?.date === row.date;
          return (
            <li key={row.date}>
              <button
                type="button"
                onClick={() => setSelected(active ? null : row)}
                className={[
                  "flex w-full items-baseline justify-between gap-3 px-1 py-3 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70",
                  active ? "bg-nb-accent/10" : "hover:bg-nb-elevated/50",
                ].join(" ")}
              >
                <span className="font-semibold text-nb-text">{row.date}</span>
                <span className="font-mono tabular-nums text-nb-muted">
                  {formatSurprise(row.surprise)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {selected ? (
        <div className="nb-fade rounded-xl border border-nb-border bg-nb-elevated/40 px-4 py-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-nb-text">{selected.date}</p>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-nb-muted hover:text-nb-accent"
            >
              {HISTORICAL_INTEL_COPY.closeDetails}
            </button>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <Mini label="Forecast" value={formatNumber(selected.forecast)} />
            <Mini label="Previous" value={formatNumber(selected.previous)} />
            <Mini label="Actual" value={formatNumber(selected.actual)} />
            <Mini label="Surprise" value={formatSurprise(selected.surprise)} />
          </dl>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <Mini label="Gold" value={String(selected.gold_move)} />
            <Mini label="Silver" value={String(selected.silver_move)} />
            <Mini label="EURUSD" value={String(selected.eurusd_move)} />
            <Mini label="BTC %" value={String(selected.btc_move)} />
          </dl>
        </div>
      ) : null}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-nb-surface/80 px-2 py-2">
      <dt className="text-[9px] font-semibold uppercase tracking-wider text-nb-faint">
        {label}
      </dt>
      <dd className="mt-0.5 font-mono tabular-nums text-nb-text-soft">{value}</dd>
    </div>
  );
}
