import type { RuleRegistry } from "../registry";
import { resolveRule } from "../resolver";
import { priorityRank } from "../shared/priorityRank";
import type {
  ConflictRecord,
  ConflictResolutionInput,
  ConflictResolutionResult,
  ResolvedRule,
} from "../types";

/**
 * Conflict Resolution / Priority System
 *
 * When multiple economic releases fire together, pick a winner:
 * 1) Higher priority level (Critical > High > Medium > Low)
 * 2) Higher importance
 * 3) Higher correlationWeight
 * 4) Lexicographic id (stable tie-break)
 *
 * Field-level conflicts are recorded for transparency (IP audit trail).
 */
export function resolveConflicts(
  registry: RuleRegistry,
  input: ConflictResolutionInput,
): ConflictResolutionResult {
  if (!input.ruleIds.length) {
    throw new Error("Conflict resolution requires at least one rule id");
  }

  const resolved = input.ruleIds.map((id) => resolveRule(registry, id));
  const ranked = [...resolved].sort(compareResolved);

  if (input.context?.preferCurrency) {
    ranked.sort((a, b) => {
      const aMatch = a.affectedCurrency === input.context?.preferCurrency ? 1 : 0;
      const bMatch = b.affectedCurrency === input.context?.preferCurrency ? 1 : 0;
      if (bMatch !== aMatch) return bMatch - aMatch;
      return compareResolved(a, b);
    });
  }

  const winner = ranked[0];
  const conflicts: ConflictRecord[] = [];

  for (const other of ranked.slice(1)) {
    for (const field of [
      "primaryBias",
      "inverseLogic",
      "typicalVolatility",
      "tradeImpactScoreModifier",
      "riskModifier",
    ] as const) {
      if (winner[field] !== other[field]) {
        conflicts.push({
          otherRuleId: other.id,
          field,
          winnerRuleId: winner.id,
          reason: explainWin(winner, other),
        });
      }
    }
  }

  winner.resolution.conflicts = conflicts;
  return { winner, ranked, conflicts };
}

function compareResolved(a: ResolvedRule, b: ResolvedRule): number {
  return (
    priorityRank(b.priority) - priorityRank(a.priority) ||
    b.importance - a.importance ||
    b.correlationWeight - a.correlationWeight ||
    a.id.localeCompare(b.id)
  );
}

function explainWin(winner: ResolvedRule, other: ResolvedRule): string {
  if (winner.priority !== other.priority) {
    return `${winner.id} wins on priority (${winner.priority} > ${other.priority})`;
  }
  if (winner.importance !== other.importance) {
    return `${winner.id} wins on importance (${winner.importance} > ${other.importance})`;
  }
  if (winner.correlationWeight !== other.correlationWeight) {
    return `${winner.id} wins on correlationWeight`;
  }
  return `${winner.id} wins on stable id tie-break`;
}

export function getPrioritySystemDescription(): string {
  return [
    "Critical (100)",
    "High (75)",
    "Medium (50)",
    "Low (25)",
    "Then importance → correlationWeight → id",
  ].join(" → ");
}
