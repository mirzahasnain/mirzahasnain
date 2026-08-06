"use client";

import Link from "next/link";
import { TERMINAL_COPY } from "@/lib/news-bias/modules/dashboard/copy";
import type { LiveFeedItem } from "@/lib/news-bias/modules/types";
import { formatCalendarNumber } from "@/lib/news-bias/calendar/utils/format";
import { DIRECTION_LABELS } from "@/lib/news-bias/constants";

interface LiveNewsFeedProps {
  items: LiveFeedItem[];
}

export function LiveNewsFeed({ items }: LiveNewsFeedProps) {
  return (
    <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
      <h2 className="text-sm font-semibold text-nb-text">{TERMINAL_COPY.feed.title}</h2>
      <ul className="mt-3 divide-y divide-nb-border">
        {items.map((item) => (
          <li key={item.id} className="py-3">
            <div className="flex items-start gap-3">
              <time className="w-14 shrink-0 font-mono text-xs tabular-nums text-nb-accent">
                {item.timeLabel}
              </time>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/event/${item.id}`}
                  className="text-sm font-bold text-nb-text hover:text-nb-accent"
                >
                  {item.name}
                  <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-nb-faint">
                    {item.status}
                  </span>
                </Link>
                <dl className="mt-2 grid grid-cols-4 gap-1 text-center text-[11px]">
                  <Stat label="Forecast" value={formatCalendarNumber(item.forecast)} />
                  <Stat label="Prev" value={formatCalendarNumber(item.previous)} />
                  <Stat label="Actual" value={formatCalendarNumber(item.actual)} />
                  <Stat
                    label="Surprise"
                    value={
                      item.surprise === null
                        ? "—"
                        : item.surprise > 0
                          ? `+${item.surprise}`
                          : String(item.surprise)
                    }
                  />
                </dl>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.assetBiases.slice(0, 4).map((a) => (
                    <span
                      key={a.label}
                      className={[
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        a.bias === "bearish"
                          ? "bg-nb-down/15 text-nb-down"
                          : a.bias === "bullish"
                            ? "bg-nb-up/15 text-nb-up"
                            : "bg-nb-elevated text-nb-muted",
                      ].join(" ")}
                    >
                      {a.label} {DIRECTION_LABELS[a.bias]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-nb-elevated/50 px-1 py-1.5">
      <dt className="text-[9px] uppercase tracking-wider text-nb-faint">{label}</dt>
      <dd className="font-mono tabular-nums text-nb-text-soft">{value}</dd>
    </div>
  );
}
