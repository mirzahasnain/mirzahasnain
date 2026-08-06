import { describe, expect, it } from "vitest";
import { processVolatility } from "../process";
import { mockHighVolInput } from "../mocks/sample";

describe("volatilityEngine", () => {
  it("flags extreme volatility as less actionable", () => {
    const result = processVolatility(mockHighVolInput);
    expect(result.band).toBe("extreme");
    expect(result.actionable).toBe(false);
  });
});
