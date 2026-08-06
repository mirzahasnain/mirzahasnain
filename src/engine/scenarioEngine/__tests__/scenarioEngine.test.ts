import { describe, expect, it } from "vitest";
import { processScenario } from "../process";
import { mockGoldScenario } from "../mocks/sample";

describe("scenarioEngine", () => {
  it("returns best/expected/worst structured cases", () => {
    const result = processScenario(mockGoldScenario);
    expect(result.cases).toHaveLength(3);
    expect(result.expectedMove.unit).toBe("points");
    expect(result.expectedMove.value).toBeLessThan(0);
  });
});
