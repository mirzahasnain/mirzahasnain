import type {
  Direction,
  ExpectedImpact,
  ExportAction,
  NewsEventId,
  PairId,
  StrengthThreshold,
  SurpriseSign,
  SurpriseStrength,
  Theme,
  TradeAction,
} from "./types/interfaces";

export const APP = {
  title: "News Bias Tool",
  subtitle: "Three taps to a trading bias.",
  version: "Version 7.0",
  disclaimer: "Educational reference only. Not financial advice.",
} as const;

export const STEP_COPY = {
  news: { step: "01", title: "Economic news" },
  pair: { step: "02", title: "Trading pair" },
  outcome: { step: "03", title: "Result" },
  change: "Change",
} as const;

export const OUTCOME_OPTIONS: {
  sign: SurpriseSign;
  label: string;
  caption: string;
}[] = [
  { sign: "positive", label: "Actual > Forecast", caption: "Beat" },
  { sign: "negative", label: "Actual < Forecast", caption: "Miss" },
  { sign: "flat", label: "Actual = Forecast", caption: "In line" },
];

export const RESULT_COPY = {
  eyebrow: "Recommendation",
  confidence: "Confidence",
  impact: "Impact",
  estimate: "Estimate — add the release numbers for an exact reading",
  reset: "New analysis",
  risk: "Risk warning",
  expectedMove: "Expected move",
} as const;

/** One tap for the releases traders watch most. */
export const NEWS_PRESET_IDS: NewsEventId[] = [
  "cpi",
  "nfp",
  "fomc-statement",
  "interest-rate-decision",
  "ism-manufacturing-pmi",
];

export const FAVORITE_PAIR_IDS: PairId[] = [
  "XAUUSD",
  "XAGUSD",
  "BTCUSD",
  "EURUSD",
];

export const GROUP_LABELS = {
  presets: "Quick picks",
  favorites: "Favorites",
  allPairs: "All pairs",
} as const;

export const SEARCH_COPY = {
  label: "Search trading pairs",
  placeholder: "Search — try gold or bitcoin",
  clear: "Clear search",
  empty: "No pairs match that search.",
} as const;

export const RECENT_COPY = {
  title: "Recent",
  today: "Today",
  yesterday: "Yesterday",
  reopen: "Reopen this analysis",
} as const;

export const RECENT_LIMIT = 5;

export const SUMMARY_LABELS = {
  forecast: "Forecast",
  actual: "Actual",
  surprise: "Surprise",
} as const;

export const THEME_COPY = {
  toLight: "Switch to light mode",
  toDark: "Switch to dark mode",
} as const;

export const THEME_STORAGE_KEY = "news-bias:theme:v1";
export const DEFAULT_THEME: Theme = "dark";

export const DETAILS_COPY = {
  toggle: "More details",
  values: {
    title: "Release values",
    hint: "Optional. Real numbers replace the estimate with a measured strength and confidence.",
  },
  breakdown: { title: "Surprise" },
  playbook: { title: "Trade playbook" },
  historical: { title: "Historical statistics" },
  analysis: { title: "AI explanation" },
  risk: { title: "Risk warning" },
  assets: { title: "Assets affected" },
  exports: { title: "Export" },
  history: {
    title: "History",
    hint: "Your last 20 analyses, stored on this device.",
    clear: "Clear",
    reopen: "Reopen this analysis",
  },
} as const;

export const BREAKDOWN_LABELS = {
  surprise: "Difference",
  percentage: "% Surprise",
  reading: "Reading",
  strength: "Strength",
  impact: "Expected impact",
  previous: "vs Previous",
  pair: "Pair",
  news: "News",
  result: "Result",
} as const;

export const PLAYBOOK_LABELS = {
  direction: "Direction",
  confidence: "Confidence",
  bias: "Bias",
  reason: "Reason",
  expectedMove: "Expected reaction",
} as const;

export const HISTORICAL_LABELS = {
  averageMove: "Average move",
  winRate: "Win rate",
} as const;

export const FIELD_COPY = {
  forecast: { label: "Forecast", placeholder: "54.0" },
  previous: { label: "Previous", placeholder: "53.3" },
  actual: { label: "Actual", placeholder: "55.6" },
} as const;

export const EMPTY_VALUE = "—";

export const DIRECTION_LABELS: Record<Direction, string> = {
  bullish: "Bullish",
  bearish: "Bearish",
  neutral: "Neutral",
};

export const SURPRISE_SIGN_LABELS: Record<SurpriseSign, string> = {
  positive: "Positive Surprise",
  negative: "Negative Surprise",
  flat: "No Surprise",
};

/** How the release landed against the forecast. */
export const OUTCOME_LABELS: Record<SurpriseSign, string> = {
  positive: "Actual > Forecast",
  negative: "Actual < Forecast",
  flat: "Actual = Forecast",
};

export const STRENGTH_LABELS: Record<SurpriseStrength, string> = {
  neutral: "Neutral",
  weak: "Weak",
  moderate: "Moderate",
  strong: "Strong",
  extreme: "Extreme",
};

export const IMPACT_LABELS: Record<ExpectedImpact, string> = {
  "very-low": "Very Low",
  low: "Low",
  medium: "Medium",
  high: "High",
  "very-high": "Very High",
};

export const ACTION_LABELS: Record<TradeAction, string> = {
  buy: "BUY",
  sell: "SELL",
  wait: "WAIT",
};

export const EXPORT_LABELS: Record<ExportAction, string> = {
  copy: "Copy",
  txt: "Download TXT",
  pdf: "Download PDF",
  share: "Share",
};

export const EXPORT_FEEDBACK = {
  copy: "Copied",
  txt: "Saved",
  pdf: "Saved",
  share: "Shared",
  failed: "Failed",
} as const;

export const EXPORT_COPY = {
  documentTitle: "News Bias Analysis",
  fileBaseName: "news-bias-analysis",
  fields: {
    news: "News",
    pair: "Pair",
    result: "Result",
    forecast: "Forecast",
    previous: "Previous",
    actual: "Actual",
    surprise: "Surprise",
    strength: "Strength",
    impact: "Expected Impact",
    bias: "Bias",
    recommendation: "Recommended Bias",
    confidence: "Confidence",
    reason: "Reason",
    analysis: "Analysis",
  },
} as const;

/** Absolute surprise thresholds, highest first. */
export const STRENGTH_THRESHOLDS: StrengthThreshold[] = [
  { min: 2, strength: "extreme" },
  { min: 1, strength: "strong" },
  { min: 0.5, strength: "moderate" },
  { min: 0.2, strength: "weak" },
  { min: 0, strength: "neutral" },
];

export const IMPACT_BY_STRENGTH: Record<SurpriseStrength, ExpectedImpact> = {
  neutral: "very-low",
  weak: "low",
  moderate: "medium",
  strong: "high",
  extreme: "very-high",
};

export const CONFIDENCE_BY_STRENGTH: Record<SurpriseStrength, number> = {
  neutral: 40,
  weak: 55,
  moderate: 70,
  strong: 85,
  extreme: 95,
};

/**
 * Strength assumed when a trader taps a beat or miss without typing the
 * numbers: enough to act on, short of the confidence a measured surprise earns.
 */
export const QUICK_STRENGTH: SurpriseStrength = "moderate";

export const HISTORY_LIMIT = 20;
export const HISTORY_STORAGE_KEY = "news-bias:history:v2";
/** Wait for typing to settle before writing an entry. */
export const HISTORY_SAVE_DELAY_MS = 1500;

/** How long an export button shows its result. */
export const FEEDBACK_MS = 3000;
