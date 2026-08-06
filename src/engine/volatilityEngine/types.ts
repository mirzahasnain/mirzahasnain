import type { ExpectedImpact, SurpriseStrength, VolatilityBand } from "../shared/types";

export interface VolatilityInput {
  impact: ExpectedImpact;
  strength: SurpriseStrength;
}

export interface VolatilityResult {
  band: VolatilityBand;
  score: number;
  label: string;
  actionable: boolean;
}
