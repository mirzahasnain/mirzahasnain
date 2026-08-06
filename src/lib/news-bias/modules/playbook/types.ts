/**
 * AI Trade Playbook view models — Version 12.
 * Components consume these shapes only; JSON rules stay in module data files.
 */

export type PlaybookRiskLevel = "Low" | "Medium" | "High";

export type PlaybookVolatilityBand = "low" | "medium" | "high" | "extreme";

export interface TradeSetupCard {
  asset: string;
  pairId: string;
  bias: string;
  confidence: number;
  risk: PlaybookRiskLevel;
}

export interface TradingPlanPhase {
  id: "before" | "release" | "confirmation";
  title: string;
  action: string;
}

export interface EntryStrategyOption {
  id: string;
  label: string;
  explanation: string;
}

export interface RiskOption {
  id: string;
  label: string;
  value: number;
  recommended: boolean;
}

export interface RiskManagementPlan {
  options: RiskOption[];
  recommendedId: string;
  positionSizingReminder: string;
}

export interface TakeProfitLevel {
  id: string;
  label: string;
  placeholder: string;
}

export interface TakeProfitPlan {
  levels: TakeProfitLevel[];
  trailStop: { label: string; placeholder: string };
}

export interface StopLossPlacement {
  id: string;
  label: string;
  hint: string;
}

export interface StopLossGuide {
  placements: StopLossPlacement[];
  note: string;
}

export interface FakeSpikeWarning {
  title: string;
  message: string;
  hint: string;
  probability: number;
}

export interface PlaybookHistoricalBehaviour {
  sampleSize: number;
  assetLabel: string;
  movedWithBias: number;
  total: number;
  summaryLine: string;
  averageMove: number;
  averageMoveLabel: string;
  unit: string;
}

export interface PlaybookVolatilityMeter {
  band: PlaybookVolatilityBand;
  label: string;
  title: string;
  score: number;
}

export interface AiTradePlaybook {
  setup: TradeSetupCard;
  plan: TradingPlanPhase[];
  entries: EntryStrategyOption[];
  risk: RiskManagementPlan;
  takeProfit: TakeProfitPlan;
  stopLoss: StopLossGuide;
  fakeSpike: FakeSpikeWarning | null;
  historical: PlaybookHistoricalBehaviour | null;
  volatility: PlaybookVolatilityMeter;
  aiNotes: string[];
  shareSummary: string;
}
