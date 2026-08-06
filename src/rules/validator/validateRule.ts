import type {
  TradeImpactRule,
  ValidationIssue,
  ValidationResult,
  RulePriority,
  RuleCategory,
  MarketId,
} from "../types";

const PRIORITIES: RulePriority[] = ["Critical", "High", "Medium", "Low"];
const CATEGORIES: RuleCategory[] = [
  "macro",
  "forex",
  "commodities",
  "crypto",
  "indices",
  "central-banks",
];
const MARKETS: MarketId[] = [
  "XAUUSD",
  "XAGUSD",
  "BTCUSD",
  "ETHUSD",
  "EURUSD",
  "GBPUSD",
  "AUDUSD",
  "NZDUSD",
  "USDJPY",
  "USDCHF",
  "USDCAD",
  "US30",
  "NAS100",
  "SPX500",
];

function numInRange(
  issues: ValidationIssue[],
  path: string,
  value: unknown,
  min: number,
  max: number,
): void {
  if (typeof value !== "number" || Number.isNaN(value)) {
    issues.push({ path, message: "must be a number", severity: "error" });
    return;
  }
  if (value < min || value > max) {
    issues.push({
      path,
      message: `must be between ${min} and ${max}`,
      severity: "error",
    });
  }
}

/**
 * Rule Validator — structural + domain checks for TradeImpactRule JSON.
 */
export function validateRule(raw: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (!raw || typeof raw !== "object") {
    return {
      ok: false,
      ruleId: "unknown",
      issues: [{ path: "$", message: "rule must be an object", severity: "error" }],
    };
  }
  const rule = raw as Partial<TradeImpactRule>;
  const ruleId = typeof rule.id === "string" ? rule.id : "unknown";

  if (!rule.id) issues.push({ path: "id", message: "required", severity: "error" });
  if (!rule.type || !["event", "profile"].includes(rule.type)) {
    issues.push({ path: "type", message: "must be event|profile", severity: "error" });
  }
  if (!rule.category || !CATEGORIES.includes(rule.category)) {
    issues.push({ path: "category", message: "invalid category", severity: "error" });
  }
  if (!rule.priority || !PRIORITIES.includes(rule.priority)) {
    issues.push({ path: "priority", message: "invalid priority", severity: "error" });
  }
  if (!rule.newsDescription) {
    issues.push({ path: "newsDescription", message: "required", severity: "error" });
  }
  if (!rule.affectedCurrency) {
    issues.push({ path: "affectedCurrency", message: "required", severity: "error" });
  }
  if (!rule.primaryBias) {
    issues.push({ path: "primaryBias", message: "required", severity: "error" });
  }
  if (typeof rule.inverseLogic !== "boolean") {
    issues.push({ path: "inverseLogic", message: "must be boolean", severity: "error" });
  }

  numInRange(issues, "importance", rule.importance, 0, 100);
  numInRange(issues, "historicalReliability", rule.historicalReliability, 0, 100);
  numInRange(issues, "fakeSpikeProbability", rule.fakeSpikeProbability, 0, 1);
  numInRange(issues, "typicalDelaySeconds", rule.typicalDelaySeconds, 0, 600);
  numInRange(issues, "correlationWeight", rule.correlationWeight, 0, 1.5);
  numInRange(issues, "confidenceModifier", rule.confidenceModifier, 0.5, 1.5);
  numInRange(issues, "tradeImpactScoreModifier", rule.tradeImpactScoreModifier, 0.5, 1.5);
  numInRange(issues, "riskModifier", rule.riskModifier, 0.5, 2);

  if (!Array.isArray(rule.marketsAffected) || rule.marketsAffected.length === 0) {
    issues.push({
      path: "marketsAffected",
      message: "must be a non-empty array",
      severity: "error",
    });
  } else {
    for (const m of rule.marketsAffected) {
      if (!MARKETS.includes(m as MarketId)) {
        issues.push({
          path: "marketsAffected",
          message: `unknown market ${m}`,
          severity: "error",
        });
      }
    }
  }

  if (!Array.isArray(rule.assetPriority) || rule.assetPriority.length === 0) {
    issues.push({
      path: "assetPriority",
      message: "must be a non-empty array",
      severity: "error",
    });
  }

  if (!rule.playbook?.before || !rule.playbook.during || !rule.playbook.after) {
    issues.push({
      path: "playbook",
      message: "must include before/during/after arrays",
      severity: "error",
    });
  }

  if (!rule.marketLogic || typeof rule.marketLogic !== "object") {
    issues.push({ path: "marketLogic", message: "required object", severity: "error" });
  } else {
    for (const mid of MARKETS) {
      const logic = rule.marketLogic[mid];
      if (!logic) {
        issues.push({
          path: `marketLogic.${mid}`,
          message: "missing market logic",
          severity: "error",
        });
        continue;
      }
      for (const key of ["bullish", "bearish", "neutral", "displayName"] as const) {
        if (!logic[key]) {
          issues.push({
            path: `marketLogic.${mid}.${key}`,
            message: "required",
            severity: "error",
          });
        }
      }
    }
  }

  if (rule.inverseLogic && rule.primaryBias === "higher_is_usd_bullish") {
    issues.push({
      path: "inverseLogic",
      message: "inverseLogic=true usually pairs with higher_is_usd_bearish",
      severity: "warning",
    });
  }

  if (!rule.historicalNotes) {
    issues.push({
      path: "historicalNotes",
      message: "recommended for IP quality",
      severity: "warning",
    });
  }

  const errors = issues.filter((i) => i.severity === "error");
  return { ok: errors.length === 0, ruleId, issues };
}

export function assertValidRule(raw: unknown): TradeImpactRule {
  const result = validateRule(raw);
  if (!result.ok) {
    const msg = result.issues
      .filter((i) => i.severity === "error")
      .map((i) => `${i.path}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid rule ${result.ruleId}: ${msg}`);
  }
  return raw as TradeImpactRule;
}
