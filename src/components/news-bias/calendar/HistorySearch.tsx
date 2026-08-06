"use client";

import { CALENDAR_COPY, type HistoricalResult } from "@/lib/news-bias/calendar";
import { formatCalendarNumber } from "@/lib/news-bias/calendar/utils/format";

interface HistorySearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  results: HistoricalResult[];
  isLoading?: boolean;
}

export function HistorySearch({
  query,
  onQueryChange,
  results,
  isLoading,
}: HistorySearchProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-nb-text">
        {CALENDAR_COPY.historyTitle}
      </h2>
      <label className="block">
        <span className="sr-only">{CALENDAR_COPY.historySearch}</span>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={CALENDAR_COPY.historySearch}
          className="min-h-11 w-full rounded-xl border border-nb-border bg-nb-input px-4 text-sm text-nb-text placeholder:text-nb-faint focus:border-nb-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
        />
      </label>

      {isLoading ? (
        <div className="space-y-2" aria-busy>
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-nb-elevated" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <p className="py-6 text-center text-sm text-nb-muted">
          {CALENDAR_COPY.historyEmpty}
        </p>
      ) : (
        <ul className="divide-y divide-nb-border">
          {results.map((row) => (
            <li key={row.id} className="py-3">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold text-nb-text">{row.name}</p>
                <time className="shrink-0 text-xs text-nb-faint" dateTime={row.date}>
                  {row.date}
                </time>
              </div>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-nb-faint">
                {row.currency} · {row.impact}
              </p>
              <dl className="mt-2 grid grid-cols-4 gap-1 text-center text-[11px]">
                <HistStat label={CALENDAR_COPY.forecast} value={formatCalendarNumber(row.forecast)} />
                <HistStat label={CALENDAR_COPY.previous} value={formatCalendarNumber(row.previous)} />
                <HistStat label={CALENDAR_COPY.actual} value={formatCalendarNumber(row.actual)} />
                <HistStat
                  label={CALENDAR_COPY.surprise}
                  value={formatCalendarNumber(row.surprise)}
                />
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function HistStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-nb-elevated/50 px-1 py-1.5">
      <dt className="text-[9px] uppercase tracking-wider text-nb-faint">{label}</dt>
      <dd className="font-mono tabular-nums text-nb-text-soft">{value}</dd>
    </div>
  );
}
