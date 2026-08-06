import { describe, expect, it } from "vitest";
import { processSurprise } from "../process";
import {
  mockEstimateBeatInput,
  mockHotCpiSurpriseInput,
  mockInlineSurpriseInput,
} from "../mocks/sample";

describe("surpriseEngine", () => {
  it("computes hot CPI surprise as positive", () => {
    const result = processSurprise(mockHotCpiSurpriseInput);
    expect(result.sign).toBe("positive");
    expect(result.difference).toBeCloseTo(0.3);
    expect(result.isEstimate).toBe(false);
    expect(result.bucket).not.toBe("inline");
  });

  it("marks inline prints", () => {
    const result = processSurprise(mockInlineSurpriseInput);
    expect(result.sign).toBe("flat");
    expect(result.bucket).toBe("inline");
  });

  it("supports estimate outcomes", () => {
    const result = processSurprise(mockEstimateBeatInput);
    expect(result.isEstimate).toBe(true);
    expect(result.sign).toBe("positive");
  });
});
