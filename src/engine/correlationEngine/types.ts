import type { BiasDirection } from "../shared/types";

export type CorrelationMove = "up" | "down" | "flat";

export interface CorrelationLink {
  pairId: string;
  label: string;
  move: CorrelationMove;
}

export interface CorrelationInput {
  usdDirection: BiasDirection;
  selectedPairId: string;
}

export interface CorrelationResult {
  usdDirection: BiasDirection;
  pairDirection: BiasDirection;
  links: CorrelationLink[];
  alignmentScore: number;
  affectedAssets: CorrelationLink[];
}
