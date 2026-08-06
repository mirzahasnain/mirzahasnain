export type NewsEventId =
  | "cpi"
  | "core-cpi"
  | "ppi"
  | "core-ppi"
  | "nfp"
  | "unemployment-rate"
  | "interest-rate-decision"
  | "fomc-statement"
  | "ism-manufacturing-pmi"
  | "ism-services-pmi"
  | "gdp"
  | "retail-sales"
  | "core-pce";

export type PairId =
  | "XAUUSD"
  | "XAGUSD"
  | "EURUSD"
  | "GBPUSD"
  | "USDJPY"
  | "AUDUSD"
  | "NZDUSD"
  | "USDCAD"
  | "USDCHF"
  | "BTCUSD"
  | "ETHUSD"
  | "NAS100"
  | "US30"
  | "SPX500";

export type PairCategory = "metal" | "forex" | "crypto" | "index";

/**
 * How a pair moves when the US dollar strengthens.
 * `direct` — the dollar is the base currency, so USD strength lifts the pair.
 * `inverse` — the dollar is the quote currency (or the pair is a risk asset),
 * so USD strength weighs on the pair.
 */
export type UsdRelation = "direct" | "inverse";

export type Direction = "bullish" | "bearish" | "neutral";

export type SurpriseSign = "positive" | "negative" | "flat";

export type SurpriseStrength =
  | "neutral"
  | "weak"
  | "moderate"
  | "strong"
  | "extreme";

export type ExpectedImpact = "very-low" | "low" | "medium" | "high" | "very-high";

export type TradeAction = "buy" | "sell" | "wait";

export type ExportAction = "copy" | "txt" | "pdf" | "csv" | "share";

export type ShareResult = "shared" | "copied" | "dismissed" | "failed";

export type Theme = "dark" | "light";

/** A labelled block of options inside a picker, e.g. favourites then the rest. */
export interface OptionSection<TValue extends string> {
  id: string;
  label?: string;
  options: DropdownOption<TValue>[];
}

export interface RecentGroup {
  label: string;
  entries: HistoryEntry[];
}

export interface NewsEvent {
  id: NewsEventId;
  label: string;
  /** Compact label for the quick-pick row, when the full name is too long. */
  shortLabel?: string;
  /** Short context line shown under the selection. */
  description: string;
  /** What the print means for the dollar, keyed by the sign of the surprise. */
  dollarEffect: Record<Exclude<SurpriseSign, "flat">, string>;
}

export interface TradingPair {
  id: PairId;
  label: string;
  /** Trader-facing name, used in analysis text and the affected assets grid. */
  displayName: string;
  category: PairCategory;
  usdRelation: UsdRelation;
  /** Short context line shown under the selection. */
  description: string;
  /** Extra search terms, so "gold" finds XAUUSD. */
  keywords: string[];
}

/** The three numbers a trader reads off the release. */
export interface ReleaseValues {
  forecast: number;
  previous: number | null;
  actual: number;
}

export interface SurpriseReading {
  /** Actual minus forecast, or null when the trader only tapped an outcome. */
  value: number | null;
  /** Percentage surprise vs |forecast|, when measurable. */
  percentage: number | null;
  sign: SurpriseSign;
  strength: SurpriseStrength;
  impact: ExpectedImpact;
  /** Confidence in the bias, 0-100. */
  confidence: number;
  /** True when the strength is assumed rather than measured. */
  isEstimate: boolean;
}

export interface AffectedAsset {
  id: PairId;
  name: string;
  direction: Direction;
  isSelected: boolean;
}

export interface ExpectedMoveView {
  label: string;
  min: number | null;
  max: number | null;
  unit: string;
  isExtreme: boolean;
}

export interface HistoricalStatsView {
  label: string;
  sampleSize: number;
  averageMove: number | null;
  unit: string | null;
  winRate: number | null;
  highlights: {
    pairId: PairId;
    name: string;
    averageMove: number;
    unit: string;
    winRate: number;
  }[];
}

export interface TradePlaybookView {
  pairId: PairId;
  pairLabel: string;
  displayName: string;
  direction: TradeAction;
  bias: Direction;
  confidence: number;
  reason: string;
  expectedMove: ExpectedMoveView | null;
}

export interface DecisionSummaryView {
  recommendation: string;
  confidence: number;
  impact: ExpectedImpact;
  reason: string;
}

/** Version 8 historical intelligence snapshot attached to an analysis. */
export interface HistoricalIntelligenceView {
  newsId: NewsEventId;
  newsLabel: string;
  sampleSize: number;
  surprise: number | null;
  surpriseSign: SurpriseSign;
  band: { min: number; max: number } | null;
  confidenceScore: number;
  summary: string[];
  assets: {
    key: string;
    label: string;
    unit: string;
    down: number;
    up: number;
    flat: number;
    bearishProbability: number;
    bullishProbability: number;
    averageMove: number;
    averageAbsMove: number;
  }[];
  matches: {
    date: string;
    forecast: number;
    actual: number;
    previous: number;
    surprise: number;
    score: number;
    gold_move: number;
    silver_move: number;
    eurusd_move: number;
    gbpusd_move: number;
    btc_move: number;
    eth_move: number;
    nasdaq_move: number;
    us30_move: number;
    direction: string;
  }[];
  timeline: {
    date: string;
    forecast: number;
    actual: number;
    previous: number;
    surprise: number;
    gold_move: number;
    silver_move: number;
    eurusd_move: number;
    gbpusd_move: number;
    btc_move: number;
    eth_move: number;
    nasdaq_move: number;
    us30_move: number;
    direction: string;
  }[];
  chart: {
    dates: string[];
    forecast: number[];
    previous: number[];
    actual: number[];
    surprise: number[];
  };
}

/** Version 13 TradeImpact Intelligence Engine view for React. */
export interface TradeImpactIntelligenceView {
  scoreTotal: number;
  scoreBreakdown: {
    historicalMatch: number;
    surpriseStrength: number;
    newsImportance: number;
    marketCorrelation: number;
    volatility: number;
  };
  reliabilityLabel: string;
  decisionLabel: string;
  decisionId: string;
  narrative: string[];
  historicalSimilar: string;
  averageMoves: { label: string; display: string }[];
  scenarios: { label: string; display: string }[];
  riskLabel: string;
  riskWhy: string;
  correlation: { label: string; move: string }[];
  why: { title: string; detail: string }[];
  decisionTree: { label: string; summary: string; detail: string }[];
  volatilityLabel: string;
}

/** Everything the decision engine derives before any prose is generated. */
export interface AnalysisContext {
  event: NewsEvent;
  pair: TradingPair;
  /** Present only once the trader has entered the release numbers. */
  values: ReleaseValues | null;
  surprise: SurpriseReading;
  usdDirection: Direction;
  pairDirection: Direction;
  action: TradeAction;
  affectedAssets: AffectedAsset[];
  playbook: TradePlaybookView;
  historical: HistoricalStatsView | null;
  /** Version 8 similar-event intelligence (null when no history file). */
  historicalIntelligence: HistoricalIntelligenceView | null;
  /** Version 13 TradeImpact Intelligence Engine snapshot. */
  intelligence: TradeImpactIntelligenceView;
  riskWarning: string;
  summary: DecisionSummaryView;
}

export interface Analysis extends AnalysisContext {
  /** One-line justification for the trade decision. */
  reason: string;
  /** Full analysis / AI explanation, one sentence per line. */
  analysisLines: string[];
}

/** One labelled row of an exported analysis, shared by every export format. */
export interface AnalysisField {
  label: string;
  value: string;
}

export interface AnalysisRequest {
  eventId: NewsEventId | null;
  pairId: PairId | null;
  /** Tapped outcome, used until exact values are entered. */
  outcome: SurpriseSign | null;
  forecast: number | null;
  previous: number | null;
  actual: number | null;
}

export interface HistoryValues {
  eventId: NewsEventId;
  pairId: PairId;
  outcome: SurpriseSign | null;
  forecast: number | null;
  previous: number | null;
  actual: number | null;
}

export interface HistoryEntry extends HistoryValues {
  id: string;
  savedAt: number;
}

export interface DropdownOption<TValue extends string> {
  value: TValue;
  label: string;
  description?: string;
}

export interface StrengthThreshold {
  /** Inclusive lower bound on the absolute surprise. */
  min: number;
  strength: SurpriseStrength;
}
