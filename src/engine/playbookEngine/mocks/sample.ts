import type { PlaybookInput } from "../types";

export const mockSellPlaybook: PlaybookInput = {
  pairId: "XAUUSD",
  pairDirection: "bearish",
  decisionId: "conservative-sell",
  score: 91,
  riskLevel: "high",
  suggestedRiskPct: 0.75,
  riskWarning: "Spike risk elevated.",
  fakeSpikeLikely: true,
};
