import type { BiasDirection, RiskLevel, TradeDecisionId } from "../shared/types";

export interface PlaybookPhase {
  id: "before" | "during" | "after";
  title: string;
  steps: string[];
}

export interface PlaybookEntryStrategy {
  id: string;
  label: string;
  summary: string;
}

export interface PlaybookInput {
  pairId: string;
  pairDirection: BiasDirection;
  decisionId: TradeDecisionId;
  score: number;
  riskLevel: RiskLevel;
  suggestedRiskPct: number;
  riskWarning: string;
  fakeSpikeLikely: boolean;
}

export interface PlaybookResult {
  setup: {
    asset: string;
    bias: BiasDirection;
    decisionId: TradeDecisionId;
    score: number;
    riskLevel: RiskLevel;
  };
  phases: PlaybookPhase[];
  entries: PlaybookEntryStrategy[];
  risk: {
    suggestedPct: number;
    maxPct: number;
    reminder: string;
  };
  levels: {
    takeProfitGuide: string[];
    stopLossGuide: string[];
  };
  fakeSpikeWarning: string | null;
  disclaimer: string;
}
