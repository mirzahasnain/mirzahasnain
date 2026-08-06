"use client";

import { Pin, PinOff } from "lucide-react";
import { TERMINAL_COPY } from "@/lib/news-bias/modules/dashboard/copy";
import { WATCH_ASSETS } from "@/lib/news-bias/modules/watchlist";
import type { WatchAssetId } from "@/lib/news-bias/modules/types";

interface WatchlistPanelProps {
  pinned: WatchAssetId[];
  onToggle: (id: WatchAssetId) => void;
}

export function WatchlistPanel({ pinned, onToggle }: WatchlistPanelProps) {
  const set = new Set(pinned);

  return (
    <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
      <h2 className="text-sm font-semibold text-nb-text">
        {TERMINAL_COPY.watchlist.title}
      </h2>
      <p className="mt-1 text-xs text-nb-muted">{TERMINAL_COPY.watchlist.hint}</p>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {WATCH_ASSETS.map((asset) => {
          const active = set.has(asset.id);
          return (
            <li key={asset.id}>
              <button
                type="button"
                onClick={() => onToggle(asset.id)}
                aria-pressed={active}
                className={[
                  "flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border px-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70",
                  active
                    ? "border-nb-accent/50 bg-nb-accent/10 text-nb-text"
                    : "border-nb-border text-nb-muted hover:border-nb-border-strong",
                ].join(" ")}
              >
                {asset.label}
                {active ? (
                  <Pin aria-hidden className="size-3.5 text-nb-accent" />
                ) : (
                  <PinOff aria-hidden className="size-3.5" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
