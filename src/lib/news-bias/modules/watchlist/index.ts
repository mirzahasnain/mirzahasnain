import { WATCH_ASSETS } from "../preferences";
import type { UserPreferences, WatchAsset, WatchAssetId } from "../types";

/** Watchlist module — pins assets; dashboard shows pinned set only. */
export function getPinnedAssets(prefs: UserPreferences): WatchAsset[] {
  const set = new Set(prefs.watchlist);
  return WATCH_ASSETS.filter((asset) => set.has(asset.id));
}

export function isPinned(prefs: UserPreferences, id: WatchAssetId): boolean {
  return prefs.watchlist.includes(id);
}

/** Primary desk assets highlighted in copy examples. */
export const PRIMARY_WATCH_IDS: WatchAssetId[] = [
  "gold",
  "silver",
  "btc",
  "eurusd",
];

export { WATCH_ASSETS };
