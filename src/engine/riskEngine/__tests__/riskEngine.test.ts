import { describe, expect, it } from "vitest";
import { processRisk } from "../process";
import { mockElevatedRisk } from "../mocks/sample";

describe("riskEngine", () => {
  it("elevates risk for extreme NFP-like conditions", () => {
    const result = processRisk(mockElevatedRisk);
    expect(["high", "very-high"]).toContain(result.level);
    expect(typeof result.why).toBe("string");
    expect(result.suggestedRiskPct).toBeGreaterThanOrEqual(0);
  });
});
