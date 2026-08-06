import { describe, expect, it, beforeEach } from "vitest";
import {
  RuleRegistry,
  resetRuleRegistry,
  validateRule,
  loadAllRules,
  loadManifest,
  resolveRule,
  resolveConflicts,
  generateCoverageReport,
  EXPECTED_EVENT_IDS,
} from "@/rules";

describe("TradeImpact Rules Engine", () => {
  beforeEach(() => {
    resetRuleRegistry();
  });

  it("loads manifest with six categories", () => {
    const manifest = loadManifest();
    expect(manifest.categories).toEqual([
      "macro",
      "forex",
      "commodities",
      "crypto",
      "indices",
      "central-banks",
    ]);
    expect(manifest.markets.length).toBe(14);
  });

  it("loads and validates all JSON rules", () => {
    const rules = loadAllRules({ validate: true });
    expect(rules.length).toBeGreaterThanOrEqual(EXPECTED_EVENT_IDS.length);
    for (const rule of rules) {
      const result = validateRule(rule);
      expect(result.ok, `${rule.id}: ${JSON.stringify(result.issues)}`).toBe(true);
    }
  });

  it("registers without duplicate ids", () => {
    const registry = new RuleRegistry();
    expect(registry.size()).toBe(loadAllRules().length);
    expect(registry.get("cpi")?.priority).toBe("Critical");
    expect(registry.get("fomc")?.category).toBe("central-banks");
  });

  it("resolves inheritance for CPI from metals profile", () => {
    const registry = new RuleRegistry();
    const resolved = resolveRule(registry, "cpi");
    expect(resolved.resolution.inheritedFrom).toContain("metals-profile");
    expect(resolved.marketLogic.XAUUSD.bearish.length).toBeGreaterThan(0);
    expect(resolved.id).toBe("cpi");
  });

  it("resolves NFP vs unemployment with Critical labor collision", () => {
    const registry = new RuleRegistry();
    const result = resolveConflicts(registry, {
      ruleIds: ["nfp", "unemployment-rate"],
    });
    expect(result.winner.id).toBeTruthy();
    expect(result.ranked).toHaveLength(2);
    // NFP has higher importance in our corpus
    expect(result.winner.id).toBe("nfp");
  });

  it("applies currency preference override in conflicts", () => {
    const registry = new RuleRegistry();
    const result = resolveConflicts(registry, {
      ruleIds: ["cpi", "ism-manufacturing"],
      context: { preferCurrency: "USD" },
    });
    expect(result.winner.affectedCurrency).toBe("USD");
  });

  it("covers expected event catalog", () => {
    const report = generateCoverageReport(new RuleRegistry());
    expect(report.missingRules).toEqual([]);
    expect(report.duplicateRules).toEqual([]);
    expect(report.missingMarketLogic).toEqual([]);
    expect(report.readinessPercent).toBeGreaterThanOrEqual(95);
  });

  it("requires bullish/bearish/neutral logic for every market", () => {
    const cpi = new RuleRegistry().require("cpi");
    for (const mid of cpi.marketsAffected) {
      const logic = cpi.marketLogic[mid];
      expect(logic.bullish).toBeTruthy();
      expect(logic.bearish).toBeTruthy();
      expect(logic.neutral).toBeTruthy();
    }
  });

  it("flags invalid rules", () => {
    const result = validateRule({ id: "broken" });
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.severity === "error")).toBe(true);
  });
});
