import scoreWeightsJson from "./data/scoreWeights.json";
import type {
  ReliabilityLevel,
  ReliabilityMeter,
  ScoreBreakdown,
  TradeImpactScore,
} from "../types";
import type { SurpriseStrength } from "../../../types/interfaces";

interface ScoreWeightsConfig {
  weights: ScoreBreakdown;
  reliabilityBands: { id: ReliabilityLevel; label: string; max: number }[];
  strengthScore: Record<string, number>;
  volatilityScore: Record<string, number>;
  impactVolatility: Record<string, "low" | "medium" | "high" | "extreme">;
}

const CONFIG = scoreWeightsJson as ScoreWeightsConfig;

export function resolveVolatilityBand(
  impact: string,
): "low" | "medium" | "high" | "extreme" {
  return CONFIG.impactVolatility[impact] ?? "medium";
}

export function strengthToScore(strength: SurpriseStrength): number {
  return CONFIG.strengthScore[strength] ?? 50;
}

export function volatilityToScore(band: string): number {
  return CONFIG.volatilityScore[band] ?? 50;
}

/**
 * TradeImpact Score™ — weighted blend of the five intelligence pillars.
 */
export function computeTradeImpactScore(input: {
  historicalMatch: number;
  surpriseStrength: SurpriseStrength;
  newsImportance: number;
  marketCorrelation: number;
  impact: string;
}): TradeImpactScore {
  const w = CONFIG.weights;
  const volatilityBand = resolveVolatilityBand(input.impact);
  const breakdown: ScoreBreakdown = {
    historicalMatch: clamp(input.historicalMatch, 0, 100),
    surpriseStrength: strengthToScore(input.surpriseStrength),
    newsImportance: clamp(input.newsImportance, 0, 100),
    marketCorrelation: clamp(input.marketCorrelation, 0, 100),
    volatility: volatilityToScore(volatilityBand),
  };

  const total = Math.round(
    breakdown.historicalMatch * w.historicalMatch +
      breakdown.surpriseStrength * w.surpriseStrength +
      breakdown.newsImportance * w.newsImportance +
      breakdown.marketCorrelation * w.marketCorrelation +
      breakdown.volatility * w.volatility,
  );

  return {
    total: clamp(total, 0, 100),
    breakdown,
    weights: { ...w },
  };
}

export function computeReliabilityMeter(
  historicalReliability: number,
  cohortConfidence: number | null,
): ReliabilityMeter {
  const score = clamp(
    Math.round(
      cohortConfidence === null
        ? historicalReliability
        : historicalReliability * 0.45 + cohortConfidence * 0.55,
    ),
    0,
    100,
  );

  const band =
    CONFIG.reliabilityBands.find((b) => score <= b.max) ??
    CONFIG.reliabilityBands[CONFIG.reliabilityBands.length - 1];

  return {
    level: band.id,
    label: band.label,
    score,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export { CONFIG as scoreWeightsConfig };
