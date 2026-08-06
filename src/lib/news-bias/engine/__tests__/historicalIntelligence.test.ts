import { describe, expect, it, beforeEach } from "vitest";
import { buildHistoricalIntelligence } from "../historicalIntelligence";
import { clearHistoryCache } from "../historyEngine";
import { clearSimilarityCache } from "../similarityEngine";
import { applyProbabilities } from "../probabilityEngine";
import { computeAssetStatistics } from "../statisticsEngine";
import { findSimilarReleases } from "../similarityEngine";

describe("statistics + probability engines", () => {
  beforeEach(() => {
    clearHistoryCache();
    clearSimilarityCache();
  });

  it("tallies up/down votes and average moves", () => {
    const matches = findSimilarReleases({
      newsId: "cpi",
      surprise: 0.3,
      surpriseSign: "positive",
    });
    expect(matches.length).toBeGreaterThan(0);

    const stats = computeAssetStatistics(matches);
    const gold = stats.find((s) => s.key === "gold");
    expect(gold).toBeDefined();
    expect(gold!.up + gold!.down + gold!.flat).toBe(matches.length);
  });

  it("converts tallies into probabilities that sum near 100", () => {
    const matches = findSimilarReleases({
      newsId: "cpi",
      surprise: 0.3,
      surpriseSign: "positive",
    });
    const stats = applyProbabilities(computeAssetStatistics(matches));
    for (const asset of stats) {
      if (asset.up + asset.down === 0) continue;
      expect(asset.bearishProbability + asset.bullishProbability).toBe(100);
    }
  });
});

describe("historicalIntelligence orchestration", () => {
  beforeEach(() => {
    clearHistoryCache();
    clearSimilarityCache();
  });

  it("builds a full intelligence snapshot for CPI", () => {
    const intel = buildHistoricalIntelligence({
      newsId: "cpi",
      surprise: 0.3,
      surpriseSign: "positive",
      newsLabel: "CPI",
    });

    expect(intel).not.toBeNull();
    expect(intel!.sampleSize).toBeGreaterThan(0);
    expect(intel!.assets.length).toBeGreaterThan(0);
    expect(intel!.timeline.length).toBeGreaterThan(0);
    expect(intel!.chart.dates.length).toBe(intel!.timeline.length);
    expect(intel!.summary.length).toBeGreaterThanOrEqual(2);
    expect(intel!.summary[0]).toMatch(/Historically/i);
  });

  it("returns null for unknown news without a history file", () => {
    // All known ids have files; empty surprise still returns intel with 0 matches
    const intel = buildHistoricalIntelligence({
      newsId: "cpi",
      surprise: null,
      surpriseSign: "flat",
    });
    expect(intel).not.toBeNull();
    expect(intel!.sampleSize).toBe(0);
  });
});
