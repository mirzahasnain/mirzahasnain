import { WATCH_ASSETS } from "../preferences";
import type { UserPreferences, WatchAsset, WatchAssetId } from "../types";

/** Watchlist module — pins assets; news feed filters to pinned set. */
export function getPinnedAssets(prefs: UserPreferences): WatchAsset[] {
  const set = new Set(prefs.watchlist);
  return WATCH_ASSETS.filter((asset) => set.has(asset.id));
}

export function isPinned(prefs: UserPreferences, id: WatchAssetId): boolean {
  return prefs.watchlist.includes(id);
}

export { WATCH_ASSETS };
