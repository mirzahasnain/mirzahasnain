"use client";

import { memo } from "react";
import {
  DIRECTION_LABELS,
  RECENT_COPY,
} from "@/lib/news-bias/constants";
import { buildAnalysis } from "@/lib/news-bias/logic";
import type {
  Direction,
  HistoryEntry,
  RecentGroup,
} from "@/lib/news-bias/types/interfaces";

interface RecentAnalysesProps {
  groups: RecentGroup[];
  onOpen: (entry: HistoryEntry) => void;
}

const DIRECTION_CLASS: Record<Direction, string> = {
  bullish: "text-nb-up",
  bearish: "text-nb-down",
  neutral: "text-nb-flat",
};

/** The last few analyses, one tap from being reopened. */
function RecentAnalysesComponent({ groups, onOpen }: RecentAnalysesProps) {
  return (
    <section className="nb-fade rounded-3xl border border-nb-border bg-nb-surface p-5 sm:p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-nb-muted">
        {RECENT_COPY.title}
      </h2>

      <div className="mt-4 space-y-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-nb-faint">
              {group.label}
            </p>
            <ul className="space-y-2">
              {group.entries.map((entry) => {
                const analysis = buildAnalysis(entry);
                if (!analysis) return null;

                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => onOpen(entry)}
                      aria-label={`${RECENT_COPY.reopen}: ${analysis.event.label}, ${analysis.pair.label}`}
                      className="flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border border-nb-border bg-nb-elevated px-4 py-3 text-left hover:border-nb-border-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
                    >
                      <span className="min-w-0 truncate text-sm font-semibold text-nb-text">
                        {analysis.event.label}
                        <span className="text-nb-faint"> → </span>
                        {analysis.pair.displayName}
                      </span>
                      <span
                        className={`shrink-0 text-sm font-bold ${DIRECTION_CLASS[analysis.pairDirection]}`}
                      >
                        {DIRECTION_LABELS[analysis.pairDirection]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export const RecentAnalyses = memo(RecentAnalysesComponent);
