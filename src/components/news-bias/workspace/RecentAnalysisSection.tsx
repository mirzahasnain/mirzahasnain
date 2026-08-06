"use client";

import Link from "next/link";
import { WORKSPACE_COPY } from "@/lib/news-bias/modules/dashboard/workspaceCopy";
import type { HistoryEntry } from "@/lib/news-bias/types/interfaces";
import { NEWS_EVENTS } from "@/lib/news-bias/news";
import { TRADING_PAIRS } from "@/lib/news-bias/pairs";

interface RecentAnalysisSectionProps {
  entries: HistoryEntry[];
}

export function RecentAnalysisSection({ entries }: RecentAnalysisSectionProps) {
  return (
    <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
      <h2 className="text-sm font-semibold text-nb-text">
        {WORKSPACE_COPY.sections.recent}
      </h2>
      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-nb-muted">No recent analysis yet.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {entries.map((entry) => {
            const news =
              NEWS_EVENTS.find((n) => n.id === entry.eventId)?.label ??
              entry.eventId;
            const pair =
              TRADING_PAIRS.find((p) => p.id === entry.pairId)?.displayName ??
              entry.pairId;
            const href = `/news-bias?event=${encodeURIComponent(entry.eventId)}&pair=${encodeURIComponent(entry.pairId)}${
              entry.forecast !== null ? `&forecast=${entry.forecast}` : ""
            }${entry.previous !== null ? `&previous=${entry.previous}` : ""}${
              entry.actual !== null ? `&actual=${entry.actual}` : ""
            }`;
            return (
              <li key={entry.id}>
                <Link
                  href={href}
                  className="flex min-h-11 items-center justify-between gap-2 rounded-xl bg-nb-elevated/50 px-3 text-sm hover:bg-nb-elevated"
                >
                  <span className="font-semibold text-nb-text">
                    {news} · {pair}
                  </span>
                  <span className="text-[11px] text-nb-faint">
                    {new Date(entry.savedAt).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
