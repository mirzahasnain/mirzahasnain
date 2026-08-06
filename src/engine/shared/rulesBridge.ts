/**
 * Bridge: Rules Engine IP → TradeImpact Brain.
 * Looks up configurable modifiers / bias without embedding rules in React.
 */
import { getRuleRegistry, resolveRule } from "@/rules";
import type { PrimaryBias, ResolvedRule } from "@/rules";
import { clamp } from "./math";
import { toRulesEventId } from "./eventIdAliases";
import type { NewsInterpretation, NewsRule } from "./types";

export interface RulesModifiers {
  confidenceModifier: number;
  tradeImpactScoreModifier: number;
  riskModifier: number;
  correlationWeight: number;
  fakeSpikeProbability: number;
}

export interface RulesProvenance {
  ruleId: string;
  version: string;
  category: string;
  priority: string;
  sourceIds: string[];
}

export interface RulesBridgeResult {
  resolved: ResolvedRule;
  modifiers: RulesModifiers;
  provenance: RulesProvenance;
  primaryBias: PrimaryBias;
}

const IDENTITY_MODIFIERS: RulesModifiers = {
  confidenceModifier: 1,
  tradeImpactScoreModifier: 1,
  riskModifier: 1,
  correlationWeight: 1,
  fakeSpikeProbability: 0.5,
};

/** Lookup a Rules Engine event by Brain or Rules id. Profiles are skipped. */
export function lookupRulesEngine(newsId: string): RulesBridgeResult | null {
  const rulesId = toRulesEventId(newsId);
  const registry = getRuleRegistry();
  const raw = registry.get(rulesId);
  if (!raw || raw.type !== "event") return null;

  const resolved = resolveRule(registry, rulesId);
  return {
    resolved,
    modifiers: {
      confidenceModifier: resolved.confidenceModifier,
      tradeImpactScoreModifier: resolved.tradeImpactScoreModifier,
      riskModifier: resolved.riskModifier,
      correlationWeight: resolved.correlationWeight,
      fakeSpikeProbability: resolved.fakeSpikeProbability,
    },
    provenance: {
      ruleId: resolved.id,
      version: resolved.version,
      category: resolved.category,
      priority: resolved.priority,
      sourceIds: resolved.resolution.sourceIds,
    },
    primaryBias: resolved.primaryBias,
  };
}

export function identityModifiers(): RulesModifiers {
  return { ...IDENTITY_MODIFIERS };
}

export function mapPrimaryBiasToInterpretation(bias: PrimaryBias): NewsInterpretation {
  if (bias === "higher_is_usd_bearish") return "higher_is_usd_bearish";
  if (bias === "hawkish_is_usd_bullish") return "hawkish_is_usd_bullish";
  return "higher_is_usd_bullish";
}

/** Build a Brain NewsRule from Rules Engine when Brain JSON has no entry. */
export function newsRuleFromRulesEngine(newsId: string): NewsRule | null {
  const bridge = lookupRulesEngine(newsId);
  if (!bridge) return null;
  const r = bridge.resolved;
  const hawkish = r.primaryBias === "hawkish_is_usd_bullish";
  return {
    id: newsId,
    label: r.id
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" "),
    importance: r.importance,
    historicalReliability: r.historicalReliability,
    interpretation: mapPrimaryBiasToInterpretation(r.primaryBias),
    toneMode: hawkish ? "hawkish_dovish" : "numeric",
    higherLabel: hawkish ? "Hawkish" : "Higher than Forecast",
    lowerLabel: hawkish ? "Dovish" : "Lower than Forecast",
    riskWarning: r.historicalNotes || "Treat this release with caution.",
  };
}

/** Prefer Rules Engine primaryBias when present (e.g. FOMC hawkish). */
export function enrichNewsRuleFromRules(rule: NewsRule): NewsRule {
  const bridge = lookupRulesEngine(rule.id);
  if (!bridge) return rule;
  return {
    ...rule,
    importance: bridge.resolved.importance || rule.importance,
    historicalReliability:
      bridge.resolved.historicalReliability || rule.historicalReliability,
    interpretation: mapPrimaryBiasToInterpretation(bridge.primaryBias),
    toneMode:
      bridge.primaryBias === "hawkish_is_usd_bullish" ? "hawkish_dovish" : rule.toneMode,
    higherLabel:
      bridge.primaryBias === "hawkish_is_usd_bullish" ? "Hawkish" : rule.higherLabel,
    lowerLabel:
      bridge.primaryBias === "hawkish_is_usd_bullish" ? "Dovish" : rule.lowerLabel,
  };
}

export function applyScoreModifier(total: number, modifier: number): number {
  return clamp(Math.round(total * modifier), 0, 100);
}

export function applyConfidenceModifier(score: number, modifier: number): number {
  return clamp(Math.round(score * modifier), 0, 100);
}

export function applyRiskScoreModifier(score: number, modifier: number): number {
  return clamp(Math.round(score * modifier), 0, 100);
}
