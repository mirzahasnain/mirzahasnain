import scenarioJson from "./data/scenarioRules.json";
import { round } from "../shared/math";
import type { ScenarioInput, ScenarioResult } from "./types";

interface ScenarioConfig {
  multipliers: { best: number; expected: number; worst: number };
  strengthScale: Record<string, number>;
  fallbackAverages: Record<string, { value: number; unit: string }>;
}

const CONFIG = scenarioJson as ScenarioConfig;

export function processScenario(input: ScenarioInput): ScenarioResult {
  const fallback = CONFIG.fallbackAverages[input.pairId];
  const base = input.averageAbsMove > 0 ? input.averageAbsMove : (fallback?.value ?? 20);
  const unit = input.averageAbsMove > 0 ? input.unit : (fallback?.unit ?? input.unit);
  const scale = CONFIG.strengthScale[input.strength] ?? 1;
  const sign =
    input.pairDirection === "bearish" ? -1 : input.pairDirection === "bullish" ? 1 : 0;

  const expected = round(base * CONFIG.multipliers.expected * scale * (sign || 1), 2);
  const best = round(base * CONFIG.multipliers.best * scale * (sign || 1), 2);
  const worst = round(
    base * Math.abs(CONFIG.multipliers.worst) * scale * (sign || 1) * -1,
    2,
  );

  return {
    cases: [
      { id: "best", label: "Best", move: best, unit },
      { id: "expected", label: "Expected", move: expected, unit },
      { id: "worst", label: "Worst", move: worst, unit },
    ],
    expectedMove: {
      value: expected,
      unit,
      label: `${expected} ${unit}`,
    },
  };
}
