import { RuleRegistry } from "../registry";
import { resolveConflicts } from "../priority";
import type { TradeImpactRule } from "../types";

export interface RuleCoverageReport {
  totalRules: number;
  eventRules: number;
  profileRules: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  missingRules: string[];
  duplicateRules: string[];
  conflictingRules: {
    pair: [string, string];
    fields: string[];
  }[];
  missingMarketLogic: { ruleId: string; marketId: string }[];
  readinessPercent: number;
  notes: string[];
}

/** Expected IP event catalog (PRD + requested coverage). */
export const EXPECTED_EVENT_IDS = [
  "cpi",
  "core-cpi",
  "ppi",
  "core-pce",
  "nfp",
  "adp",
  "jolts",
  "retail-sales",
  "gdp",
  "interest-rate",
  "fomc",
  "ism-manufacturing",
  "ism-services",
  "durable-goods",
  "consumer-confidence",
  "pmi",
  "unemployment-rate",
] as const;

/**
 * Rule Coverage Report generator — pure analysis over the registry.
 */
export function generateCoverageReport(
  registry: RuleRegistry = new RuleRegistry(),
): RuleCoverageReport {
  const all = registry.list();
  const events = registry.listEvents();
  const profiles = registry.listProfiles();

  const byCategory: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  for (const rule of all) {
    byCategory[rule.category] = (byCategory[rule.category] ?? 0) + 1;
    byPriority[rule.priority] = (byPriority[rule.priority] ?? 0) + 1;
  }

  const present = new Set(events.map((e) => e.id));
  const missingRules = EXPECTED_EVENT_IDS.filter((id) => !present.has(id));

  const seen = new Set<string>();
  const duplicateRules: string[] = [];
  for (const rule of all) {
    if (seen.has(rule.id)) duplicateRules.push(rule.id);
    seen.add(rule.id);
  }

  const conflictingRules: RuleCoverageReport["conflictingRules"] = [];
  // Sample simultaneous pairs that commonly collide
  const pairs: [string, string][] = [
    ["nfp", "unemployment-rate"],
    ["cpi", "core-cpi"],
    ["interest-rate", "fomc"],
    ["ism-manufacturing", "ism-services"],
  ];
  for (const [a, b] of pairs) {
    if (!registry.get(a) || !registry.get(b)) continue;
    const result = resolveConflicts(registry, { ruleIds: [a, b] });
    const fields = [...new Set(result.conflicts.map((c) => c.field))];
    if (fields.length) {
      conflictingRules.push({ pair: [a, b], fields });
    }
  }

  const missingMarketLogic = registry.missingMarketLogic();

  const expectedCount = EXPECTED_EVENT_IDS.length;
  const covered = expectedCount - missingRules.length;
  const marketPenalty = missingMarketLogic.length === 0 ? 0 : 5;
  const dupPenalty = duplicateRules.length * 10;
  const readinessPercent = Math.max(
    0,
    Math.min(
      100,
      Math.round((covered / expectedCount) * 100) - marketPenalty - dupPenalty,
    ),
  );

  const notes: string[] = [
    "Profiles in forex/commodities/crypto/indices provide inheritance bases.",
    "Conflict pairs listed are informational — resolver still picks a winner.",
    "Readiness emphasizes required event catalog coverage.",
  ];

  return {
    totalRules: all.length,
    eventRules: events.length,
    profileRules: profiles.length,
    byCategory,
    byPriority,
    missingRules: [...missingRules],
    duplicateRules,
    conflictingRules,
    missingMarketLogic,
    readinessPercent,
    notes,
  };
}

export function summarizeRule(rule: TradeImpactRule): string {
  return `${rule.id} [${rule.priority}/${rule.category}] importance=${rule.importance}`;
}
