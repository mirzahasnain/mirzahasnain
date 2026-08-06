import type { Direction, SurpriseStrength, TradeAction } from "../types/interfaces";
import { TRADING_PAIRS } from "../pairs";
import { computeConfidence } from "./confidenceEngine";
import {
  defaultHistoricalMoves,
  defaultImpactLevels,
  defaultNewsRules,
  defaultPairMappings,
} from "./defaults";
import {
  buildExplanation,
  buildSummaryReason,
  formatRecommendation,
  usdDirectionFromRule,
} from "./explanationEngine";
import { getHistoricalSnapshot } from "./historicalEngine";
import { getNewsRule } from "./newsRules";
import { getPairBias, mapPairsForUsd } from "./pairMapping";
import { buildPlaybook } from "./playbookEngine";
import { computeSurprise } from "./surpriseEngine";
import type { DecisionInput, DecisionResult, EngineDeps } from "./types";

/**
 * Central Smart Decision Engine.
 * Pure function of inputs + injected config — no React, no network.
 */
export function createDecisionEngine(deps: Partial<EngineDeps> = {}) {
  const resolved: EngineDeps = {
    newsRules: deps.newsRules ?? defaultNewsRules,
    pairMappings: deps.pairMappings ?? defaultPairMappings,
    impactLevels: deps.impactLevels ?? defaultImpactLevels,
    historicalMoves: deps.historicalMoves ?? defaultHistoricalMoves,
  };

  return {
    deps: resolved,
    decide(input: DecisionInput): DecisionResult {
      return runDecision(input, resolved);
    },
  };
}

export type DecisionEngine = ReturnType<typeof createDecisionEngine>;

/** Default singleton used by the analysis UI. */
export const decisionEngine = createDecisionEngine();

export function runDecision(
  input: DecisionInput,
  deps: EngineDeps = {
    newsRules: defaultNewsRules,
    pairMappings: defaultPairMappings,
    impactLevels: defaultImpactLevels,
    historicalMoves: defaultHistoricalMoves,
  },
): DecisionResult {
  const rule = getNewsRule(input.newsId, deps.newsRules);
  const surprise = computeSurprise({
    forecast: input.forecast,
    actual: input.actual,
    outcome: input.outcome,
    impactLevels: deps.impactLevels,
  });

  const usdDirection = usdDirectionFromRule(rule, surprise.sign);
  const pairDirection = getPairBias(
    input.pairId,
    usdDirection,
    deps.pairMappings,
  );
  const action = toTradeAction(pairDirection, surprise.strength);
  const confidence = computeConfidence({
    rule,
    strength: surprise.strength,
    isEstimate: surprise.isEstimate,
    impactLevels: deps.impactLevels,
  });

  const playbook = buildPlaybook({
    pairId: input.pairId,
    pairDirection,
    action,
    confidence: confidence.score,
    rule,
    surprise,
    usdDirection,
    impactLevels: deps.impactLevels,
  });

  const historical = getHistoricalSnapshot(
    input.newsId,
    input.pairId,
    deps.historicalMoves,
  );

  const explanation = buildExplanation({
    rule,
    surprise,
    usdDirection,
    playbook,
    confidence,
    forecast: input.forecast,
    actual: input.actual,
  });

  const reason = buildSummaryReason({
    rule,
    surprise,
    usdDirection,
    playbook,
  });

  return {
    usdDirection,
    pairDirection,
    action,
    surprise,
    confidence,
    playbook,
    historical,
    explanation,
    riskWarning: rule.riskWarning,
    summary: {
      recommendation: formatRecommendation(playbook),
      confidence: confidence.score,
      impact: surprise.impact,
      reason,
    },
    pairBiases: mapPairsForUsd(usdDirection, deps.pairMappings),
  };
}

function toTradeAction(
  pairDirection: Direction,
  strength: SurpriseStrength,
): TradeAction {
  if (pairDirection === "neutral" || strength === "neutral") return "wait";
  return pairDirection === "bullish" ? "buy" : "sell";
}

/** Helper for building affected-asset grids from the mapping table. */
export function listPairDirections(
  usdDirection: Direction,
  selectedId: string | null,
  deps: EngineDeps = {
    newsRules: defaultNewsRules,
    pairMappings: defaultPairMappings,
    impactLevels: defaultImpactLevels,
    historicalMoves: defaultHistoricalMoves,
  },
) {
  const biases = mapPairsForUsd(usdDirection, deps.pairMappings);
  return TRADING_PAIRS.map((pair) => ({
    id: pair.id,
    name: pair.displayName,
    direction: biases[pair.id] ?? ("neutral" as Direction),
    isSelected: pair.id === selectedId,
  }));
}
