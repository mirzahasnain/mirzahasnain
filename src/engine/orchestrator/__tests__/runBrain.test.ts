import { describe, expect, it } from "vitest";
import { runTradeImpactBrain } from "../runBrain";
import { mockHotCpiGoldBrainInput, mockPreReleaseCpiInput } from "../mocks/sample";

describe("runTradeImpactBrain", () => {
  it("runs the full pipeline for hot CPI → Gold", () => {
    const result = runTradeImpactBrain(mockHotCpiGoldBrainInput);
    expect(result.surprise.sign).toBe("positive");
    expect(result.usdBias).toBe("bullish");
    expect(result.correlation.pairDirection).toBe("bearish");
    expect(result.score.total).toBeGreaterThan(0);
    expect(result.decision.decisionId).toBeTruthy();
    expect(result.playbook.setup.asset).toBe("XAUUSD");
    expect(result.meta.executionOrder[0]).toBe("newsRule");
    expect(result.meta.executionOrder.at(-1)).toBe("playbook");
  });

  it("defaults to Wait in pre-release mode", () => {
    const result = runTradeImpactBrain(mockPreReleaseCpiInput);
    expect(result.meta.mode).toBe("pre_release");
    expect(result.decision.decisionId).toBe("wait");
  });

  it("never returns plain-string primary outputs", () => {
    const result = runTradeImpactBrain(mockHotCpiGoldBrainInput);
    expect(typeof result.surprise).toBe("object");
    expect(typeof result.confidence).toBe("object");
    expect(typeof result.risk).toBe("object");
    expect(typeof result.score).toBe("object");
    expect(typeof result.historical).toBe("object");
    expect(typeof result.decision).toBe("object");
  });

  it("wires Rules Engine provenance and modifiers for CPI", () => {
    const result = runTradeImpactBrain(mockHotCpiGoldBrainInput);
    expect(result.meta.rules?.ruleId).toBe("cpi");
    expect(result.meta.modifiers.tradeImpactScoreModifier).toBeGreaterThan(1);
    expect(result.meta.modifiers.confidenceModifier).toBeGreaterThan(1);
  });

  it("resolves Rules Engine alias ids (fomc → fomc-statement)", () => {
    const result = runTradeImpactBrain({
      newsId: "fomc",
      forecast: null,
      previous: null,
      actual: null,
      outcome: "beat",
      pairId: "EURUSD",
      mode: "post_release",
    });
    expect(result.newsRule.id).toBe("fomc-statement");
    expect(result.newsRule.interpretation).toBe("hawkish_is_usd_bullish");
    expect(result.usdBias).toBe("bullish");
    expect(result.meta.rules?.ruleId).toBe("fomc");
  });

  it("maps AUDUSD correctly through the full Brain", () => {
    const result = runTradeImpactBrain({
      newsId: "cpi",
      forecast: 3.0,
      previous: 2.9,
      actual: 3.4,
      pairId: "AUDUSD",
      mode: "post_release",
    });
    expect(result.usdBias).toBe("bullish");
    expect(result.correlation.pairDirection).toBe("bearish");
  });
});
