import decisionTreeJson from "./data/decisionTree.json";
import type { ReliabilityLevel, TradeDecision, TradeDecisionId } from "./types";
import type { Direction, SurpriseStrength } from "../../types/interfaces";

interface DecisionTreeConfig {
  tree: string[];
  labels: Record<string, string>;
  decisions: Record<
    TradeDecisionId,
    {
      id: TradeDecisionId;
      label: string;
      action: "buy" | "sell" | "wait";
      aggression: "none" | "aggressive" | "conservative";
    }
  >;
  rules: {
    avoidBelowScore: number;
    waitBelowScore: number;
    aggressiveMinScore: number;
    aggressiveMinStrength: SurpriseStrength[];
    conservativeMinReliability: ReliabilityLevel[];
  };
}

const CONFIG = decisionTreeJson as DecisionTreeConfig;

/**
 * Decision tree — every recommendation passes News → Surprise → History →
 * Correlation → Volatility → Confidence → Recommendation.
 */
export function resolveTradeDecision(input: {
  score: number;
  pairDirection: Direction;
  strength: SurpriseStrength;
  reliability: ReliabilityLevel;
  riskLevel: string;
}): TradeDecision {
  const rules = CONFIG.rules;

  if (input.score < rules.avoidBelowScore || input.riskLevel === "very-high") {
    return toDecision("avoid");
  }

  if (
    input.score < rules.waitBelowScore ||
    input.pairDirection === "neutral" ||
    input.strength === "neutral"
  ) {
    return toDecision("wait");
  }

  const aggressive =
    input.score >= rules.aggressiveMinScore &&
    rules.aggressiveMinStrength.includes(input.strength) &&
    (input.reliability === "high" || input.reliability === "very-high");

  if (input.pairDirection === "bullish") {
    return toDecision(aggressive ? "aggressive-buy" : "conservative-buy");
  }
  return toDecision(aggressive ? "aggressive-sell" : "conservative-sell");
}

export function getDecisionTreeLabels(): Record<string, string> {
  return { ...CONFIG.labels };
}

export function getDecisionTreeOrder(): string[] {
  return [...CONFIG.tree];
}

function toDecision(id: TradeDecisionId): TradeDecision {
  const row = CONFIG.decisions[id];
  return {
    id: row.id,
    label: row.label,
    action: row.action,
    aggression: row.aggression,
  };
}
