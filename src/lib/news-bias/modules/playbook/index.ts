import phasesJson from "./data/phases.json";
import { resolveExpectedMove } from "../../engine/playbookEngine";
import type {
  Direction,
  ExpectedImpact,
  PairId,
  SurpriseStrength,
  TradeAction,
} from "../../types/interfaces";
import type { EventTradePlaybook } from "../types";

export { buildAiTradePlaybook, buildTradingPlan } from "./buildAiPlaybook";
export type { AiTradePlaybook } from "./types";
export type * from "./types";

interface PhasesConfig {
  default: {
    waitSeconds: number;
    before: string;
    release: string;
    confirmationBuy: string;
    confirmationSell: string;
    confirmationWait: string;
    riskByImpact: Record<string, "Low" | "Medium" | "High">;
  };
  assets: Record<string, { label: string; targetUnit: string }>;
}

const CONFIG = phasesJson as PhasesConfig;

/**
 * Professional trade playbook — Before / During / After phases.
 * Data-driven from phases.json; no React hardcoding.
 */
export function buildEventPlaybook(input: {
  pairId: PairId;
  action: TradeAction;
  pairDirection: Direction;
  strength: SurpriseStrength;
  impact: ExpectedImpact;
}): EventTradePlaybook {
  const asset = CONFIG.assets[input.pairId] ?? {
    label: input.pairId,
    targetUnit: "Points",
  };
  const wait = CONFIG.default.waitSeconds;
  const move = resolveExpectedMove(input.pairId, input.strength);
  const target = move?.label ?? `See ${asset.targetUnit} guide`;
  const risk =
    CONFIG.default.riskByImpact[input.impact] ??
    CONFIG.default.riskByImpact.medium;

  const confirmation =
    input.action === "buy"
      ? CONFIG.default.confirmationBuy
      : input.action === "sell"
        ? CONFIG.default.confirmationSell
        : CONFIG.default.confirmationWait;

  return {
    assetLabel: asset.label,
    waitSeconds: wait,
    target,
    risk,
    phases: [
      {
        id: "before",
        title: "Before News",
        action: CONFIG.default.before,
      },
      {
        id: "release",
        title: "During Release",
        action: CONFIG.default.release.replace("{wait}", String(wait)),
      },
      {
        id: "confirmation",
        title: "After Confirmation",
        action: confirmation,
      },
    ],
  };
}
