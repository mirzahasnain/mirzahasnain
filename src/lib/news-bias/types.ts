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

export type ReleaseOutcome = "above" | "below";

export type Bias = "bullish" | "bearish";

/** How far the actual landed from the forecast. Selected manually in V2. */
export type DeviationSize = "inline" | "small" | "medium" | "large";

export type ImpactStrength = "weak" | "moderate" | "strong" | "very-strong";

export type Confidence = "low" | "medium" | "high" | "very-high";

export interface NewsEvent {
  id: NewsEventId;
  label: string;
  /** Short context line shown under the selection. */
  description: string;
  /** How the market reads the print, keyed by outcome. */
  explanation: Record<ReleaseOutcome, string>;
}

export interface TradingPair {
  id: PairId;
  label: string;
  /** Trader-facing name, used in the affected assets grid and explanations. */
  displayName: string;
  category: PairCategory;
  usdRelation: UsdRelation;
  /** Short context line shown under the selection. */
  description: string;
}

export interface AffectedAsset {
  id: PairId;
  name: string;
  bias: Bias;
  isSelected: boolean;
}

export interface BiasVerdict {
  event: NewsEvent;
  pair: TradingPair;
  outcome: ReleaseOutcome;
  usdBias: Bias;
  pairBias: Bias;
  rationale: string;
}

export interface BiasAnalysis extends BiasVerdict {
  deviation: DeviationSize;
  strength: ImpactStrength;
  confidence: Confidence;
  reason: string;
  /** One sentence per line, shown in the market explanation card. */
  explanation: string[];
  affectedAssets: AffectedAsset[];
}

export interface DropdownOption<TValue extends string> {
  value: TValue;
  label: string;
  description?: string;
}
