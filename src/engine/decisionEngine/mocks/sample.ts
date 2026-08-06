import type { DecisionInput } from "../types";

export const mockConservativeSellInput: DecisionInput = {
  pairDirection: "bearish",
  score: 91,
  reliability: "high",
  riskLevel: "medium",
  strength: "strong",
  mode: "post_release",
};

export const mockAvoidInput: DecisionInput = {
  pairDirection: "bearish",
  score: 92,
  reliability: "high",
  riskLevel: "very-high",
  strength: "extreme",
  mode: "post_release",
};
