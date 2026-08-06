import { describe, expect, it } from "vitest";
import { application } from "@/config/application";
import { SCORE_WEIGHTS, LIMITS } from "@/config/constants";
import { routes } from "@/config/routes";
import { PAIR_MAPPINGS, getPairMapping } from "@/config/pairMappings";
import { NEWS_SERIES_IDS } from "@/config/newsRules";

describe("config foundation", () => {
  it("exposes TradeImpact product identity", () => {
    expect(application.name).toBe("TradeImpact");
    expect(application.tagline).toContain("Impact");
  });

  it("keeps TradeImpact Score weights summing to 1", () => {
    const sum =
      SCORE_WEIGHTS.historicalMatch +
      SCORE_WEIGHTS.surpriseStrength +
      SCORE_WEIGHTS.newsImportance +
      SCORE_WEIGHTS.marketCorrelation +
      SCORE_WEIGHTS.volatility;
    expect(sum).toBeCloseTo(1, 10);
  });

  it("defines canonical routes", () => {
    expect(routes.workspace).toBe("/workspace");
    expect(routes.calendar).toBe("/calendar");
    expect(routes.event("usd-cpi")).toBe("/event/usd-cpi");
  });

  it("maps gold pair for watchlist defaults", () => {
    expect(getPairMapping("XAUUSD")?.assetKey).toBe("gold");
    expect(PAIR_MAPPINGS.length).toBeGreaterThan(8);
    expect(NEWS_SERIES_IDS).toContain("cpi");
  });

  it("keeps cache defaults within PRD bounds", () => {
    expect(LIMITS.defaultCacheTtlMs).toBe(60_000);
    expect(LIMITS.providerMaxRetries).toBe(3);
  });
});
