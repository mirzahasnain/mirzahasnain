import { describe, expect, it } from "vitest";
import { processCorrelation, resolveUsdBias } from "../process";
import { mockUsdBullishGold } from "../mocks/sample";

describe("correlationEngine", () => {
  it("maps USD bullish → Gold bearish", () => {
    const result = processCorrelation(mockUsdBullishGold);
    expect(result.pairDirection).toBe("bearish");
    expect(result.affectedAssets.length).toBeGreaterThan(0);
  });

  it("resolves inverted unemployment logic", () => {
    expect(resolveUsdBias("higher_is_usd_bearish", "positive")).toBe("bearish");
  });

  it("resolves hawkish FOMC as USD bullish", () => {
    expect(resolveUsdBias("hawkish_is_usd_bullish", "positive")).toBe("bullish");
    expect(resolveUsdBias("hawkish_is_usd_bullish", "negative")).toBe("bearish");
  });

  it("maps AUDUSD and NZDUSD when USD rises", () => {
    const aud = processCorrelation({
      usdDirection: "bullish",
      selectedPairId: "AUDUSD",
    });
    const nzd = processCorrelation({
      usdDirection: "bullish",
      selectedPairId: "NZDUSD",
    });
    expect(aud.pairDirection).toBe("bearish");
    expect(nzd.pairDirection).toBe("bearish");
    expect(aud.alignmentScore).toBeGreaterThan(50);
    expect(nzd.alignmentScore).toBeGreaterThan(50);
  });
});
