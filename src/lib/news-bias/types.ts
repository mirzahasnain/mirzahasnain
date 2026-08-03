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

export type NewsEvent = {
  id: NewsEventId;
  label: string;
  /** Short context line shown under the selection. */
  description: string;
};

export type TradingPair = {
  id: PairId;
  label: string;
  category: PairCategory;
  usdRelation: UsdRelation;
  /** Short context line shown under the selection. */
  description: string;
};

export type BiasVerdict = {
  event: NewsEvent;
  pair: TradingPair;
  outcome: ReleaseOutcome;
  usdBias: Bias;
  pairBias: Bias;
  rationale: string;
};

export type DropdownOption<TValue extends string> = {
  value: TValue;
  label: string;
  description?: string;
};
