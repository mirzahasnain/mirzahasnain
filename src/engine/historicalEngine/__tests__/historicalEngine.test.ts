import { describe, expect, it } from "vitest";
import { processHistorical } from "../process";
import { mockCpiGoldHistory } from "../mocks/sample";

describe("historicalEngine", () => {
  it("returns structured historical match for CPI/Gold", () => {
    const result = processHistorical(mockCpiGoldHistory);
    expect(result.sampleSize).toBeGreaterThan(0);
    expect(result.historicalMatchScore).toBeGreaterThanOrEqual(0);
    expect(result.summary.similarReleases).toBe(result.matchCount);
  });

  it("handles unknown series safely", () => {
    const result = processHistorical({
      newsId: "unknown-series",
      pairId: "XAUUSD",
      surpriseSign: "positive",
    });
    expect(result.sampleSize).toBe(0);
    expect(result.historicalMatchScore).toBe(35);
  });
});
