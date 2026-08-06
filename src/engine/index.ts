/**
 * TradeImpact engine barrel (foundation).
 * UI must import engines from here or lib facades — never embed business rules in components.
 */
export * from "./decisionEngine";
export * from "./confidenceEngine";
export * from "./correlationEngine";
export * from "./riskEngine";
export * from "./playbookEngine";
export * from "./scoreEngine";
export type * from "./types";

export { runIntelligenceEngine } from "@/lib/news-bias/engine/intelligenceEngine";
export { computeSurprise } from "@/lib/news-bias/engine/surpriseEngine";
