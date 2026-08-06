/**
 * TradeImpact Brain — public API.
 *
 * React components must import from here (or module folders) and must NEVER
 * embed trading business rules.
 */

export * from "./shared";

export * from "./surpriseEngine";
export * from "./confidenceEngine";
export * from "./correlationEngine";
export * from "./historicalEngine";
export * from "./volatilityEngine";
export * from "./riskEngine";
export * from "./scoreEngine";
export * from "./scenarioEngine";
export * from "./playbookEngine";
export * from "./decisionEngine";
export * from "./orchestrator";

/** @deprecated Prefer named process* functions from module folders. */
export { processDecision as decisionEngine } from "./decisionEngine";
export { processConfidence as confidenceEngine } from "./confidenceEngine";
export { processCorrelation as correlationEngine } from "./correlationEngine";
export { processRisk as riskEngine } from "./riskEngine";
export { processPlaybook as playbookEngine } from "./playbookEngine";
export { processScore as scoreEngine } from "./scoreEngine";
