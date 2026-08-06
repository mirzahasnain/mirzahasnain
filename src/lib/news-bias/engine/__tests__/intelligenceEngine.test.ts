import { describe, expect, it } from "vitest";
import { decisionEngine } from "../decisionEngine";
import { buildHistoricalIntelligence } from "../historicalIntelligence";
import { runIntelligenceEngine } from "../intelligenceEngine";
import { computeTradeImpactScore, computeReliabilityMeter } from "../intelligence/scoring/tradeImpactScore";
import { buildHistoricalMatch, historicalMatchScore } from "../intelligence/history/historicalMatch";
import { buildCorrelationSnapshot } from "../intelligence/correlation/correlationEngine";
import { buildScenarios } from "../intelligence/scenario/scenarioEngine";
import { assessRisk } from "../intelligence/risk/riskEngine";
import { resolveTradeDecision, getDecisionTreeOrder } from "../intelligence/decisionTree";
import { buildAnalysis } from "../../logic";

describe("scoring / TradeImpact Score™", () => {
  it("weights pillars into a 0–100 score", () => {
    const score = computeTradeImpactScore({
      historicalMatch: 90,
      surpriseStrength: "strong",
      newsImportance: 95,
      marketCorrelation: 85,
      impact: "high",
    });
    expect(score.total).toBeGreaterThanOrEqual(70);
    expect(score.total).toBeLessThanOrEqual(100);
    expect(score.weights.historicalMatch).toBe(0.3);
    expect(score.weights.surpriseStrength).toBe(0.25);
    expect(score.weights.newsImportance).toBe(0.2);
    expect(score.weights.marketCorrelation).toBe(0.15);
    expect(score.weights.volatility).toBe(0.1);
  });

  it("maps reliability bands", () => {
    expect(computeReliabilityMeter(90, 88).label).toBe("Very High");
    expect(computeReliabilityMeter(10, 10).label).toBe("Very Low");
  });
});

describe("history / historical match", () => {
  it("builds similar release snapshot from intelligence", () => {
    const intel = buildHistoricalIntelligence({
      newsId: "cpi",
      surprise: 0.3,
      surpriseSign: "positive",
      newsLabel: "CPI",
    });
    const match = buildHistoricalMatch(intel, "XAUUSD");
    expect(match.similarOf).toBe(10);
    expect(match.similarFound).toBeGreaterThanOrEqual(0);
    expect(historicalMatchScore(match, intel?.confidenceScore ?? null)).toBeGreaterThanOrEqual(0);
  });
});

describe("correlation engine", () => {
  it("maps USD up to gold/silver/btc down and USDJPY up", () => {
    const snap = buildCorrelationSnapshot("bullish", "XAUUSD");
    const byId = Object.fromEntries(snap.links.map((l) => [l.pairId, l.move]));
    expect(byId.XAUUSD).toBe("down");
    expect(byId.XAGUSD).toBe("down");
    expect(byId.BTCUSD).toBe("down");
    expect(byId.EURUSD).toBe("down");
    expect(byId.USDJPY).toBe("up");
    expect(byId.USDCHF).toBe("up");
    expect(snap.alignmentScore).toBeGreaterThan(50);
  });
});

describe("scenario engine", () => {
  it("returns best / expected / worst cases", () => {
    const scenarios = buildScenarios({
      pairId: "XAUUSD",
      assetLabel: "Gold",
      pairDirection: "bearish",
      strength: "strong",
      averageAbsMove: 34,
      unit: "points",
    });
    expect(scenarios.cases.map((c) => c.id)).toEqual(["best", "expected", "worst"]);
    expect(scenarios.cases[1].move).toBeLessThan(0);
  });
});

describe("risk engine", () => {
  it("escalates risk for extreme strength", () => {
    const low = assessRisk({
      impact: "low",
      strength: "weak",
      reliability: "high",
      isEstimate: false,
      volatilityBand: "low",
    });
    const high = assessRisk({
      impact: "very-high",
      strength: "extreme",
      reliability: "low",
      isEstimate: true,
      volatilityBand: "extreme",
    });
    expect(high.score).toBeGreaterThan(low.score);
    expect(high.why.length).toBeGreaterThan(10);
  });
});

describe("decision tree", () => {
  it("follows News → … → Recommendation order", () => {
    expect(getDecisionTreeOrder()).toEqual([
      "news",
      "surprise",
      "history",
      "correlation",
      "volatility",
      "confidence",
      "recommendation",
    ]);
  });

  it("resolves aggressive sell on strong bearish high score", () => {
    const decision = resolveTradeDecision({
      score: 90,
      pairDirection: "bearish",
      strength: "extreme",
      reliability: "very-high",
      riskLevel: "medium",
    });
    expect(decision.id).toBe("aggressive-sell");
  });

  it("avoids when score is too low", () => {
    expect(
      resolveTradeDecision({
        score: 20,
        pairDirection: "bullish",
        strength: "strong",
        reliability: "high",
        riskLevel: "low",
      }).id,
    ).toBe("avoid");
  });
});

describe("intelligenceEngine orchestrator", () => {
  it("combines pillars into a full TIE result", () => {
    const decision = decisionEngine.decide({
      newsId: "cpi",
      currency: "USD",
      forecast: 0.2,
      previous: 0.1,
      actual: 0.5,
      outcome: null,
      pairId: "XAUUSD",
    });
    const hist = buildHistoricalIntelligence({
      newsId: "cpi",
      surprise: decision.surprise.difference,
      surpriseSign: decision.surprise.sign,
      newsLabel: "CPI",
    });
    const tie = runIntelligenceEngine({
      newsId: "cpi",
      pairId: "XAUUSD",
      decision,
      historicalIntelligence: hist,
    });

    expect(tie.score.total).toBeGreaterThan(0);
    expect(tie.decision.label.length).toBeGreaterThan(3);
    expect(tie.decisionTree).toHaveLength(7);
    expect(tie.why.length).toBeGreaterThanOrEqual(4);
    expect(tie.narrative.length).toBeGreaterThanOrEqual(3);
    expect(tie.scenarios.cases).toHaveLength(3);
    expect(tie.correlation.links.length).toBeGreaterThan(5);
  });
});

describe("buildAnalysis integration", () => {
  it("attaches intelligence view for the UI", () => {
    const analysis = buildAnalysis({
      eventId: "cpi",
      pairId: "XAUUSD",
      outcome: null,
      forecast: 0.2,
      previous: 0.1,
      actual: 0.5,
    });
    expect(analysis).not.toBeNull();
    expect(analysis!.intelligence.scoreTotal).toBeGreaterThan(0);
    expect(analysis!.intelligence.decisionLabel).toMatch(/Sell|Wait|Avoid|Buy/i);
    expect(analysis!.intelligence.why.length).toBeGreaterThan(0);
  });
});
