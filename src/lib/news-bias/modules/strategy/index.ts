import entryJson from "./data/entryStrategies.json";
import takeProfitJson from "./data/takeProfit.json";
import stopLossJson from "./data/stopLoss.json";
import type {
  EntryStrategyOption,
  StopLossGuide,
  TakeProfitPlan,
} from "../playbook/types";

interface EntryConfig {
  strategies: EntryStrategyOption[];
}

interface TakeProfitConfig {
  levels: { id: string; label: string; placeholder: string }[];
  trailStop: { label: string; placeholder: string };
}

interface StopLossConfig {
  placements: { id: string; label: string; hint: string }[];
  note: string;
}

const ENTRIES = entryJson as EntryConfig;
const TAKE_PROFIT = takeProfitJson as TakeProfitConfig;
const STOP_LOSS = stopLossJson as StopLossConfig;

/** All entry strategies from JSON — no component hardcoding. */
export function listEntryStrategies(): EntryStrategyOption[] {
  return ENTRIES.strategies.map((s) => ({ ...s }));
}

export function buildTakeProfitPlan(): TakeProfitPlan {
  return {
    levels: TAKE_PROFIT.levels.map((l) => ({ ...l })),
    trailStop: { ...TAKE_PROFIT.trailStop },
  };
}

export function buildStopLossGuide(): StopLossGuide {
  return {
    placements: STOP_LOSS.placements.map((p) => ({ ...p })),
    note: STOP_LOSS.note,
  };
}
