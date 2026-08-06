/** Thin facade — TradeImpact Intelligence Engine lives under engine/. */
export {
  runIntelligenceEngine,
  computeTradeImpactScore,
  computeReliabilityMeter,
  buildHistoricalMatch,
  buildCorrelationSnapshot,
  buildScenarios,
  assessRisk,
  resolveTradeDecision,
} from "../../engine/intelligence";
export type { TradeImpactIntelligence, IntelligenceInput } from "../../engine/intelligence";
