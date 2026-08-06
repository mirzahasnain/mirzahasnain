import { findEvent } from "./news";
import { findPair } from "./pairs";
import {
  decisionEngine,
  listPairDirections,
  type DecisionResult,
} from "./engine";
import { buildHistoricalIntelligence } from "./engine/historicalIntelligence";
import { runIntelligenceEngine } from "./engine/intelligenceEngine";
import type {
  Analysis,
  AnalysisRequest,
  HistoricalIntelligenceView,
  ReleaseValues,
  SurpriseReading,
  TradeImpactIntelligenceView,
} from "./types/interfaces";

/**
 * Composition root for the analysis UI.
 * Decision Engine + Historical Intelligence + TradeImpact Intelligence Engine.
 */
export function buildAnalysis(request: AnalysisRequest): Analysis | null {
  const event = findEvent(request.eventId);
  const pair = findPair(request.pairId);
  if (!event || !pair) return null;

  const hasNumbers = request.forecast !== null && request.actual !== null;
  if (!hasNumbers && request.outcome === null) return null;

  const decision = decisionEngine.decide({
    newsId: event.id,
    currency: "USD",
    forecast: request.forecast,
    previous: request.previous,
    actual: request.actual,
    outcome: request.outcome,
    pairId: pair.id,
  });

  const values = readValues(request);
  const surprise = toSurpriseReading(decision);
  const rawHistorical = buildHistoricalIntelligence({
    newsId: event.id,
    surprise: surprise.value,
    surpriseSign: surprise.sign,
    newsLabel: event.label,
  });
  const historicalIntelligence = toHistoricalView(rawHistorical);

  const intelligence = toIntelligenceView(
    runIntelligenceEngine({
      newsId: event.id,
      pairId: pair.id,
      decision,
      historicalIntelligence: rawHistorical,
    }),
  );

  const action: "buy" | "sell" | "wait" = intelligence.decisionId.includes("buy")
    ? "buy"
    : intelligence.decisionId.includes("sell")
      ? "sell"
      : "wait";

  return {
    event,
    pair,
    values,
    surprise,
    usdDirection: decision.usdDirection,
    pairDirection: decision.pairDirection,
    action,
    affectedAssets: listPairDirections(decision.usdDirection, pair.id),
    playbook: {
      ...decision.playbook,
      direction: action,
      confidence: intelligence.scoreTotal,
      reason: intelligence.narrative[0] ?? decision.playbook.reason,
    },
    historical: decision.historical,
    historicalIntelligence,
    intelligence,
    riskWarning: `${intelligence.riskLabel}: ${intelligence.riskWhy}`,
    summary: {
      recommendation: `${intelligence.decisionLabel} ${pair.displayName}`,
      confidence: intelligence.scoreTotal,
      impact: decision.summary.impact,
      reason: intelligence.narrative[0] ?? decision.summary.reason,
    },
    reason: intelligence.narrative.join(" "),
    analysisLines: mergeExplanations(
      intelligence.narrative,
      decision.explanation,
      historicalIntelligence?.summary ?? [],
    ),
  };
}

function toIntelligenceView(
  intel: ReturnType<typeof runIntelligenceEngine>,
): TradeImpactIntelligenceView {
  return {
    scoreTotal: intel.score.total,
    scoreBreakdown: { ...intel.score.breakdown },
    reliabilityLabel: intel.reliability.label,
    decisionLabel: intel.decision.label,
    decisionId: intel.decision.id,
    narrative: intel.narrative,
    historicalSimilar: `${intel.historicalMatch.similarFound} / ${intel.historicalMatch.similarOf}`,
    averageMoves: intel.historicalMatch.averageMoves.map((m) => ({
      label: m.label,
      display: `${m.averageMove} ${m.unit}`,
    })),
    scenarios: intel.scenarios.cases.map((c) => ({
      label: c.label,
      display: c.display,
    })),
    riskLabel: intel.risk.label,
    riskWhy: intel.risk.why,
    correlation: intel.correlation.links.map((l) => ({
      label: l.label,
      move: l.move === "up" ? "↑" : l.move === "down" ? "↓" : "→",
    })),
    why: intel.why.map((w) => ({ title: w.title, detail: w.detail })),
    decisionTree: intel.decisionTree.map((s) => ({
      label: s.label,
      summary: s.summary,
      detail: s.detail,
    })),
    volatilityLabel:
      intel.volatilityBand.charAt(0).toUpperCase() +
      intel.volatilityBand.slice(1),
  };
}

function readValues(request: AnalysisRequest): ReleaseValues | null {
  if (request.forecast === null || request.actual === null) return null;

  return {
    forecast: request.forecast,
    previous: request.previous,
    actual: request.actual,
  };
}

function toSurpriseReading(decision: DecisionResult): SurpriseReading {
  return {
    value: decision.surprise.difference,
    percentage: decision.surprise.percentageSurprise,
    sign: decision.surprise.sign,
    strength: decision.surprise.strength,
    impact: decision.surprise.impact,
    confidence: decision.confidence.score,
    isEstimate: decision.surprise.isEstimate,
  };
}

function toHistoricalView(
  intel: ReturnType<typeof buildHistoricalIntelligence>,
): HistoricalIntelligenceView | null {
  if (!intel) return null;

  return {
    newsId: intel.newsId,
    newsLabel: intel.newsLabel,
    sampleSize: intel.sampleSize,
    surprise: intel.surprise,
    surpriseSign: intel.surpriseSign,
    band: intel.band,
    confidenceScore: intel.confidenceScore,
    summary: intel.summary,
    assets: intel.assets,
    matches: intel.matches.map((m) => ({
      date: m.record.date,
      forecast: m.record.forecast,
      actual: m.record.actual,
      previous: m.record.previous,
      surprise: m.record.surprise,
      score: m.score,
      gold_move: m.record.gold_move,
      silver_move: m.record.silver_move,
      eurusd_move: m.record.eurusd_move,
      gbpusd_move: m.record.gbpusd_move,
      btc_move: m.record.btc_move,
      eth_move: m.record.eth_move,
      nasdaq_move: m.record.nasdaq_move,
      us30_move: m.record.us30_move,
      direction: m.record.direction,
    })),
    timeline: intel.timeline,
    chart: intel.chart,
  };
}

function mergeExplanations(
  narrative: string[],
  decision: string[],
  historical: string[],
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of [...narrative, ...decision, ...historical]) {
    if (seen.has(line)) continue;
    seen.add(line);
    out.push(line);
    if (out.length >= 8) break;
  }
  return out;
}

/** @deprecated Prefer decisionEngine.decide — kept for older call sites / tests. */
export function measureSurprise(values: ReleaseValues): SurpriseReading {
  const decision = decisionEngine.decide({
    newsId: "cpi",
    currency: "USD",
    forecast: values.forecast,
    previous: values.previous,
    actual: values.actual,
    outcome: null,
    pairId: "XAUUSD",
  });
  return toSurpriseReading(decision);
}

/** @deprecated Prefer decisionEngine.decide */
export function estimateSurprise(
  sign: AnalysisRequest["outcome"],
): SurpriseReading | null {
  if (!sign) return null;
  const decision = decisionEngine.decide({
    newsId: "cpi",
    currency: "USD",
    forecast: null,
    previous: null,
    actual: null,
    outcome: sign,
    pairId: "XAUUSD",
  });
  return toSurpriseReading(decision);
}
