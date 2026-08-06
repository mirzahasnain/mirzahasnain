"use client";

import { WORKSPACE_COPY } from "@/lib/news-bias/modules/dashboard/workspaceCopy";
import type { MarketSessionRow } from "@/lib/news-bias/modules/types";

interface MarketStatusPanelProps {
  rows: MarketSessionRow[];
  marketOpen: boolean;
  activeLabel: string;
}

export function MarketStatusPanel({
  rows,
  marketOpen,
  activeLabel,
}: MarketStatusPanelProps) {
  return (
    <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-nb-text">
          {WORKSPACE_COPY.sections.market}
        </h2>
        <p
          className={[
            "text-xs font-semibold",
            marketOpen ? "text-nb-up" : "text-nb-wait",
          ].join(" ")}
        >
          {marketOpen ? WORKSPACE_COPY.market.open : WORKSPACE_COPY.market.closed}
        </p>
      </div>
      <p className="mt-1 text-xs text-nb-muted">{activeLabel}</p>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {rows.map((row) => (
          <li
            key={row.id}
            className={[
              "rounded-xl px-3 py-2.5 text-center text-sm font-semibold",
              row.active
                ? "bg-nb-accent/15 text-nb-text ring-1 ring-nb-accent/40"
                : "bg-nb-elevated/60 text-nb-muted",
            ].join(" ")}
          >
            {row.label}
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-nb-faint">
              {row.open ? "Open" : "Closed"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
