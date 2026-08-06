import { describe, expect, it } from "vitest";
import { listEventIdAliases, toBrainEventId, toRulesEventId } from "../eventIdAliases";
import { lookupRulesEngine, newsRuleFromRulesEngine } from "../rulesBridge";
import { getNewsRule } from "../newsRules";

describe("eventIdAliases", () => {
  it("maps both directions for FOMC / ISM / rates", () => {
    expect(toBrainEventId("fomc")).toBe("fomc-statement");
    expect(toRulesEventId("fomc-statement")).toBe("fomc");
    expect(toBrainEventId("interest-rate")).toBe("interest-rate-decision");
    expect(toRulesEventId("ism-services-pmi")).toBe("ism-services");
  });

  it("exposes alias tables", () => {
    const tables = listEventIdAliases();
    expect(tables.rulesToBrain.fomc).toBe("fomc-statement");
    expect(tables.brainToRules["fomc-statement"]).toBe("fomc");
  });
});

describe("rulesBridge", () => {
  it("looks up CPI modifiers from Rules Engine", () => {
    const bridge = lookupRulesEngine("cpi");
    expect(bridge).not.toBeNull();
    expect(bridge!.provenance.ruleId).toBe("cpi");
    expect(bridge!.modifiers.tradeImpactScoreModifier).toBeGreaterThan(1);
  });

  it("resolves ADP via Rules Engine when Brain has entry", () => {
    const rule = getNewsRule("adp");
    expect(rule.id).toBe("adp");
    expect(rule.importance).toBeGreaterThan(50);
  });

  it("can synthesize a rule from Rules Engine alone", () => {
    const synthesized = newsRuleFromRulesEngine("jolts");
    expect(synthesized).not.toBeNull();
    expect(synthesized!.interpretation).toBe("higher_is_usd_bullish");
  });
});
