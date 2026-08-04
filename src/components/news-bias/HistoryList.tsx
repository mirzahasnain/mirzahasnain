"use client";

import {
  DETAILS_COPY,
  DIRECTION_LABELS,
  EMPTY_VALUE,
} from "@/lib/news-bias/constants";
import { buildAnalysis } from "@/lib/news-bias/logic";
import type {
  Direction,
  HistoryEntry,
} from "@/lib/news-bias/types/interfaces";
import { formatSurprise } from "@/lib/news-bias/utils/calculateSurprise";

interface HistoryListProps {
  entries: HistoryEntry[];
  onOpen: (entry: HistoryEntry) => void;
}

const DIRECTION_CLASS: Record<Direction, string> = {
  bullish: "text-emerald-300",
  bearish: "text-red-300",
  neutral: "text-slate-300",
};

const TIME_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

export function HistoryList({ entries, onOpen }: HistoryListProps) {
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
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-left hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-100">
                  {analysis.event.label}
                </span>
                <span className="block truncate text-xs text-slate-500">
                  {analysis.pair.label} ·{" "}
                  {new Date(entry.savedAt).toLocaleString(
                    undefined,
                    TIME_FORMAT,
                  )}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-sm font-bold tabular-nums text-slate-200">
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
