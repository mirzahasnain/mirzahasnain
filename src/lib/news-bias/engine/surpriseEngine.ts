import impactLevelsJson from "./data/impactLevels.json";
import type { SurpriseSign, SurpriseStrength } from "../types/interfaces";
import type { ImpactLevelsConfig, SurpriseResult } from "./types";

const IMPACT = impactLevelsJson as ImpactLevelsConfig;

export function getImpactLevels(
  config: ImpactLevelsConfig = IMPACT,
): ImpactLevelsConfig {
  return config;
}

/**
 * Surprise engine — difference, percentage surprise, strength and sign.
 * Pure and provider-independent.
 */
export function computeSurprise(input: {
  forecast: number | null;
  actual: number | null;
  outcome: SurpriseSign | null;
  impactLevels?: ImpactLevelsConfig;
}): SurpriseResult {
  const levels = input.impactLevels ?? IMPACT;

  if (input.forecast !== null && input.actual !== null) {
    const difference = round(input.actual - input.forecast, 4);
    const percentageSurprise =
      input.forecast === 0
        ? difference === 0
          ? 0
          : null
        : round((difference / Math.abs(input.forecast)) * 100, 2);
    const strength = classifyStrength(Math.abs(difference), levels);
    const sign = getSign(difference);

    return {
      difference,
      percentageSurprise,
      strength,
      sign,
      impact: levels.impactByStrength[strength],
      isEstimate: false,
    };
  }

  if (!input.outcome) {
    return {
      difference: null,
      percentageSurprise: null,
      strength: "neutral",
      sign: "flat",
      impact: levels.impactByStrength.neutral,
      isEstimate: true,
    };
  }

  const strength: SurpriseStrength =
    input.outcome === "flat" ? "neutral" : "moderate";

  return {
    difference: null,
    percentageSurprise: null,
    strength,
    sign: input.outcome,
    impact: levels.impactByStrength[strength],
    isEstimate: true,
  };
}

function classifyStrength(
  absDifference: number,
  levels: ImpactLevelsConfig,
): SurpriseStrength {
  // Absolute surprise drives strength. Percentage is displayed separately —
  // small base rates (e.g. CPI 0.2) would otherwise inflate every print to Extreme.
  for (const rule of levels.strengthThresholds) {
    if (absDifference >= rule.minAbsSurprise) {
      return rule.strength;
    }
  }
  return "neutral";
}

function getSign(difference: number): SurpriseSign {
  if (difference > 0) return "positive";
  if (difference < 0) return "negative";
  return "flat";
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export { IMPACT as defaultImpactLevels };
