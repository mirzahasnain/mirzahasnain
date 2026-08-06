import type { ReliabilityLevel, SurpriseStrength, VolatilityBand } from "../shared/types";

export interface ScoreBreakdown {
  historicalMatch: number;
  surpriseStrength: number;
  newsImportance: number;
  marketCorrelation: number;
  volatility: number;
}

export interface ScoreInput {
  historicalMatch: number;
  surpriseStrength: SurpriseStrength;
  newsImportance: number;
  marketCorrelation: number;
  volatilityBand: VolatilityBand;
  ruleHistoricalReliability: number;
  cohortConfidence: number;
}

export interface ReliabilityResult {
  level: ReliabilityLevel;
  label: string;
  score: number;
}

export interface ScoreResult {
  total: number;
  breakdown: ScoreBreakdown;
  weights: ScoreBreakdown;
  modelVersion: string;
  reliability: ReliabilityResult;
}
