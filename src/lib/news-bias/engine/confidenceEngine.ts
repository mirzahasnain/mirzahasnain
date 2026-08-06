import { getImpactLevels } from "./surpriseEngine";
import type { NewsRule, ConfidenceResult, ImpactLevelsConfig } from "./types";
import type { SurpriseStrength } from "../types/interfaces";

/**
 * Confidence = weighted blend of news importance, surprise size, and
 * historical reliability. All weights live in impactLevels.json.
 */
export function computeConfidence(input: {
  rule: NewsRule;
  strength: SurpriseStrength;
  isEstimate?: boolean;
  impactLevels?: ImpactLevelsConfig;
}): ConfidenceResult {
  const levels = input.impactLevels ?? getImpactLevels();
  const weights = levels.confidenceWeights;
  const surpriseSize = levels.surpriseScoreByStrength[input.strength];

  let score =
    input.rule.importance * weights.importance +
    surpriseSize * weights.surpriseSize +
    input.rule.historicalReliability * weights.historicalReliability;

  // Estimates lack a measured surprise, so shave confidence slightly.
  if (input.isEstimate) score *= 0.92;

  return {
    score: clamp(Math.round(score), 0, 100),
    importance: input.rule.importance,
    surpriseSize,
    historicalReliability: input.rule.historicalReliability,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
