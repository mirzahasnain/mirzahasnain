import type {
  ExpectedImpact,
  ReliabilityLevel,
  RiskLevel,
  SurpriseStrength,
  VolatilityBand,
} from "../shared/types";

export interface RiskInput {
  impact: ExpectedImpact;
  strength: SurpriseStrength;
  reliability: ReliabilityLevel;
  isEstimate: boolean;
  volatilityBand: VolatilityBand;
}

export interface RiskResult {
  level: RiskLevel;
  label: string;
  why: string;
  score: number;
  suggestedRiskPct: number;
}
