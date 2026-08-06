/**
 * TradeImpact Intelligence Engine (TIE) — Version 13.
 * Combines news rules, history, surprise, correlation, confidence, and
 * volatility into one scored decision with a full "Why?" trail.
 */
import { getNewsRule } from "./newsRules";
import type { DecisionResult } from "./types";
import type { HistoricalIntelligence } from "./historyTypes";
import type { NewsEventId, PairId } from "../types/interfaces";
import { TRADING_PAIRS } from "../pairs";
import { buildCorrelationSnapshot } from "./intelligence/correlation/correlationEngine";
import {
  getDecisionTreeLabels,
  getDecisionTreeOrder,
  resolveTradeDecision,
} from "./intelligence/decisionTree";
import {
  buildHistoricalMatch,
  historicalMatchScore,
} from "./intelligence/history/historicalMatch";
import { buildIntelligenceNarrative } from "./intelligence/narrative";
import { assessRisk } from "./intelligence/risk/riskEngine";
import { buildScenarios } from "./intelligence/scenario/scenarioEngine";
import {
  computeReliabilityMeter,
  computeTradeImpactScore,
  resolveVolatilityBand,
} from "./intelligence/scoring/tradeImpactScore";
import type {
  DecisionTreeStep,
  TradeImpactIntelligence,
  WhyFactor,
} from "./intelligence/types";
import { applyScoreModifier, lookupRulesEngine } from "@/engine/shared/rulesBridge";

export interface IntelligenceInput {
  newsId: NewsEventId;
  pairId: PairId;
  decision: DecisionResult;
  historicalIntelligence: HistoricalIntelligence | null;
}

export function runIntelligenceEngine(input: IntelligenceInput): TradeImpactIntelligence {
  const rule = getNewsRule(input.newsId);
  const decision = input.decision;
  const intel = input.historicalIntelligence;
  const pair = TRADING_PAIRS.find((p) => p.id === input.pairId);
  const assetLabel = pair?.displayName ?? input.pairId;

  const historicalMatch = buildHistoricalMatch(intel, input.pairId);
  const histScore = historicalMatchScore(historicalMatch, intel?.confidenceScore ?? null);

  const correlation = buildCorrelationSnapshot(decision.usdDirection, input.pairId);

  const scoreBase = computeTradeImpactScore({
    historicalMatch: histScore,
    surpriseStrength: decision.surprise.strength,
    newsImportance: rule.importance,
    marketCorrelation: correlation.alignmentScore,
    impact: decision.surprise.impact,
  });
  const rulesBridge = lookupRulesEngine(input.newsId);
  const score = {
    ...scoreBase,
    total: applyScoreModifier(
      scoreBase.total,
      rulesBridge?.modifiers.tradeImpactScoreModifier ?? 1,
    ),
  };

  const reliability = computeReliabilityMeter(
    rule.historicalReliability,
    intel?.confidenceScore ?? null,
  );

  const volatilityBand = resolveVolatilityBand(decision.surprise.impact);

  const risk = assessRisk({
    impact: decision.surprise.impact,
    strength: decision.surprise.strength,
    reliability: reliability.level,
    isEstimate: decision.surprise.isEstimate,
    volatilityBand,
  });

  const selectedAsset =
    intel?.assets.find(
      (a) =>
        a.key ===
        (input.pairId === "XAUUSD"
          ? "gold"
          : input.pairId === "EURUSD"
            ? "eurusd"
            : input.pairId === "XAGUSD"
              ? "silver"
              : input.pairId === "BTCUSD"
                ? "btc"
                : "gold"),
    ) ?? intel?.assets[0];

  const scenarios = buildScenarios({
    pairId: input.pairId,
    assetLabel,
    pairDirection: decision.pairDirection,
    strength: decision.surprise.strength,
    averageAbsMove: selectedAsset?.averageAbsMove ?? null,
    unit: selectedAsset?.unit ?? null,
  });

  const tradeDecision = resolveTradeDecision({
    score: score.total,
    pairDirection: decision.pairDirection,
    strength: decision.surprise.strength,
    reliability: reliability.level,
    riskLevel: risk.level,
  });

  const narrative = buildIntelligenceNarrative({
    newsLabel: rule.label,
    surpriseSign: decision.surprise.sign,
    isEstimate: decision.surprise.isEstimate,
    usdDirection: decision.usdDirection,
    assetLabel,
    pairDirection: decision.pairDirection,
    winRatePct: historicalMatch.winRatePct,
    confidenceScore: score.total,
  });

  const decisionTree = buildDecisionTreeSteps({
    newsLabel: rule.label,
    importance: rule.importance,
    surprise: decision,
    histScore,
    historicalMatch,
    correlationAlignment: correlation.alignmentScore,
    volatilityBand,
    scoreTotal: score.total,
    reliabilityLabel: reliability.label,
    decisionLabel: tradeDecision.label,
  });

  const why = buildWhyFactors({
    score,
    reliability,
    historicalMatch,
    correlation,
    risk,
    decision: tradeDecision,
    surpriseStrength: decision.surprise.strength,
    newsLabel: rule.label,
  });

  return {
    score,
    reliability,
    historicalMatch,
    correlation,
    scenarios,
    risk,
    narrative,
    decision: tradeDecision,
    decisionTree,
    why,
    volatilityBand,
    impact: decision.surprise.impact,
    strength: decision.surprise.strength,
  };
}

function buildDecisionTreeSteps(input: {
  newsLabel: string;
  importance: number;
  surprise: DecisionResult;
  histScore: number;
  historicalMatch: TradeImpactIntelligence["historicalMatch"];
  correlationAlignment: number;
  volatilityBand: string;
  scoreTotal: number;
  reliabilityLabel: string;
  decisionLabel: string;
}): DecisionTreeStep[] {
  const labels = getDecisionTreeLabels();
  const order = getDecisionTreeOrder();

  const summaries: Record<string, { summary: string; detail: string }> = {
    news: {
      summary: input.newsLabel,
      detail: `Importance score ${input.importance}/100.`,
    },
    surprise: {
      summary: `${input.surprise.surprise.strength} · ${input.surprise.surprise.sign}`,
      detail: `Impact ${input.surprise.surprise.impact}; estimate=${input.surprise.surprise.isEstimate}.`,
    },
    history: {
      summary: `${input.historicalMatch.similarFound}/${input.historicalMatch.similarOf} similar`,
      detail: `Historical match pillar ${input.histScore}/100.`,
    },
    correlation: {
      summary: `Alignment ${input.correlationAlignment}/100`,
      detail: "USD map applied to the selected asset and related markets.",
    },
    volatility: {
      summary: input.volatilityBand,
      detail: "Expected volatility band derived from news impact.",
    },
    confidence: {
      summary: `${input.scoreTotal}/100 · ${input.reliabilityLabel}`,
      detail: "TradeImpact Score™ blended with reliability meter.",
    },
    recommendation: {
      summary: input.decisionLabel,
      detail: "Final leaf of the decision tree after all gates.",
    },
  };

  return order.map((id) => ({
    id: id as DecisionTreeStep["id"],
    label: labels[id] ?? id,
    summary: summaries[id]?.summary ?? "",
    detail: summaries[id]?.detail ?? "",
  }));
}

function buildWhyFactors(input: {
  score: TradeImpactIntelligence["score"];
  reliability: TradeImpactIntelligence["reliability"];
  historicalMatch: TradeImpactIntelligence["historicalMatch"];
  correlation: TradeImpactIntelligence["correlation"];
  risk: TradeImpactIntelligence["risk"];
  decision: TradeImpactIntelligence["decision"];
  surpriseStrength: string;
  newsLabel: string;
}): WhyFactor[] {
  const b = input.score.breakdown;
  const w = input.score.weights;
  return [
    {
      id: "score",
      title: "TradeImpact Score™",
      detail: `${input.score.total}/100 = Historical ${(w.historicalMatch * 100).toFixed(0)}% (${b.historicalMatch}) + Surprise ${(w.surpriseStrength * 100).toFixed(0)}% (${b.surpriseStrength}) + Importance ${(w.newsImportance * 100).toFixed(0)}% (${b.newsImportance}) + Correlation ${(w.marketCorrelation * 100).toFixed(0)}% (${b.marketCorrelation}) + Volatility ${(w.volatility * 100).toFixed(0)}% (${b.volatility}).`,
    },
    {
      id: "news",
      title: "News",
      detail: `${input.newsLabel} with ${input.surpriseStrength} surprise strength.`,
    },
    {
      id: "history",
      title: "Historical Match",
      detail: `${input.historicalMatch.similarFound}/${input.historicalMatch.similarOf} similar releases; reliability ${input.reliability.label}.`,
    },
    {
      id: "correlation",
      title: "Correlation",
      detail: `USD ${input.correlation.usdDirection}; selected pair alignment ${input.correlation.alignmentScore}/100.`,
    },
    {
      id: "risk",
      title: "Risk",
      detail: `${input.risk.label} — ${input.risk.why}`,
    },
    {
      id: "decision",
      title: "Recommendation",
      detail: `Decision tree resolved to ${input.decision.label}.`,
    },
  ];
}

export type { TradeImpactIntelligence };
