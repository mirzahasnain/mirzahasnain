"use client";

import { DIRECTION_LABELS } from "@/lib/news-bias/constants";
import { TERMINAL_COPY } from "@/lib/news-bias/modules/dashboard/copy";
import type { MarketBiasSnapshot } from "@/lib/news-bias/modules/types";

interface SmartBiasStripProps {
  bias: MarketBiasSnapshot;
}

export function SmartBiasStrip({ bias }: SmartBiasStripProps) {
  const rows = [
    { label: TERMINAL_COPY.smart.usd, value: bias.usd },
    { label: TERMINAL_COPY.smart.gold, value: bias.gold },
    { label: TERMINAL_COPY.smart.silver, value: bias.silver },
    { label: TERMINAL_COPY.smart.crypto, value: bias.crypto },
    { label: TERMINAL_COPY.smart.indices, value: bias.indices },
  ] as const;

  return (
    <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-nb-text">
          {TERMINAL_COPY.smart.title}
        </h2>
        <p className="text-[11px] text-nb-faint">
          {bias.sourceEventLabel ? `Via ${bias.sourceEventLabel}` : "Waiting"}
        </p>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {rows.map((row) => (
          <li
            key={row.label}
            className="rounded-xl bg-nb-elevated/60 px-3 py-2.5 text-center"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-nb-faint">
              {row.label}
            </p>
            <p
              className={[
                "mt-1 text-sm font-bold",
                row.value === "bullish"
                  ? "text-nb-up"
                  : row.value === "bearish"
                    ? "text-nb-down"
                    : "text-nb-flat",
              ].join(" ")}
            >
              {DIRECTION_LABELS[row.value]}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
