import newsRulesJson from "./data/newsRules.json";
import { toBrainEventId } from "./eventIdAliases";
import { enrichNewsRuleFromRules, newsRuleFromRulesEngine } from "./rulesBridge";
import type { NewsRule } from "./types";

const RULES = newsRulesJson as Record<string, NewsRule>;

export function getNewsRule(newsId: string): NewsRule {
  const brainId = toBrainEventId(newsId);
  const rule = RULES[brainId] ?? RULES[newsId];
  if (rule) {
    return enrichNewsRuleFromRules({ ...rule, id: brainId });
  }

  const fromRules = newsRuleFromRulesEngine(newsId);
  if (fromRules) {
    return { ...fromRules, id: brainId };
  }

  return {
    id: brainId,
    label: newsId,
    importance: 50,
    historicalReliability: 50,
    interpretation: "higher_is_usd_bullish",
    toneMode: "numeric",
    higherLabel: "Higher than Forecast",
    lowerLabel: "Lower than Forecast",
    riskWarning: "Treat unknown releases with caution.",
  };
}

export function listNewsRules(): NewsRule[] {
  return Object.values(RULES).map((rule) => enrichNewsRuleFromRules(rule));
}

export { RULES as newsRulesConfig };
