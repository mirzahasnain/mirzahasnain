"use client";

import { WORKSPACE_COPY } from "@/lib/news-bias/modules/dashboard/workspaceCopy";
import {
  STRATEGY_CATALOG,
  WATCH_ASSETS,
} from "@/lib/news-bias/modules/preferences";
import { NEWS_EVENTS } from "@/lib/news-bias/news";
import type { UserPreferences, WatchAssetId } from "@/lib/news-bias/modules/types";
import type { NewsEventId } from "@/lib/news-bias/types/interfaces";

interface FavoritesPanelProps {
  prefs: UserPreferences;
  onToggleNews: (id: NewsEventId) => void;
  onToggleAsset: (id: WatchAssetId) => void;
  onToggleStrategy: (strategy: string) => void;
}

export function FavoritesPanel({
  prefs,
  onToggleNews,
  onToggleAsset,
  onToggleStrategy,
}: FavoritesPanelProps) {
  return (
    <section
      id="favorites"
      className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4"
    >
      <h2 className="text-sm font-semibold text-nb-text">
        {WORKSPACE_COPY.sections.favorites}
      </h2>

      <Group title={WORKSPACE_COPY.favorites.news}>
        {NEWS_EVENTS.slice(0, 8).map((event) => {
          const active = prefs.favoriteNews.includes(event.id);
          return (
            <Chip
              key={event.id}
              active={active}
              label={event.shortLabel ?? event.label}
              onClick={() => onToggleNews(event.id)}
            />
          );
        })}
      </Group>

      <Group title={WORKSPACE_COPY.favorites.pairs}>
        {WATCH_ASSETS.map((asset) => {
          const active = prefs.favoriteAssets.includes(asset.id);
          return (
            <Chip
              key={asset.id}
              active={active}
              label={asset.label}
              onClick={() => onToggleAsset(asset.id)}
            />
          );
        })}
      </Group>

      <Group title={WORKSPACE_COPY.favorites.strategies}>
        {STRATEGY_CATALOG.map((strategy) => {
          const active = prefs.favoriteStrategies.includes(strategy);
          return (
            <Chip
              key={strategy}
              active={active}
              label={strategy}
              onClick={() => onToggleStrategy(strategy)}
            />
          );
        })}
      </Group>
    </section>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-nb-faint">
        {title}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1.5 text-xs font-semibold",
        active
          ? "border-nb-accent/50 bg-nb-accent/10 text-nb-text"
          : "border-nb-border text-nb-muted",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
