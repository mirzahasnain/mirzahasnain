/**
 * Global workspace search — news, pairs, watch assets, strategies.
 */
import { NEWS_EVENTS } from "../../news";
import { TRADING_PAIRS } from "../../pairs";
import { STRATEGY_CATALOG, WATCH_ASSETS } from "../preferences";
import type { SearchHit } from "../types";

export function searchWorkspace(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const hits: SearchHit[] = [];

  for (const asset of WATCH_ASSETS) {
    if (
      asset.label.toLowerCase().includes(q) ||
      asset.pairId.toLowerCase().includes(q) ||
      asset.id.includes(q)
    ) {
      hits.push({
        id: `asset:${asset.id}`,
        kind: "asset",
        label: asset.label,
        subtitle: asset.pairId,
        href: "/workspace#watchlist",
      });
    }
  }

  for (const news of NEWS_EVENTS) {
    const hay = `${news.label} ${news.shortLabel ?? ""} ${news.id}`.toLowerCase();
    if (hay.includes(q)) {
      hits.push({
        id: `news:${news.id}`,
        kind: "news",
        label: news.label,
        subtitle: news.description,
        href: `/news-bias?event=${encodeURIComponent(news.id)}`,
      });
    }
  }

  for (const pair of TRADING_PAIRS) {
    const hay = `${pair.label} ${pair.displayName} ${pair.keywords.join(" ")}`.toLowerCase();
    if (hay.includes(q)) {
      hits.push({
        id: `pair:${pair.id}`,
        kind: "pair",
        label: pair.displayName,
        subtitle: pair.label,
        href: `/news-bias?pair=${encodeURIComponent(pair.id)}`,
      });
    }
  }

  for (const strategy of STRATEGY_CATALOG) {
    if (strategy.toLowerCase().includes(q)) {
      hits.push({
        id: `strategy:${strategy}`,
        kind: "strategy",
        label: strategy,
        subtitle: "Strategy",
        href: "/workspace#favorites",
      });
    }
  }

  return hits.slice(0, 20);
}
