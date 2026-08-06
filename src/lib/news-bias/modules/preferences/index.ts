import type { NewsEventId, PairId, Theme } from "../../types/interfaces";
import type {
  UserPreferences,
  WatchAsset,
  WatchAssetId,
  WorkspaceLanguage,
} from "../types";

export const PREFERENCES_STORAGE_KEY = "news-bias:preferences:v1";

export const WATCH_ASSETS: WatchAsset[] = [
  { id: "gold", label: "Gold", pairId: "XAUUSD", category: "metal" },
  { id: "silver", label: "Silver", pairId: "XAGUSD", category: "metal" },
  { id: "btc", label: "BTC", pairId: "BTCUSD", category: "crypto" },
  { id: "eurusd", label: "EURUSD", pairId: "EURUSD", category: "forex" },
  { id: "gbpusd", label: "GBPUSD", pairId: "GBPUSD", category: "forex" },
  { id: "nasdaq", label: "NASDAQ", pairId: "NAS100", category: "index" },
];

export const STRATEGY_CATALOG = [
  "Breakout",
  "Fade the spike",
  "Wait confirmation",
  "Trend follow",
] as const;

export const DEFAULT_PREFERENCES: UserPreferences = {
  favoriteAssets: ["gold", "silver", "btc", "eurusd"],
  favoriteNews: ["cpi", "nfp", "fomc-statement", "interest-rate-decision"],
  favoriteStrategies: ["Wait confirmation", "Fade the spike"],
  theme: "dark",
  language: "en",
  defaultPair: "XAUUSD",
  defaultNews: "cpi",
  notifications: {
    enabled: true,
    minutesBefore: [15, 5, 0],
    upcoming: true,
    released: true,
    analysisReady: true,
  },
  watchlist: ["gold", "silver", "btc", "eurusd"],
};

export function loadPreferences(): UserPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<UserPreferences>;
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
      notifications: {
        ...DEFAULT_PREFERENCES.notifications,
        ...(parsed.notifications ?? {}),
      },
      favoriteAssets: parsed.favoriteAssets ?? DEFAULT_PREFERENCES.favoriteAssets,
      favoriteNews: parsed.favoriteNews ?? DEFAULT_PREFERENCES.favoriteNews,
      favoriteStrategies:
        parsed.favoriteStrategies ?? DEFAULT_PREFERENCES.favoriteStrategies,
      watchlist: parsed.watchlist ?? DEFAULT_PREFERENCES.watchlist,
      theme: (parsed.theme as Theme) ?? DEFAULT_PREFERENCES.theme,
      language:
        (parsed.language as WorkspaceLanguage) ?? DEFAULT_PREFERENCES.language,
      defaultPair:
        (parsed.defaultPair as PairId) ?? DEFAULT_PREFERENCES.defaultPair,
      defaultNews:
        (parsed.defaultNews as NewsEventId) ?? DEFAULT_PREFERENCES.defaultNews,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): UserPreferences {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
  }
  return prefs;
}

export function toggleWatchAsset(
  prefs: UserPreferences,
  assetId: WatchAssetId,
): UserPreferences {
  const has = prefs.watchlist.includes(assetId);
  const watchlist = has
    ? prefs.watchlist.filter((id) => id !== assetId)
    : [...prefs.watchlist, assetId];
  return savePreferences({ ...prefs, watchlist });
}

export function toggleFavoriteNews(
  prefs: UserPreferences,
  newsId: NewsEventId,
): UserPreferences {
  const has = prefs.favoriteNews.includes(newsId);
  const favoriteNews = has
    ? prefs.favoriteNews.filter((id) => id !== newsId)
    : [...prefs.favoriteNews, newsId];
  return savePreferences({ ...prefs, favoriteNews });
}

export function toggleFavoriteAsset(
  prefs: UserPreferences,
  assetId: WatchAssetId,
): UserPreferences {
  const has = prefs.favoriteAssets.includes(assetId);
  const favoriteAssets = has
    ? prefs.favoriteAssets.filter((id) => id !== assetId)
    : [...prefs.favoriteAssets, assetId];
  return savePreferences({ ...prefs, favoriteAssets });
}

export function toggleFavoriteStrategy(
  prefs: UserPreferences,
  strategy: string,
): UserPreferences {
  const has = prefs.favoriteStrategies.includes(strategy);
  const favoriteStrategies = has
    ? prefs.favoriteStrategies.filter((s) => s !== strategy)
    : [...prefs.favoriteStrategies, strategy];
  return savePreferences({ ...prefs, favoriteStrategies });
}

export function pairIdForWatchAsset(assetId: WatchAssetId): PairId {
  return WATCH_ASSETS.find((a) => a.id === assetId)?.pairId ?? "XAUUSD";
}
