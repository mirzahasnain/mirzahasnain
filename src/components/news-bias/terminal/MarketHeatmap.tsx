"use client";

import { TERMINAL_COPY } from "@/lib/news-bias/modules/dashboard/copy";
import type { HeatmapCell } from "@/lib/news-bias/modules/types";
import { DIRECTION_LABELS } from "@/lib/news-bias/constants";

interface MarketHeatmapProps {
  cells: HeatmapCell[];
}

export function MarketHeatmap({ cells }: MarketHeatmapProps) {
  return (
    <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
      <h2 className="text-sm font-semibold text-nb-text">
        {TERMINAL_COPY.heatmap.title}
      </h2>
      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {cells.map((cell) => (
          <li
            key={cell.id}
            className={[
              "rounded-xl px-2 py-3 text-center",
              cell.tone === "strong"
                ? "bg-nb-up/15"
                : cell.tone === "weak"
                  ? "bg-nb-down/15"
                  : "bg-nb-wait/15",
            ].join(" ")}
          >
            <span
              aria-hidden
              className={[
                "mx-auto block size-3 rounded-full",
                cell.tone === "strong"
                  ? "bg-nb-up"
                  : cell.tone === "weak"
                    ? "bg-nb-down"
                    : "bg-nb-wait",
              ].join(" ")}
            />
            <p className="mt-2 text-xs font-bold text-nb-text">{cell.label}</p>
            <p className="text-[10px] text-nb-muted">
              {cell.tone === "strong"
                ? "Strong"
                : cell.tone === "weak"
                  ? "Weak"
                  : "Neutral"}
            </p>
            <p className="mt-0.5 text-[10px] text-nb-faint">
              {DIRECTION_LABELS[cell.bias]}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
