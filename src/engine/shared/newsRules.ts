import newsRulesJson from "./data/newsRules.json";
import type { NewsRule } from "./types";

const RULES = newsRulesJson as Record<string, NewsRule>;

export function getNewsRule(newsId: string): NewsRule {
  const rule = RULES[newsId];
  if (!rule) {
    return {
      id: newsId,
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
  return rule;
}

export function listNewsRules(): NewsRule[] {
  return Object.values(RULES);
}

export { RULES as newsRulesConfig };
