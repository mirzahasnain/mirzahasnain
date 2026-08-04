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

export type ExportAction = "copy" | "txt" | "pdf" | "share";

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
}

export interface Analysis extends AnalysisContext {
  /** One-line justification for the trade decision. */
  reason: string;
  /** Full analysis, one sentence per line. */
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
