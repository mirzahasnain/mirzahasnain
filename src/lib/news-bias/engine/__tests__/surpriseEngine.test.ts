import { describe, expect, it } from "vitest";
import { computeSurprise } from "../surpriseEngine";

describe("surpriseEngine", () => {
  it("computes difference, percentage, positive sign and strength", () => {
    const result = computeSurprise({
      forecast: 0.2,
      actual: 0.4,
      outcome: null,
    });

    expect(result.difference).toBe(0.2);
    expect(result.percentageSurprise).toBe(100);
    expect(result.sign).toBe("positive");
    expect(result.isEstimate).toBe(false);
    expect(result.strength).toBe("weak");
  });

  it("classifies a large absolute surprise as extreme", () => {
    const result = computeSurprise({
      forecast: 50,
      actual: 53,
      outcome: null,
    });

    expect(result.difference).toBe(3);
    expect(result.strength).toBe("extreme");
    expect(result.sign).toBe("positive");
  });

  it("returns flat / neutral when actual matches forecast", () => {
    const result = computeSurprise({
      forecast: 49.5,
      actual: 49.5,
      outcome: null,
    });

    expect(result.difference).toBe(0);
    expect(result.percentageSurprise).toBe(0);
    expect(result.sign).toBe("flat");
    expect(result.strength).toBe("neutral");
  });

  it("falls back to a moderate estimate from a tapped outcome", () => {
    const result = computeSurprise({
      forecast: null,
      actual: null,
      outcome: "negative",
    });

    expect(result.difference).toBeNull();
    expect(result.percentageSurprise).toBeNull();
    expect(result.sign).toBe("negative");
    expect(result.strength).toBe("moderate");
    expect(result.isEstimate).toBe(true);
  });

  it("handles a zero forecast without throwing", () => {
    const result = computeSurprise({
      forecast: 0,
      actual: 0.1,
      outcome: null,
    });

    expect(result.difference).toBe(0.1);
    expect(result.percentageSurprise).toBeNull();
    expect(result.sign).toBe("positive");
  });
});
