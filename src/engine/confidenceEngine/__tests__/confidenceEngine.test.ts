import { describe, expect, it } from "vitest";
import { processConfidence } from "../process";
import { mockConfidenceInput } from "../mocks/sample";

describe("confidenceEngine", () => {
  it("returns a 0–100 structured score", () => {
    const result = processConfidence(mockConfidenceInput);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.importance).toBe(mockConfidenceInput.rule.importance);
  });

  it("reduces score for estimates", () => {
    const measured = processConfidence(mockConfidenceInput);
    const estimate = processConfidence({ ...mockConfidenceInput, isEstimate: true });
    expect(estimate.score).toBeLessThanOrEqual(measured.score);
  });
});
