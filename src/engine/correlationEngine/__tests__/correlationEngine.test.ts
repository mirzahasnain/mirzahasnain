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
});
