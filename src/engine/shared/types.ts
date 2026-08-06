/**
 * Shared domain types for the TradeImpact Brain.
 * Structured results only — never plain strings as primary outputs.
 */

export type BiasDirection = "bullish" | "bearish" | "neutral";

export type SurpriseSign = "positive" | "negative" | "flat";

export type SurpriseStrength = "neutral" | "weak" | "moderate" | "strong" | "extreme";

export type ExpectedImpact = "very-low" | "low" | "medium" | "high" | "very-high";

export type VolatilityBand = "low" | "medium" | "high" | "extreme";

export type RiskLevel = "low" | "medium" | "high" | "very-high";

export type ReliabilityLevel = "very-low" | "low" | "medium" | "high" | "very-high";

export type TradeDecisionId =
  | "avoid"
  | "wait"
  | "aggressive-buy"
  | "conservative-buy"
  | "aggressive-sell"
  | "conservative-sell";

export type TradeAction = "buy" | "sell" | "wait";

export type NewsInterpretation = "higher_is_usd_bullish" | "higher_is_usd_bearish";

export type OutcomeTap = "beat" | "miss" | "in-line";

export interface NewsRule {
  id: string;
  label: string;
  importance: number;
  historicalReliability: number;
  interpretation: NewsInterpretation;
  toneMode: "numeric" | "hawkish_dovish";
  higherLabel: string;
  lowerLabel: string;
  riskWarning: string;
}

export interface BrainNewsInput {
  newsId: string;
  currency?: string;
  forecast: number | null;
  previous: number | null;
  actual: number | null;
  /** Fallback when numbers are missing. */
  outcome?: OutcomeTap | null;
  pairId: string;
  mode?: "pre_release" | "post_release";
}
