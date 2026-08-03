"use client";

import { Trash2 } from "lucide-react";
import { Card } from "@/components/news-bias/Card";
import { CARD_COPY, DIRECTION_LABELS } from "@/lib/news-bias/constants";
import { buildAnalysis } from "@/lib/news-bias/logic";
import type {
  Direction,
  HistoryEntry,
} from "@/lib/news-bias/types/interfaces";
import { formatSurprise } from "@/lib/news-bias/utils/calculateSurprise";

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onOpen: (entry: HistoryEntry) => void;
  onClear: () => void;
}

const BADGE_CLASS: Record<Direction, string> = {
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

export function HistoryPanel({ entries, onOpen, onClear }: HistoryPanelProps) {
  return (
    <Card
      title={CARD_COPY.history.title}
      hint={CARD_COPY.history.hint}
      action={
        <button
          type="button"
          onClick={onClear}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:border-white/25 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
        >
          <Trash2 aria-hidden className="size-3.5" />
          {CARD_COPY.history.clear}
        </button>
      }
    >
      <ul className="space-y-2">
        {entries.map((entry) => {
          const analysis = buildAnalysis(entry);
          if (!analysis) return null;

          return (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => onOpen(entry)}
                aria-label={`${CARD_COPY.history.reopen}: ${analysis.event.label}, ${analysis.pair.label}`}
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
                    {formatSurprise(analysis.surprise.value)}
                  </span>
                  <span
                    className={`block text-xs font-semibold ${BADGE_CLASS[analysis.pairDirection]}`}
                  >
                    {DIRECTION_LABELS[analysis.pairDirection]}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
