/**
 * Settings module — workspace preferences facade.
 * Persistence stays in localStorage via the preferences module.
 */
import {
  DEFAULT_PREFERENCES,
  loadPreferences,
  savePreferences,
  STRATEGY_CATALOG,
  toggleFavoriteAsset,
  toggleFavoriteNews,
  toggleFavoriteStrategy,
} from "../preferences";
import type { UserPreferences, WorkspaceLanguage } from "../types";
import type { NewsEventId, PairId, Theme } from "../../types/interfaces";

export const LANGUAGE_OPTIONS: { id: WorkspaceLanguage; label: string }[] = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "de", label: "Deutsch" },
  { id: "fr", label: "Français" },
  { id: "ja", label: "日本語" },
];

export {
  DEFAULT_PREFERENCES,
  loadPreferences,
  savePreferences,
  STRATEGY_CATALOG,
  toggleFavoriteAsset,
  toggleFavoriteNews,
  toggleFavoriteStrategy,
};

export function updateTheme(
  prefs: UserPreferences,
  theme: Theme,
): UserPreferences {
  return savePreferences({ ...prefs, theme });
}

export function updateLanguage(
  prefs: UserPreferences,
  language: WorkspaceLanguage,
): UserPreferences {
  return savePreferences({ ...prefs, language });
}

export function updateDefaultPair(
  prefs: UserPreferences,
  defaultPair: PairId,
): UserPreferences {
  return savePreferences({ ...prefs, defaultPair });
}

export function updateDefaultNews(
  prefs: UserPreferences,
  defaultNews: NewsEventId,
): UserPreferences {
  return savePreferences({ ...prefs, defaultNews });
}

export function updateNotificationPrefs(
  prefs: UserPreferences,
  patch: Partial<UserPreferences["notifications"]>,
): UserPreferences {
  return savePreferences({
    ...prefs,
    notifications: { ...prefs.notifications, ...patch },
  });
}
