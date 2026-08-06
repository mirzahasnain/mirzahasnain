"use client";

import { DETAILS_COPY, DIRECTION_LABELS, EMPTY_VALUE } from "@/lib/news-bias/constants";
import { buildAnalysis } from "@/lib/news-bias/logic";
import type { Direction, HistoryEntry } from "@/lib/news-bias/types/interfaces";
import { formatSurprise } from "@/lib/news-bias/utils/calculateSurprise";

interface HistoryListProps {
  entries: HistoryEntry[];
  onOpen: (entry: HistoryEntry) => void;
}

const DIRECTION_CLASS: Record<Direction, string> = {
  bullish: "text-nb-up",
  bearish: "text-nb-down",
  neutral: "text-nb-text-soft",
};

const TIME_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

export function HistoryList({ entries, onOpen }: HistoryListProps) {
  if (entries.length === 0) {
    return (
      <p role="status" className="text-sm text-nb-muted">
        {DETAILS_COPY.history.empty}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry) => {
        const analysis = buildAnalysis(entry);
        if (!analysis) return null;

        const surprise = analysis.surprise.value;

        return (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => onOpen(entry)}
              aria-label={`${DETAILS_COPY.history.reopen}: ${analysis.event.label}, ${analysis.pair.label}`}
              className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-nb-border bg-nb-elevated px-4 py-3 text-left hover:border-nb-border-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-nb-text">
                  {analysis.event.label}
                </span>
                <span className="block truncate text-xs text-nb-muted">
                  {analysis.pair.label} ·{" "}
                  {new Date(entry.savedAt).toLocaleString(undefined, TIME_FORMAT)}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-sm font-bold tabular-nums text-nb-text">
                  {surprise === null ? EMPTY_VALUE : formatSurprise(surprise)}
                </span>
                <span
                  className={`block text-xs font-semibold ${DIRECTION_CLASS[analysis.pairDirection]}`}
                >
                  {DIRECTION_LABELS[analysis.pairDirection]}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
