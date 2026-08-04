import { describe, expect, it } from "vitest";
import { computeConfidence } from "../confidenceEngine";
import { getNewsRule } from "../newsRules";

describe("confidenceEngine", () => {
  it("scores higher for extreme surprises on high-importance news", () => {
    const cpi = getNewsRule("cpi");
    const extreme = computeConfidence({ rule: cpi, strength: "extreme" });
    const weak = computeConfidence({ rule: cpi, strength: "weak" });

    expect(extreme.score).toBeGreaterThan(weak.score);
    expect(extreme.score).toBeGreaterThanOrEqual(85);
    expect(extreme.importance).toBe(cpi.importance);
    expect(extreme.historicalReliability).toBe(cpi.historicalReliability);
  });

  it("reduces confidence for estimates", () => {
    const nfp = getNewsRule("nfp");
    const measured = computeConfidence({
      rule: nfp,
      strength: "moderate",
      isEstimate: false,
    });
    const estimate = computeConfidence({
      rule: nfp,
      strength: "moderate",
      isEstimate: true,
    });

    expect(estimate.score).toBeLessThan(measured.score);
  });

  it("clamps to 0-100", () => {
    const fomc = getNewsRule("fomc-statement");
    const result = computeConfidence({ rule: fomc, strength: "extreme" });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
