import type {
  Bias,
  Confidence,
  DeviationSize,
  ImpactStrength,
  ReleaseOutcome,
} from "./types";

export const APP = {
  title: "News Bias Tool",
  subtitle: "Select a News Event, Trading Pair and Result",
  version: "Version 2.0",
  tagline: "Instant directional bias for high-impact USD economic releases.",
} as const;

export const OUTCOME_LABELS: Record<ReleaseOutcome, string> = {
  above: "Actual > Forecast",
  below: "Actual < Forecast",
};

export const BIAS_LABELS: Record<Bias, string> = {
  bullish: "Bullish",
  bearish: "Bearish",
};

/** A miss reads differently from a beat, so labels depend on the outcome. */
export const DEVIATION_LABELS: Record<
  ReleaseOutcome,
  Record<DeviationSize, string>
> = {
  above: {
    inline: "In Line",
    small: "Small Beat",
    medium: "Medium Beat",
    large: "Large Beat",
  },
  below: {
    inline: "In Line",
    small: "Small Miss",
    medium: "Medium Miss",
    large: "Large Miss",
  },
};

export const STRENGTH_LABELS: Record<ImpactStrength, string> = {
  weak: "Weak",
  moderate: "Moderate",
  strong: "Strong",
  "very-strong": "Very Strong",
};

export const CONFIDENCE_LABELS: Record<Confidence, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  "very-high": "Very High",
};

/** Deviation the tool assumes until the trader picks one. */
export const DEFAULT_DEVIATION: DeviationSize = "medium";
