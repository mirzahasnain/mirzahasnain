import type {
  BiasDirection,
  RiskLevel,
  ReliabilityLevel,
  SurpriseStrength,
  TradeAction,
  TradeDecisionId,
} from "../shared/types";

export interface DecisionInput {
  pairDirection: BiasDirection;
  score: number;
  reliability: ReliabilityLevel;
  riskLevel: RiskLevel;
  strength: SurpriseStrength;
  mode: "pre_release" | "post_release";
}

export interface DecisionResult {
  decisionId: TradeDecisionId;
  label: string;
  action: TradeAction;
  aggression: "none" | "conservative" | "aggressive";
  pairDirection: BiasDirection;
  reasons: string[];
}
