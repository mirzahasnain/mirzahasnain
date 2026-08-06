import weightsJson from "./data/scoreWeights.json";
import { clamp } from "../shared/math";
import type { ReliabilityLevel } from "../shared/types";
import type { ScoreBreakdown, ScoreInput, ScoreResult } from "./types";

interface ScoreConfig {
  weights: ScoreBreakdown;
  reliabilityBands: { id: ReliabilityLevel; label: string; max: number }[];
  strengthScore: Record<string, number>;
  volatilityScore: Record<string, number>;
}

const CONFIG = weightsJson as ScoreConfig;
const MODEL_VERSION = "scoreWeights.v1";

export function processScore(input: ScoreInput): ScoreResult {
  const w = CONFIG.weights;
  const breakdown: ScoreBreakdown = {
    historicalMatch: clamp(input.historicalMatch, 0, 100),
    surpriseStrength: CONFIG.strengthScore[input.surpriseStrength] ?? 50,
    newsImportance: clamp(input.newsImportance, 0, 100),
    marketCorrelation: clamp(input.marketCorrelation, 0, 100),
    volatility: CONFIG.volatilityScore[input.volatilityBand] ?? 50,
  };

  const total = clamp(
    Math.round(
      breakdown.historicalMatch * w.historicalMatch +
        breakdown.surpriseStrength * w.surpriseStrength +
        breakdown.newsImportance * w.newsImportance +
        breakdown.marketCorrelation * w.marketCorrelation +
        breakdown.volatility * w.volatility,
    ),
    0,
    100,
  );

  const reliabilityScore = clamp(
    Math.round(input.ruleHistoricalReliability * 0.45 + input.cohortConfidence * 0.55),
    0,
    100,
  );
  const band =
    CONFIG.reliabilityBands.find((b) => reliabilityScore <= b.max) ??
    CONFIG.reliabilityBands[CONFIG.reliabilityBands.length - 1];

  return {
    total,
    breakdown,
    weights: { ...w },
    modelVersion: MODEL_VERSION,
    reliability: {
      level: band.id,
      label: band.label,
      score: reliabilityScore,
    },
  };
}
