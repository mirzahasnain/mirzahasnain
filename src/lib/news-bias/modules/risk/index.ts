import riskJson from "./data/riskRules.json";
import type {
  PlaybookRiskLevel,
  RiskManagementPlan,
  RiskOption,
} from "../playbook/types";
import type { ExpectedImpact } from "../../types/interfaces";

interface RiskConfig {
  options: RiskOption[];
  byImpact: Record<string, string>;
  byRisk: Record<string, string>;
  positionSizingReminder: string;
}

const CONFIG = riskJson as RiskConfig;

export function buildRiskManagement(input: {
  impact: ExpectedImpact;
  riskLevel: PlaybookRiskLevel;
}): RiskManagementPlan {
  const fromImpact = CONFIG.byImpact[input.impact];
  const fromRisk = CONFIG.byRisk[input.riskLevel];
  const recommendedId = fromRisk ?? fromImpact ?? CONFIG.options[0]?.id ?? "one";

  return {
    options: CONFIG.options.map((o) => ({ ...o })),
    recommendedId,
    positionSizingReminder: CONFIG.positionSizingReminder,
  };
}
