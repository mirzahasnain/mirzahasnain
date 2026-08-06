import { CONFIDENCE_BY_STRENGTH } from "../constants";
import type { SurpriseStrength } from "../types/interfaces";

/** Confidence in the bias holding, 0-100. */
export function calculateConfidence(strength: SurpriseStrength): number {
  return CONFIDENCE_BY_STRENGTH[strength];
}

export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence)}%`;
}
