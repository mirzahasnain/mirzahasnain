/**
 * TradeImpact Intelligence Engine — shared view models (Version 13).
 */

import type {
  Direction,
  ExpectedImpact,
  PairId,
  SurpriseStrength,
  TradeAction,
} from "../../types/interfaces";

export type ReliabilityLevel =
  | "very-low"
  | "low"
  | "medium"
  | "high"
  | "very-high";

export type IntelligenceRiskLevel = "low" | "medium" | "high" | "very-high";

export type TradeDecisionId =
  | "avoid"
  | "wait"
  | "aggressive-buy"
  | "conservative-buy"
  | "aggressive-sell"
  | "conservative-sell";

export type DecisionTreeStepId =
  | "news"
  | "surprise"
  | "history"
  | "correlation"
  | "volatility"
  | "confidence"
  | "recommendation";

export type CorrelationMove = "up" | "down" | "flat";

export interface ScoreBreakdown {
  historicalMatch: number;
  surpriseStrength: number;
  newsImportance: number;
  marketCorrelation: number;
  volatility: number;
}

export interface TradeImpactScore {
  /** 0–100 TradeImpact Score™ */
  total: number;
  breakdown: ScoreBreakdown;
  weights: ScoreBreakdown;
}

export interface ReliabilityMeter {
  level: ReliabilityLevel;
  label: string;
  score: number;
}

export interface HistoricalMatchSnapshot {
  similarFound: number;
  similarOf: number;
  averageMoves: {
    pairId: PairId | string;
    label: string;
    averageMove: number;
    unit: string;
  }[];
  winRatePct: number | null;
}

export interface CorrelationLink {
  pairId: string;
  label: string;
  move: CorrelationMove;
}

export interface CorrelationSnapshot {
  usdDirection: Direction;
  links: CorrelationLink[];
  /** 0–100 how well selected pair aligns with the USD map */
  alignmentScore: number;
}

export interface ScenarioCase {
  id: "best" | "expected" | "worst";
  label: string;
  move: number;
  unit: string;
  display: string;
}

export interface ScenarioSnapshot {
  assetLabel: string;
  pairId: string;
  cases: ScenarioCase[];
}

export interface RiskAssessment {
  level: IntelligenceRiskLevel;
  label: string;
  why: string;
  score: number;
}

export interface TradeDecision {
  id: TradeDecisionId;
  label: string;
  action: TradeAction;
  aggression: "none" | "aggressive" | "conservative";
}

export interface DecisionTreeStep {
  id: DecisionTreeStepId;
  label: string;
  summary: string;
  detail: string;
}

export interface WhyFactor {
  id: string;
  title: string;
  detail: string;
}

export interface TradeImpactIntelligence {
  score: TradeImpactScore;
  reliability: ReliabilityMeter;
  historicalMatch: HistoricalMatchSnapshot;
  correlation: CorrelationSnapshot;
  scenarios: ScenarioSnapshot;
  risk: RiskAssessment;
  narrative: string[];
  decision: TradeDecision;
  decisionTree: DecisionTreeStep[];
  why: WhyFactor[];
  volatilityBand: "low" | "medium" | "high" | "extreme";
  impact: ExpectedImpact;
  strength: SurpriseStrength;
}
