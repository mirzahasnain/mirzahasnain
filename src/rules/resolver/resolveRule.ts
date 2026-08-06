import type { RuleRegistry } from "../registry";
import { priorityRank } from "../shared/priorityRank";
import type { ResolvedRule, TradeImpactRule } from "../types";

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  over: Record<string, unknown>,
): T {
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(over)) {
    if (
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      typeof out[k] === "object" &&
      out[k] !== null &&
      !Array.isArray(out[k])
    ) {
      out[k] = deepMerge(out[k] as Record<string, unknown>, v as Record<string, unknown>);
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out as T;
}

/**
 * Rule Resolver — applies inheritance + overrides into a ResolvedRule.
 * Child fields win; profile fills gaps for modifiers when inheritsFrom is set.
 */
export function resolveRule(registry: RuleRegistry, ruleId: string): ResolvedRule {
  const rule = registry.require(ruleId);
  const inheritedFrom: string[] = [];
  let merged: TradeImpactRule = { ...rule, marketLogic: { ...rule.marketLogic } };

  if (rule.inheritsFrom) {
    const parent = registry.get(rule.inheritsFrom);
    if (!parent) {
      throw new Error(`Rule ${ruleId} inheritsFrom missing profile ${rule.inheritsFrom}`);
    }
    inheritedFrom.push(parent.id);
    // Parent provides baseline modifiers if child wants profile influence:
    // child values already present always win; we only inherit missing marketLogic keys.
    const marketLogic = { ...parent.marketLogic, ...rule.marketLogic };
    merged = {
      ...parent,
      ...rule,
      marketLogic,
      playbook: {
        before: rule.playbook.before.length
          ? rule.playbook.before
          : parent.playbook.before,
        during: rule.playbook.during.length
          ? rule.playbook.during
          : parent.playbook.during,
        after: rule.playbook.after.length ? rule.playbook.after : parent.playbook.after,
      },
      // Event identity must remain the child
      id: rule.id,
      type: rule.type,
      category: rule.category,
      inheritsFrom: rule.inheritsFrom,
    };
  }

  if (rule.overrides && Object.keys(rule.overrides).length > 0) {
    merged = deepMerge(
      merged as unknown as Record<string, unknown>,
      rule.overrides,
    ) as unknown as TradeImpactRule;
    merged.id = rule.id;
  }

  return {
    ...merged,
    resolution: {
      sourceIds: [rule.id, ...inheritedFrom],
      inheritedFrom,
      priorityRank: priorityRank(merged.priority),
      conflicts: [],
    },
  };
}

export function resolveMany(registry: RuleRegistry, ruleIds: string[]): ResolvedRule[] {
  return ruleIds.map((id) => resolveRule(registry, id));
}
