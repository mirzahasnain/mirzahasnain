import type { ExpectedImpact, SurpriseSign, SurpriseStrength } from "../shared/types";

export interface SurpriseInput {
  forecast: number | null;
  actual: number | null;
  outcome?: "beat" | "miss" | "in-line" | null;
}

export interface SurpriseResult {
  difference: number | null;
  percentageSurprise: number | null;
  strength: SurpriseStrength;
  sign: SurpriseSign;
  impact: ExpectedImpact;
  isEstimate: boolean;
  bucket: "inline" | "moderate" | "large";
}
