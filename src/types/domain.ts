/**
 * Central shared domain types for TradeImpact foundation.
 * Implementation-rich types continue to live under lib/news-bias;
 * this module is the stable import surface for new code.
 */
export type {
  NewsEventId,
  PairId,
  PairCategory,
  UsdRelation,
  Direction,
  SurpriseSign,
  SurpriseStrength,
  ExpectedImpact,
  TradeAction,
  Theme,
  NewsEvent,
  TradingPair,
  ReleaseValues,
} from "@/lib/news-bias/types/interfaces";

export type {
  EconomicEvent,
  HistoricalEconomicEvent,
  ProviderConfig,
  EventImpact,
} from "@/lib/news-bias/types/event";

/** Public decision enum (PRD / ENGINE). */
export type TradeDecisionId =
  | "avoid"
  | "wait"
  | "aggressive-buy"
  | "conservative-buy"
  | "aggressive-sell"
  | "conservative-sell";

export type ReliabilityBand = "very-low" | "low" | "medium" | "high" | "very-high";

export type RiskLevel = "low" | "medium" | "high" | "very-high";

export type BiasDirection = "Bullish" | "Bearish" | "Neutral";

export interface AnalysisRequest {
  newsId: string;
  pairId: string;
  forecast?: number | null;
  previous?: number | null;
  actual?: number | null;
  outcome?: "beat" | "miss" | "in-line";
}

export interface ApiErrorBody {
  ok: false;
  error: string;
  code?: string;
  retryable?: boolean;
  requestId?: string;
}

export interface ApiSuccessBody<T> {
  ok: true;
  provider?: string;
  fallback?: boolean;
  data: T;
}

export type ApiEnvelope<T> = ApiSuccessBody<T> | ApiErrorBody;
