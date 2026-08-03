import type {
  Direction,
  ExpectedImpact,
  ExportAction,
  StrengthThreshold,
  SurpriseSign,
  SurpriseStrength,
  TradeAction,
} from "./types/interfaces";

export const APP = {
  title: "News Bias Tool",
  subtitle: "Select a News Event, Trading Pair and Result",
  badge: "Trading Bias",
  version: "Version 3.0",
  disclaimer: "Educational reference only. Not financial advice.",
} as const;

export const SECTION_COPY = {
  news: {
    step: "01",
    title: "Economic News",
    placeholder: "Select an economic news event",
    label: "Economic news event",
  },
  pair: {
    step: "02",
    title: "Trading Pair",
    placeholder: "Select a trading pair",
    label: "Trading pair",
  },
  release: {
    step: "03",
    title: "Result",
    readyHint: "Direction and strength are calculated from these values.",
    waitingHint: "Select a news event and trading pair first.",
  },
} as const;

export const FIELD_COPY = {
  forecast: { label: "Forecast", placeholder: "54.0" },
  previous: { label: "Previous", placeholder: "53.3" },
  actual: { label: "Actual", placeholder: "55.6" },
} as const;

export const CARD_COPY = {
  result: {
    eyebrow: "Expected Bias",
    usdPrefix: "USD",
    reset: "New selection",
    labels: { news: "News", pair: "Pair", result: "Result" },
  },
  surprise: {
    title: "Surprise",
    labels: {
      surprise: "Surprise",
      reading: "Reading",
      strength: "Strength",
      impact: "Expected Market Impact",
      previous: "vs Previous",
    },
  },
  decision: {
    title: "Trade Decision",
    labels: {
      pair: "Pair",
      recommendation: "Recommended Bias",
      confidence: "Confidence",
      reason: "Reason",
    },
  },
  analysis: { title: "Full Analysis" },
  assets: { title: "Assets Affected" },
  history: {
    title: "History",
    hint: "Your last 20 analyses, stored on this device.",
    clear: "Clear",
    reopen: "Reopen this analysis",
  },
} as const;

export const EMPTY_STATE = {
  waiting: "Your bias will appear here.",
  missingValues: "Enter a forecast and an actual value to run the analysis.",
} as const;

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

export const HISTORY_LIMIT = 20;
export const HISTORY_STORAGE_KEY = "news-bias:history:v1";
/** Wait for typing to settle before writing an entry. */
export const HISTORY_SAVE_DELAY_MS = 1500;

/** How long an export button shows its result. */
export const FEEDBACK_MS = 3000;
