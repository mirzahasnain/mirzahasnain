import impactJson from "./data/impactLevels.json";
import { round } from "../shared/math";
import type { SurpriseSign, SurpriseStrength, ExpectedImpact } from "../shared/types";
import type { SurpriseInput, SurpriseResult } from "./types";

interface StrengthRule {
  minAbsSurprise: number;
  strength: SurpriseStrength;
}

interface ImpactConfig {
  strengthThresholds: StrengthRule[];
  impactByStrength: Record<SurpriseStrength, ExpectedImpact>;
}

const CONFIG = impactJson as ImpactConfig;

function outcomeToSign(outcome: NonNullable<SurpriseInput["outcome"]>): SurpriseSign {
  if (outcome === "beat") return "positive";
  if (outcome === "miss") return "negative";
  return "flat";
}

function classifyStrength(absDifference: number): SurpriseStrength {
  for (const rule of CONFIG.strengthThresholds) {
    if (absDifference >= rule.minAbsSurprise) return rule.strength;
  }
  return "neutral";
}

function toBucket(strength: SurpriseStrength): SurpriseResult["bucket"] {
  if (strength === "strong" || strength === "extreme") return "large";
  if (strength === "moderate" || strength === "weak") return "moderate";
  return "inline";
}

function getSign(difference: number): SurpriseSign {
  if (difference > 0) return "positive";
  if (difference < 0) return "negative";
  return "flat";
}

/**
 * Surprise Engine — Actual vs Forecast → structured surprise.
 */
export function processSurprise(input: SurpriseInput): SurpriseResult {
  if (input.forecast !== null && input.actual !== null) {
    const difference = round(input.actual - input.forecast, 4);
    const percentageSurprise =
      input.forecast === 0
        ? difference === 0
          ? 0
          : null
        : round((difference / Math.abs(input.forecast)) * 100, 2);
    const strength = classifyStrength(Math.abs(difference));
    const sign = getSign(difference);
    return {
      difference,
      percentageSurprise,
      strength,
      sign,
      impact: CONFIG.impactByStrength[strength],
      isEstimate: false,
      bucket: toBucket(strength),
    };
  }

  if (!input.outcome) {
    return {
      difference: null,
      percentageSurprise: null,
      strength: "neutral",
      sign: "flat",
      impact: CONFIG.impactByStrength.neutral,
      isEstimate: true,
      bucket: "inline",
    };
  }

  const sign = outcomeToSign(input.outcome);
  const strength: SurpriseStrength = sign === "flat" ? "neutral" : "moderate";
  return {
    difference: null,
    percentageSurprise: null,
    strength,
    sign,
    impact: CONFIG.impactByStrength[strength],
    isEstimate: true,
    bucket: toBucket(strength),
  };
}
