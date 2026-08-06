import type { BrainNewsInput } from "../shared/types";
import { getNewsRule } from "../shared/newsRules";
import { processSurprise } from "../surpriseEngine";
import type { SurpriseResult } from "../surpriseEngine";
import { processConfidence } from "../confidenceEngine";
import type { ConfidenceResult } from "../confidenceEngine";
import { processCorrelation, resolveUsdBias } from "../correlationEngine";
import type { CorrelationResult } from "../correlationEngine";
import { processHistorical } from "../historicalEngine";
import type { HistoricalResult } from "../historicalEngine";
import { processVolatility } from "../volatilityEngine";
import type { VolatilityResult } from "../volatilityEngine";
import { processRisk } from "../riskEngine";
import type { RiskResult } from "../riskEngine";
import { processScore } from "../scoreEngine";
import type { ScoreResult } from "../scoreEngine";
import { processScenario } from "../scenarioEngine";
import type { ScenarioResult } from "../scenarioEngine";
import { processDecision } from "../decisionEngine";
import type { DecisionResult } from "../decisionEngine";
import { processPlaybook } from "../playbookEngine";
import type { PlaybookResult } from "../playbookEngine";
import type { NewsRule } from "../shared/types";

/**
 * Full TradeImpact Brain output — every field is a structured object.
 */
export interface BrainResult {
  newsRule: NewsRule;
  surprise: SurpriseResult;
  usdBias: ReturnType<typeof resolveUsdBias>;
  correlation: CorrelationResult;
  historical: HistoricalResult;
  confidence: ConfidenceResult;
  volatility: VolatilityResult;
  score: ScoreResult;
  risk: RiskResult;
  scenario: ScenarioResult;
  decision: DecisionResult;
  playbook: PlaybookResult;
  meta: {
    executionOrder: string[];
    modelVersion: string;
    mode: "pre_release" | "post_release";
  };
}

export type BrainInput = BrainNewsInput;

const EXECUTION_ORDER = [
  "newsRule",
  "surprise",
  "usdBias",
  "correlation",
  "historical",
  "confidence",
  "volatility",
  "score",
  "risk",
  "scenario",
  "decision",
  "playbook",
] as const;

/**
 * TradeImpact Brain orchestrator.
 * Pure function — no React, no network, no UI.
 *
 * Flow (PRD / ENGINE):
 * News → Rule → Forecast/Actual → Surprise → USD Bias → Correlation →
 * Affected Assets → Historical Match → Confidence → Volatility →
 * Risk → Score → Decision → Playbook
 */
export function runTradeImpactBrain(input: BrainInput): BrainResult {
  const mode: "pre_release" | "post_release" =
    input.mode ??
    (input.actual === null || input.actual === undefined
      ? "pre_release"
      : "post_release");

  const newsRule = getNewsRule(input.newsId);

  const surprise = processSurprise({
    forecast: input.forecast,
    actual: input.actual,
    outcome: input.outcome ?? null,
  });

  const usdBias = resolveUsdBias(newsRule.interpretation, surprise.sign);

  const correlation = processCorrelation({
    usdDirection: usdBias,
    selectedPairId: input.pairId,
  });

  const historical = processHistorical({
    newsId: input.newsId,
    pairId: input.pairId,
    surpriseSign: surprise.sign,
  });

  const confidence = processConfidence({
    rule: newsRule,
    strength: surprise.strength,
    isEstimate: surprise.isEstimate,
  });

  const volatility = processVolatility({
    impact: surprise.impact,
    strength: surprise.strength,
  });

  const score = processScore({
    historicalMatch: historical.historicalMatchScore,
    surpriseStrength: surprise.strength,
    newsImportance: newsRule.importance,
    marketCorrelation: correlation.alignmentScore,
    volatilityBand: volatility.band,
    ruleHistoricalReliability: newsRule.historicalReliability,
    cohortConfidence: historical.cohortConfidence,
  });

  const risk = processRisk({
    impact: surprise.impact,
    strength: surprise.strength,
    reliability: score.reliability.level,
    isEstimate: surprise.isEstimate,
    volatilityBand: volatility.band,
  });

  const scenario = processScenario({
    pairId: input.pairId,
    pairDirection: correlation.pairDirection,
    strength: surprise.strength,
    averageAbsMove: Math.abs(historical.averageMove),
    unit: historical.unit,
  });

  const decision = processDecision({
    pairDirection: correlation.pairDirection,
    score: score.total,
    reliability: score.reliability.level,
    riskLevel: risk.level,
    strength: surprise.strength,
    mode,
  });

  const playbook = processPlaybook({
    pairId: input.pairId,
    pairDirection: correlation.pairDirection,
    decisionId: decision.decisionId,
    score: score.total,
    riskLevel: risk.level,
    suggestedRiskPct: risk.suggestedRiskPct,
    riskWarning: newsRule.riskWarning,
    fakeSpikeLikely:
      surprise.impact === "high" ||
      surprise.impact === "very-high" ||
      volatility.band === "high" ||
      volatility.band === "extreme",
  });

  return {
    newsRule,
    surprise,
    usdBias,
    correlation,
    historical,
    confidence,
    volatility,
    score,
    risk,
    scenario,
    decision,
    playbook,
    meta: {
      executionOrder: [...EXECUTION_ORDER],
      modelVersion: score.modelVersion,
      mode,
    },
  };
}
