import { describe, expect, it } from "vitest";
import { createDecisionEngine, runDecision } from "../decisionEngine";

describe("decisionEngine", () => {
  it("marks gold bearish on a hot CPI print (USD bullish)", () => {
    const result = runDecision({
      newsId: "cpi",
      currency: "USD",
      forecast: 0.2,
      previous: 0.1,
      actual: 0.5,
      outcome: null,
      pairId: "XAUUSD",
    });

    expect(result.usdDirection).toBe("bullish");
    expect(result.pairDirection).toBe("bearish");
    expect(result.action).toBe("sell");
    expect(result.summary.recommendation).toBe("SELL GOLD");
    expect(result.playbook.expectedMove).not.toBeNull();
    expect(result.explanation.length).toBeGreaterThanOrEqual(3);
    expect(result.riskWarning.length).toBeGreaterThan(10);
    expect(result.pairBiases.EURUSD).toBe("bearish");
    expect(result.pairBiases.USDJPY).toBe("bullish");
  });

  it("inverts unemployment: higher print → USD bearish → gold bullish", () => {
    const result = runDecision({
      newsId: "unemployment-rate",
      currency: "USD",
      forecast: 4.1,
      previous: 4.0,
      actual: 4.4,
      outcome: null,
      pairId: "XAUUSD",
    });

    expect(result.usdDirection).toBe("bearish");
    expect(result.pairDirection).toBe("bullish");
    expect(result.action).toBe("buy");
    expect(result.summary.recommendation).toBe("BUY GOLD");
  });

  it("treats hawkish FOMC as USD bullish", () => {
    const result = runDecision({
      newsId: "fomc-statement",
      currency: "USD",
      forecast: null,
      previous: null,
      actual: null,
      outcome: "positive",
      pairId: "EURUSD",
    });

    expect(result.usdDirection).toBe("bullish");
    expect(result.pairDirection).toBe("bearish");
    expect(result.action).toBe("sell");
    expect(result.surprise.isEstimate).toBe(true);
  });

  it("returns WAIT on an in-line print", () => {
    const result = runDecision({
      newsId: "nfp",
      currency: "USD",
      forecast: 175,
      previous: 147,
      actual: 175,
      outcome: null,
      pairId: "BTCUSD",
    });

    expect(result.action).toBe("wait");
    expect(result.usdDirection).toBe("neutral");
    expect(result.summary.recommendation).toContain("WAIT");
  });

  it("supports dependency injection of custom rules", () => {
    const engine = createDecisionEngine({
      newsRules: {
        cpi: {
          id: "cpi",
          label: "CPI",
          importance: 50,
          historicalReliability: 50,
          interpretation: "higher_is_usd_bearish",
          toneMode: "numeric",
          higherLabel: "Higher",
          lowerLabel: "Lower",
          riskWarning: "Test warning.",
        },
      },
    });

    const result = engine.decide({
      newsId: "cpi",
      currency: "USD",
      forecast: 0.2,
      previous: 0.1,
      actual: 0.5,
      outcome: null,
      pairId: "XAUUSD",
    });

    // Custom rule flips CPI: higher → USD bearish → gold bullish
    expect(result.usdDirection).toBe("bearish");
    expect(result.pairDirection).toBe("bullish");
    expect(result.riskWarning).toBe("Test warning.");
  });

  it("attaches historical statistics for CPI / Gold", () => {
    const result = runDecision({
      newsId: "cpi",
      currency: "USD",
      forecast: 0.2,
      previous: 0.1,
      actual: 0.3,
      outcome: null,
      pairId: "XAUUSD",
    });

    expect(result.historical?.sampleSize).toBe(20);
    expect(result.historical?.averageMove).toBe(34);
    expect(result.historical?.winRate).toBe(78);
  });
});
