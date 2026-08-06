/**
 * Shared non-secret constants (PRD-aligned).
 */
export const STORAGE_KEYS = {
  theme: "nb-theme",
  watchlist: "ti-watchlist-v1",
  settings: "ti-settings-v1",
  journal: "ti-journal-v1",
  analysisHistory: "nb-history",
  notifications: "ti-notifications-v1",
} as const;

export const LIMITS = {
  /** Soft client guidance only until auth + server quotas exist (Architecture Review). */
  freeWatchlistSoftMax: 50,
  historyLocalMax: 40,
  journalLocalMax: 100,
  releaseWindowPollMs: 15_000,
  defaultCacheTtlMs: 60_000,
  providerMaxRetries: 3,
} as const;

export const SCORE_WEIGHTS = {
  historicalMatch: 0.3,
  surpriseStrength: 0.25,
  newsImportance: 0.2,
  marketCorrelation: 0.15,
  volatility: 0.1,
  version: "scoreWeights.v1",
} as const;

export const ALERT_OFFSETS_MINUTES = [15, 5, 0] as const;

export const DISCLAIMER_SHORT = "Educational decision support. Not financial advice.";
