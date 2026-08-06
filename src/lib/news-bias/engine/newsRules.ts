import newsRulesJson from "./data/newsRules.json";
import type { NewsEventId } from "../types/interfaces";
import type { NewsRule, NewsRulesConfig } from "./types";

const RULES = newsRulesJson as NewsRulesConfig;

/** Loads the per-news rule set. Swap the JSON to retune without touching UI. */
export function getNewsRules(config: NewsRulesConfig = RULES): NewsRulesConfig {
  return config;
}

export function getNewsRule(
  newsId: NewsEventId,
  config: NewsRulesConfig = RULES,
): NewsRule {
  const rule = config[newsId];
  if (!rule) {
    throw new Error(`No news rule configured for "${newsId}".`);
  }
  return rule;
}

export { RULES as defaultNewsRules };
