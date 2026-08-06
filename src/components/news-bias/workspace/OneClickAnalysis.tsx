"use client";

import { DIRECTION_LABELS } from "@/lib/news-bias/constants";
import { WORKSPACE_COPY } from "@/lib/news-bias/modules/dashboard/workspaceCopy";
import type { WatchBiasRow } from "@/lib/news-bias/modules/types";

interface OneClickAnalysisProps {
  eventLabel: string | null;
  confidence: number;
  rows: WatchBiasRow[];
}

export function OneClickAnalysis({
  eventLabel,
  confidence,
  rows,
}: OneClickAnalysisProps) {
  return (
    <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-nb-text">
          {WORKSPACE_COPY.sections.oneClick}
        </h2>
        {confidence > 0 ? (
          <p className="text-xs text-nb-muted">
            {WORKSPACE_COPY.oneClick.confidence}{" "}
            <span className="font-bold text-nb-text">{confidence}%</span>
          </p>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-nb-muted">
        {eventLabel
          ? `${eventLabel} — ${WORKSPACE_COPY.oneClick.hint}`
          : WORKSPACE_COPY.oneClick.empty}
      </p>

      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-nb-muted">{WORKSPACE_COPY.watchlist.empty}</p>
      ) : (
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {rows.map((row) => (
            <li
              key={row.assetId}
              className="rounded-xl bg-nb-elevated/60 px-3 py-3"
            >
              <p className="text-sm font-bold text-nb-text">{row.label}</p>
              <p
                className={[
                  "mt-1 text-sm font-semibold",
                  row.bias === "bullish"
                    ? "text-nb-up"
                    : row.bias === "bearish"
                      ? "text-nb-down"
                      : "text-nb-flat",
                ].join(" ")}
              >
                {DIRECTION_LABELS[row.bias]}
              </p>
              <p className="mt-1 text-[11px] text-nb-muted">
                {WORKSPACE_COPY.oneClick.confidence} {row.confidence}%
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
