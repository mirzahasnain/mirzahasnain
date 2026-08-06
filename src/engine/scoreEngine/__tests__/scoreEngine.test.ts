import { describe, expect, it } from "vitest";
import { processScore } from "../process";
import { mockStrongScoreInput } from "../mocks/sample";

describe("scoreEngine", () => {
  it("computes TradeImpact Score™ with five pillars", () => {
    const result = processScore(mockStrongScoreInput);
    expect(result.total).toBeGreaterThan(70);
    expect(result.weights.historicalMatch).toBeCloseTo(0.3);
    expect(result.modelVersion).toBe("scoreWeights.v1");
    expect(result.reliability.level).toBeTruthy();
  });
});
