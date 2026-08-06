"use client";

import { Star } from "lucide-react";
import { WORKSPACE_COPY } from "@/lib/news-bias/modules/dashboard/workspaceCopy";
import { WATCH_ASSETS } from "@/lib/news-bias/modules/watchlist";
import type { WatchAsset, WatchAssetId } from "@/lib/news-bias/modules/types";

interface WatchlistSectionProps {
  pinned: WatchAsset[];
  pinnedIds: WatchAssetId[];
  onToggle: (id: WatchAssetId) => void;
}

export function WatchlistSection({ pinned, pinnedIds, onToggle }: WatchlistSectionProps) {
  const set = new Set(pinnedIds);

  return (
    <section
      id="watchlist"
      aria-labelledby="watchlist-heading"
      className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4"
    >
      <h2 id="watchlist-heading" className="text-sm font-semibold text-nb-text">
        {WORKSPACE_COPY.sections.watchlist}
      </h2>
      <p className="mt-1 text-xs text-nb-muted">{WORKSPACE_COPY.watchlist.hint}</p>

      {pinned.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {pinned.map((asset) => (
            <li key={asset.id}>
              <button
                type="button"
                onClick={() => onToggle(asset.id)}
                aria-pressed="true"
                aria-label={`Unpin ${asset.label}`}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-nb-accent/40 bg-nb-accent/10 px-3 py-1.5 text-sm font-semibold text-nb-text focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
              >
                <Star aria-hidden className="size-3.5 fill-current text-nb-accent" />
                {asset.label}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p role="status" className="mt-3 text-sm text-nb-muted">
          {WORKSPACE_COPY.watchlist.empty}
        </p>
      )}

      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {WATCH_ASSETS.map((asset) => {
          const active = set.has(asset.id);
          return (
            <li key={asset.id}>
              <button
                type="button"
                onClick={() => onToggle(asset.id)}
                aria-pressed={active}
                aria-label={active ? `Unpin ${asset.label}` : `Pin ${asset.label}`}
                className={[
                  "flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border px-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70",
                  active
                    ? "border-nb-accent/50 bg-nb-accent/10 text-nb-text"
                    : "border-nb-border text-nb-muted hover:border-nb-border-strong",
                ].join(" ")}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Star
                    aria-hidden
                    className={[
                      "size-3.5",
                      active ? "fill-current text-nb-accent" : "",
                    ].join(" ")}
                  />
                  {asset.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
