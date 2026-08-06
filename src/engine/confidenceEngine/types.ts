import type { NewsRule, SurpriseStrength } from "../shared/types";

export interface ConfidenceInput {
  rule: NewsRule;
  strength: SurpriseStrength;
  isEstimate?: boolean;
}

export interface ConfidenceResult {
  score: number;
  importance: number;
  surpriseSize: number;
  historicalReliability: number;
  isEstimate: boolean;
}
