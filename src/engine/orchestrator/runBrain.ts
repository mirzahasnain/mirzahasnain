import type { BrainNewsInput } from "../shared/types";
import { getNewsRule } from "../shared/newsRules";
import {
  applyConfidenceModifier,
  applyRiskScoreModifier,
  applyScoreModifier,
  identityModifiers,
  lookupRulesEngine,
  type RulesModifiers,
  type RulesProvenance,
} from "../shared/rulesBridge";
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
import type { NewsRule, RiskLevel } from "../shared/types";
import riskJson from "../riskEngine/data/riskLevels.json";

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
    rules: RulesProvenance | null;
    modifiers: RulesModifiers;
  };
}

export type BrainInput = BrainNewsInput;

const EXECUTION_ORDER = [
  "newsRule",
  "rulesBridge",
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

interface RiskBandConfig {
  levels: { id: RiskLevel; label: string; maxScore: number }[];
  reasons: Record<RiskLevel, string>;
}

const RISK_BANDS = riskJson as RiskBandConfig;

const SUGGESTED: Record<RiskLevel, number> = {
  low: 1.5,
  medium: 1.0,
  high: 0.75,
  "very-high": 0,
};

function rebandRisk(score: number, baseWhy: string): RiskResult {
  const level =
    RISK_BANDS.levels.find((l) => score <= l.maxScore) ??
    RISK_BANDS.levels[RISK_BANDS.levels.length - 1];
  return {
    level: level.id,
    label: level.label,
    why: RISK_BANDS.reasons[level.id] ?? baseWhy,
    score,
    suggestedRiskPct: SUGGESTED[level.id],
  };
}

/**
 * TradeImpact Brain orchestrator.
 * Pure function — no React, no network, no UI.
 *
 * Flow (PRD / ENGINE):
 * News → Rule → Forecast/Actual → Surprise → USD Bias → Correlation →
 * Affected Assets → Historical Match → Confidence → Volatility →
 * Risk → Score → Decision → Playbook
 *
 * Rules Engine modifiers are applied after core scoring (MVP wiring).
 */
export function runTradeImpactBrain(input: BrainInput): BrainResult {
  const mode: "pre_release" | "post_release" =
    input.mode ??
    (input.actual === null || input.actual === undefined
      ? "pre_release"
      : "post_release");

  const newsRule = getNewsRule(input.newsId);
  const rulesBridge = lookupRulesEngine(input.newsId);
  const modifiers = rulesBridge?.modifiers ?? identityModifiers();

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

  let confidence = processConfidence({
    rule: newsRule,
    strength: surprise.strength,
    isEstimate: surprise.isEstimate,
  });
  confidence = {
    ...confidence,
    score: applyConfidenceModifier(confidence.score, modifiers.confidenceModifier),
  };

  const volatility = processVolatility({
    impact: surprise.impact,
    strength: surprise.strength,
  });

  let score = processScore({
    historicalMatch: historical.historicalMatchScore,
    surpriseStrength: surprise.strength,
    newsImportance: newsRule.importance,
    marketCorrelation: correlation.alignmentScore,
    volatilityBand: volatility.band,
    ruleHistoricalReliability: newsRule.historicalReliability,
    cohortConfidence: historical.cohortConfidence,
  });
  score = {
    ...score,
    total: applyScoreModifier(score.total, modifiers.tradeImpactScoreModifier),
  };

  let risk = processRisk({
    impact: surprise.impact,
    strength: surprise.strength,
    reliability: score.reliability.level,
    isEstimate: surprise.isEstimate,
    volatilityBand: volatility.band,
  });
  risk = rebandRisk(applyRiskScoreModifier(risk.score, modifiers.riskModifier), risk.why);

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
      volatility.band === "extreme" ||
      modifiers.fakeSpikeProbability >= 0.55,
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
      rules: rulesBridge?.provenance ?? null,
      modifiers,
    },
  };
}
