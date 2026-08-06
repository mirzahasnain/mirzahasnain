import { describe, expect, it, beforeEach } from "vitest";
import { clearHistoryCache } from "../historyEngine";
import {
  clearSimilarityCache,
  findSimilarReleases,
  resolveBand,
  scoreMatch,
} from "../similarityEngine";
import type { HistoricalReleaseRecord } from "../historyTypes";

describe("similarityEngine", () => {
  beforeEach(() => {
    clearHistoryCache();
    clearSimilarityCache();
  });

  it("builds a band around today's surprise", () => {
    const band = resolveBand(1.6);
    expect(band.min).toBeLessThan(1.6);
    expect(band.max).toBeGreaterThan(1.6);
    expect(band.max - band.min).toBeGreaterThanOrEqual(0.3);
  });

  it("scores same-direction close surprises higher", () => {
    const record: HistoricalReleaseRecord = {
      date: "2026-01-01",
      forecast: 50,
      actual: 51.5,
      previous: 49,
      surprise: 1.5,
      gold_move: -30,
      silver_move: -0.3,
      eurusd_move: -25,
      gbpusd_move: -28,
      btc_move: -2,
      eth_move: -2.5,
      nasdaq_move: -100,
      us30_move: -150,
      direction: "usd_bullish",
    };

    const close = scoreMatch(record, 1.6, "positive");
    const far = scoreMatch({ ...record, surprise: 0.2 }, 1.6, "positive");

    expect(close.score).toBeGreaterThan(far.score);
    expect(close.score).toBeGreaterThanOrEqual(70);
  });

  it("returns similar PMI releases around +1.5", () => {
    const matches = findSimilarReleases({
      newsId: "ism-manufacturing-pmi",
      surprise: 1.6,
      surpriseSign: "positive",
      limit: 10,
    });

    expect(matches.length).toBeGreaterThan(0);
    expect(matches.length).toBeLessThanOrEqual(10);
    for (const match of matches) {
      expect(match.record.surprise).toBeGreaterThan(0);
      expect(match.score).toBeGreaterThan(0);
    }
  });

  it("returns empty when surprise is null", () => {
    const matches = findSimilarReleases({
      newsId: "cpi",
      surprise: null,
      surpriseSign: "positive",
    });
    expect(matches).toEqual([]);
  });
});
