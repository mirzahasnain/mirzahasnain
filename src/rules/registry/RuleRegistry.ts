import { loadAllRules, loadManifest } from "../loader";
import { priorityRank } from "../shared/priorityRank";
import type {
  RuleCategory,
  RulePriority,
  RulesManifest,
  TradeImpactRule,
} from "../types";

/**
 * Rule Registry — in-memory index of all TradeImpact rules.
 */
export class RuleRegistry {
  private readonly byId = new Map<string, TradeImpactRule>();
  private readonly byCategory = new Map<RuleCategory, TradeImpactRule[]>();
  private readonly manifest: RulesManifest;

  constructor(rules?: TradeImpactRule[], manifest?: RulesManifest) {
    this.manifest = manifest ?? loadManifest();
    const list = rules ?? loadAllRules({ validate: true });
    for (const rule of list) {
      if (this.byId.has(rule.id)) {
        throw new Error(`Duplicate rule id: ${rule.id}`);
      }
      this.byId.set(rule.id, rule);
      const bucket = this.byCategory.get(rule.category) ?? [];
      bucket.push(rule);
      this.byCategory.set(rule.category, bucket);
    }
  }

  getManifest(): RulesManifest {
    return this.manifest;
  }

  get(id: string): TradeImpactRule | undefined {
    return this.byId.get(id);
  }

  require(id: string): TradeImpactRule {
    const rule = this.byId.get(id);
    if (!rule) throw new Error(`Unknown rule id: ${id}`);
    return rule;
  }

  list(): TradeImpactRule[] {
    return [...this.byId.values()];
  }

  listEvents(): TradeImpactRule[] {
    return this.list().filter((r) => r.type === "event");
  }

  listProfiles(): TradeImpactRule[] {
    return this.list().filter((r) => r.type === "profile");
  }

  listByCategory(category: RuleCategory): TradeImpactRule[] {
    return [...(this.byCategory.get(category) ?? [])];
  }

  listByPriority(priority: RulePriority): TradeImpactRule[] {
    return this.list().filter((r) => r.priority === priority);
  }

  size(): number {
    return this.byId.size;
  }

  /** Coverage helpers for reports */
  missingMarketLogic(): { ruleId: string; marketId: string }[] {
    const markets = this.manifest.markets.map((m) => m.id);
    const missing: { ruleId: string; marketId: string }[] = [];
    for (const rule of this.list()) {
      for (const mid of markets) {
        if (!rule.marketLogic[mid]) missing.push({ ruleId: rule.id, marketId: mid });
      }
    }
    return missing;
  }

  findDuplicateIds(): string[] {
    // Constructor already prevents duplicates; retained for report API symmetry.
    return [];
  }

  rankedByPriority(): TradeImpactRule[] {
    return this.list().sort(
      (a, b) =>
        priorityRank(b.priority) - priorityRank(a.priority) ||
        b.importance - a.importance,
    );
  }
}

let singleton: RuleRegistry | null = null;

export function getRuleRegistry(): RuleRegistry {
  if (!singleton) singleton = new RuleRegistry();
  return singleton;
}

export function resetRuleRegistry(): void {
  singleton = null;
}
