/**
 * TradeImpact Rules Engine — canonical rule schema.
 * All trading intelligence rules are JSON; never hardcode in React.
 */

export type RuleCategory =
  "macro" | "forex" | "commodities" | "crypto" | "indices" | "central-banks";

export type RulePriority = "Critical" | "High" | "Medium" | "Low";

export type RuleType = "event" | "profile";

export type VolatilityLabel = "low" | "medium" | "high" | "extreme";

export type PrimaryBias =
  "higher_is_usd_bullish" | "higher_is_usd_bearish" | "hawkish_is_usd_bullish";

export type MarketId =
  | "XAUUSD"
  | "XAGUSD"
  | "BTCUSD"
  | "ETHUSD"
  | "EURUSD"
  | "GBPUSD"
  | "AUDUSD"
  | "NZDUSD"
  | "USDJPY"
  | "USDCHF"
  | "USDCAD"
  | "US30"
  | "NAS100"
  | "SPX500";

export interface MarketLogic {
  displayName: string;
  bullish: string;
  bearish: string;
  neutral: string;
}

export interface RulePlaybook {
  before: string[];
  during: string[];
  after: string[];
}

export interface TradeImpactRule {
  id: string;
  type: RuleType;
  category: RuleCategory;
  priority: RulePriority;
  version: string;
  newsDescription: string;
  importance: number;
  affectedCurrency: string;
  primaryBias: PrimaryBias;
  inverseLogic: boolean;
  typicalVolatility: VolatilityLabel;
  historicalReliability: number;
  fakeSpikeProbability: number;
  typicalDelaySeconds: number;
  marketsAffected: MarketId[];
  assetPriority: MarketId[];
  correlationWeight: number;
  confidenceModifier: number;
  tradeImpactScoreModifier: number;
  riskModifier: number;
  playbook: RulePlaybook;
  historicalNotes: string;
  inheritsFrom: string | null;
  overrides: Record<string, unknown>;
  marketLogic: Record<string, MarketLogic>;
}

export interface RulesManifest {
  version: string;
  schemaVersion: string;
  categories: RuleCategory[];
  priorityLevels: RulePriority[];
  markets: { id: MarketId; name: string }[];
  events: string[];
}

export interface ValidationIssue {
  path: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  ok: boolean;
  ruleId: string;
  issues: ValidationIssue[];
}

export interface ResolvedRule extends TradeImpactRule {
  resolution: {
    sourceIds: string[];
    inheritedFrom: string[];
    priorityRank: number;
    conflicts: ConflictRecord[];
  };
}

export interface ConflictRecord {
  otherRuleId: string;
  field: string;
  winnerRuleId: string;
  reason: string;
}

export interface ConflictResolutionInput {
  ruleIds: string[];
  /** Optional simultaneous release context */
  context?: {
    timestamp?: string;
    preferCurrency?: string;
  };
}

export interface ConflictResolutionResult {
  winner: ResolvedRule;
  ranked: ResolvedRule[];
  conflicts: ConflictRecord[];
}
