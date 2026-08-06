import { describe, expect, it } from "vitest";
import { processDecision } from "../process";
import { mockAvoidInput, mockConservativeSellInput } from "../mocks/sample";

describe("decisionEngine", () => {
  it("recommends sell family for bearish high-score setups", () => {
    const result = processDecision(mockConservativeSellInput);
    expect(result.decisionId).toMatch(/sell/);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it("forces Avoid on very-high risk", () => {
    const result = processDecision(mockAvoidInput);
    expect(result.decisionId).toBe("avoid");
  });

  it("waits pre-release", () => {
    const result = processDecision({
      ...mockConservativeSellInput,
      mode: "pre_release",
    });
    expect(result.decisionId).toBe("wait");
  });
});
