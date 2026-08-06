import type { BiasDirection, SurpriseStrength } from "../shared/types";

export interface ScenarioCase {
  id: "best" | "expected" | "worst";
  label: string;
  move: number;
  unit: string;
}

export interface ScenarioInput {
  pairId: string;
  pairDirection: BiasDirection;
  strength: SurpriseStrength;
  averageAbsMove: number;
  unit: string;
}

export interface ScenarioResult {
  cases: ScenarioCase[];
  expectedMove: {
    value: number;
    unit: string;
    label: string;
  };
}
