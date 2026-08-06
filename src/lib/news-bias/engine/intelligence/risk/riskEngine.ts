import riskJson from "./data/riskLevels.json";
import type {
  ExpectedImpact,
  SurpriseStrength,
} from "../../../types/interfaces";
import type {
  IntelligenceRiskLevel,
  ReliabilityLevel,
  RiskAssessment,
} from "../types";

interface RiskConfig {
  levels: { id: IntelligenceRiskLevel; label: string; maxScore: number }[];
  reasons: Record<IntelligenceRiskLevel, string>;
  boosts: {
    extremeStrength: number;
    strongStrength: number;
    highImpact: number;
    veryHighImpact: number;
    lowReliability: number;
    estimate: number;
  };
}

const CONFIG = riskJson as RiskConfig;

export function assessRisk(input: {
  impact: ExpectedImpact;
  strength: SurpriseStrength;
  reliability: ReliabilityLevel;
  isEstimate: boolean;
  volatilityBand: "low" | "medium" | "high" | "extreme";
}): RiskAssessment {
  let score = 25;
  const b = CONFIG.boosts;

  if (input.strength === "extreme") score += b.extremeStrength;
  else if (input.strength === "strong") score += b.strongStrength;

  if (input.impact === "very-high") score += b.veryHighImpact;
  else if (input.impact === "high") score += b.highImpact;

  if (input.reliability === "very-low" || input.reliability === "low") {
    score += b.lowReliability;
  }
  if (input.isEstimate) score += b.estimate;
  if (input.volatilityBand === "extreme") score += 12;
  else if (input.volatilityBand === "high") score += 6;

  score = Math.min(100, Math.max(0, score));
  const level =
    CONFIG.levels.find((l) => score <= l.maxScore) ??
    CONFIG.levels[CONFIG.levels.length - 1];

  return {
    level: level.id,
    label: level.label,
    why: CONFIG.reasons[level.id],
    score,
  };
}
