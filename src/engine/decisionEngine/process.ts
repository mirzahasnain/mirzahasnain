import treeJson from "./data/decisionTree.json";
import type { TradeDecisionId } from "../shared/types";
import type { DecisionInput, DecisionResult } from "./types";

interface DecisionMeta {
  id: TradeDecisionId;
  label: string;
  action: "buy" | "sell" | "wait";
  aggression: "none" | "conservative" | "aggressive";
}

interface TreeConfig {
  decisions: Record<string, DecisionMeta>;
  rules: {
    avoidBelowScore: number;
    waitBelowScore: number;
    aggressiveMinScore: number;
    aggressiveMinStrength: string[];
    conservativeMinReliability: string[];
  };
}

const CONFIG = treeJson as TreeConfig;

function sideDecision(
  pairDirection: DecisionInput["pairDirection"],
  aggression: "conservative" | "aggressive",
): TradeDecisionId {
  if (pairDirection === "bullish") {
    return aggression === "aggressive" ? "aggressive-buy" : "conservative-buy";
  }
  return aggression === "aggressive" ? "aggressive-sell" : "conservative-sell";
}

/**
 * Decision Engine — final recommendation leaf (Avoid / Wait / Agg|Cons Buy|Sell).
 * Gates follow ENGINE.md decisionTree.json (PRD Part I aligned).
 */
export function processDecision(input: DecisionInput): DecisionResult {
  const reasons: string[] = [];
  const r = CONFIG.rules;

  if (input.riskLevel === "very-high") {
    reasons.push("Risk level is Very High — capital preservation first.");
    return pack("avoid", input, reasons);
  }
  if (input.score < r.avoidBelowScore) {
    reasons.push(`TradeImpact Score ${input.score} is below avoid threshold.`);
    return pack("avoid", input, reasons);
  }
  if (input.mode === "pre_release") {
    reasons.push("Pre-release mode — wait for Actual confirmation.");
    return pack("wait", input, reasons);
  }
  if (input.pairDirection === "neutral") {
    reasons.push("Pair bias is neutral.");
    return pack("wait", input, reasons);
  }
  if (input.score < r.waitBelowScore) {
    reasons.push(`Score ${input.score} is below actionable wait threshold.`);
    return pack("wait", input, reasons);
  }

  const canAggressive =
    input.score >= r.aggressiveMinScore &&
    r.aggressiveMinStrength.includes(input.strength) &&
    (input.reliability === "high" || input.reliability === "very-high") &&
    (input.riskLevel === "low" || input.riskLevel === "medium");

  if (canAggressive) {
    reasons.push("High score, strong surprise, and high reliability.");
    return pack(sideDecision(input.pairDirection, "aggressive"), input, reasons);
  }

  if (r.conservativeMinReliability.includes(input.reliability)) {
    reasons.push("Directional bias with adequate reliability — conservative.");
    return pack(sideDecision(input.pairDirection, "conservative"), input, reasons);
  }

  reasons.push("Reliability too low for a directional entry.");
  return pack("wait", input, reasons);
}

function pack(
  id: TradeDecisionId,
  input: DecisionInput,
  reasons: string[],
): DecisionResult {
  const meta = CONFIG.decisions[id];
  return {
    decisionId: id,
    label: meta.label,
    action: meta.action,
    aggression: meta.aggression,
    pairDirection: input.pairDirection,
    reasons,
  };
}
