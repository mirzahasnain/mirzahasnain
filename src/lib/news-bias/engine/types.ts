import type {
  Direction,
  ExpectedImpact,
  NewsEventId,
  PairId,
  SurpriseSign,
  SurpriseStrength,
  TradeAction,
} from "../types/interfaces";

/** How a numeric surprise maps onto USD bias. */
export type NewsInterpretation =
  | "higher_is_usd_bullish"
  | "higher_is_usd_bearish";

export type ToneMode = "numeric" | "hawkish_dovish";

export interface NewsRule {
  id: NewsEventId;
  label: string;
  /** 0-100 — structural importance of the release. */
  importance: number;
  /** 0-100 — how often the typical reaction has held historically. */
  historicalReliability: number;
  interpretation: NewsInterpretation;
  toneMode: ToneMode;
  higherLabel: string;
  lowerLabel: string;
  riskWarning: string;
}

export type PairBiasMap = Record<PairId, Direction>;

export interface PairMappingsConfig {
  usdBullish: PairBiasMap;
  usdBearish: PairBiasMap;
  usdNeutral: PairBiasMap;
}

export interface StrengthThresholdRule {
  minAbsSurprise: number;
  minPctSurprise: number;
  strength: SurpriseStrength;
}

export interface MoveBand {
  min: number;
  max: number;
  label: string;
  extremeLabel?: string;
}

export interface PairExpectedMoves {
  unit: string;
  weak: MoveBand;
  moderate: MoveBand;
  strong: MoveBand;
  extreme: MoveBand;
}

export interface ImpactLevelsConfig {
  strengthThresholds: StrengthThresholdRule[];
  impactByStrength: Record<SurpriseStrength, ExpectedImpact>;
  confidenceWeights: {
    importance: number;
    surpriseSize: number;
    historicalReliability: number;
  };
  surpriseScoreByStrength: Record<SurpriseStrength, number>;
  expectedMoves: Partial<Record<PairId, PairExpectedMoves>>;
}

export interface HistoricalPairStat {
  averageMove: number;
  unit: string;
  winRate: number;
}

export interface HistoricalNewsStats {
  sampleSize: number;
  label: string;
  pairs: Partial<Record<PairId, HistoricalPairStat>>;
}

export type NewsRulesConfig = Record<string, NewsRule>;
export type HistoricalMovesConfig = Record<string, HistoricalNewsStats>;

export interface EngineDeps {
  newsRules: NewsRulesConfig;
  pairMappings: PairMappingsConfig;
  impactLevels: ImpactLevelsConfig;
  historicalMoves: HistoricalMovesConfig;
}

export interface DecisionInput {
  newsId: NewsEventId;
  /** ISO currency of the release; USD for the current tool set. */
  currency: string;
  forecast: number | null;
  previous: number | null;
  actual: number | null;
  /** Tapped outcome used until numbers are available. */
  outcome: SurpriseSign | null;
  pairId: PairId;
}

export interface SurpriseResult {
  /** Actual − Forecast. */
  difference: number | null;
  /** ((Actual − Forecast) / |Forecast|) × 100. */
  percentageSurprise: number | null;
  strength: SurpriseStrength;
  /** Positive / Negative / flat. */
  sign: SurpriseSign;
  impact: ExpectedImpact;
  isEstimate: boolean;
}

export interface ConfidenceResult {
  score: number;
  importance: number;
  surpriseSize: number;
  historicalReliability: number;
}

export interface ExpectedMoveResult {
  label: string;
  min: number | null;
  max: number | null;
  unit: string;
  isExtreme: boolean;
}

export interface HistoricalSnapshot {
  label: string;
  sampleSize: number;
  averageMove: number | null;
  unit: string | null;
  winRate: number | null;
  /** Highlight stats for key markets. */
  highlights: {
    pairId: PairId;
    name: string;
    averageMove: number;
    unit: string;
    winRate: number;
  }[];
}

export interface TradePlaybook {
  pairId: PairId;
  pairLabel: string;
  displayName: string;
  direction: TradeAction;
  bias: Direction;
  confidence: number;
  reason: string;
  expectedMove: ExpectedMoveResult | null;
}

export interface DecisionResult {
  usdDirection: Direction;
  pairDirection: Direction;
  action: TradeAction;
  surprise: SurpriseResult;
  confidence: ConfidenceResult;
  playbook: TradePlaybook;
  historical: HistoricalSnapshot | null;
  explanation: string[];
  riskWarning: string;
  summary: {
    recommendation: string;
    confidence: number;
    impact: ExpectedImpact;
    reason: string;
  };
  /** Direction map for every tracked pair under the current USD bias. */
  pairBiases: PairBiasMap;
}
