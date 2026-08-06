import impactJson from "./data/impactLevels.json";
import { clamp } from "../shared/math";
import type { SurpriseStrength } from "../shared/types";
import type { ConfidenceInput, ConfidenceResult } from "./types";

interface ImpactConfig {
  confidenceWeights: {
    importance: number;
    surpriseSize: number;
    historicalReliability: number;
  };
  surpriseScoreByStrength: Record<SurpriseStrength, number>;
}

const CONFIG = impactJson as ImpactConfig;

export function processConfidence(input: ConfidenceInput): ConfidenceResult {
  const weights = CONFIG.confidenceWeights;
  const surpriseSize = CONFIG.surpriseScoreByStrength[input.strength] ?? 50;
  let score =
    input.rule.importance * weights.importance +
    surpriseSize * weights.surpriseSize +
    input.rule.historicalReliability * weights.historicalReliability;
  const isEstimate = Boolean(input.isEstimate);
  if (isEstimate) score *= 0.92;
  return {
    score: clamp(Math.round(score), 0, 100),
    importance: input.rule.importance,
    surpriseSize,
    historicalReliability: input.rule.historicalReliability,
    isEstimate,
  };
}
