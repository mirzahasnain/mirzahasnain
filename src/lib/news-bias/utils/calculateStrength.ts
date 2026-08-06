import { IMPACT_BY_STRENGTH, STRENGTH_THRESHOLDS } from "../constants";
import type { ExpectedImpact, SurpriseStrength } from "../types/interfaces";

/** Classifies how big the surprise is, ignoring its direction. */
export function calculateStrength(surprise: number): SurpriseStrength {
  const magnitude = Math.abs(surprise);
  const threshold = STRENGTH_THRESHOLDS.find(
    (candidate) => magnitude >= candidate.min,
  );

  return threshold ? threshold.strength : "neutral";
}

export function getExpectedImpact(strength: SurpriseStrength): ExpectedImpact {
  return IMPACT_BY_STRENGTH[strength];
}
