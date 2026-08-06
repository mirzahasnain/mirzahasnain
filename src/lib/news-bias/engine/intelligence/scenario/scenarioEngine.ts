import scenarioJson from "./data/scenarioRules.json";
import type { Direction, PairId, SurpriseStrength } from "../../../types/interfaces";
import type { ScenarioCase, ScenarioSnapshot } from "../types";

interface ScenarioConfig {
  multipliers: { best: number; expected: number; worst: number };
  strengthScale: Record<string, number>;
  fallbackAverages: Record<string, { value: number; unit: string }>;
}

const CONFIG = scenarioJson as ScenarioConfig;

/**
 * Scenario engine — Best / Expected / Worst case moves (signed by bias).
 */
export function buildScenarios(input: {
  pairId: PairId;
  assetLabel: string;
  pairDirection: Direction;
  strength: SurpriseStrength;
  averageAbsMove: number | null;
  unit: string | null;
}): ScenarioSnapshot {
  const fallback = CONFIG.fallbackAverages[input.pairId] ?? {
    value: 20,
    unit: "points",
  };
  const base = Math.abs(input.averageAbsMove ?? fallback.value);
  const unit = input.unit ?? fallback.unit;
  const scale = CONFIG.strengthScale[input.strength] ?? 1;
  const signed = input.pairDirection === "bullish" ? 1 : input.pairDirection === "bearish" ? -1 : 0;

  const cases: ScenarioCase[] = (
    [
      ["best", "Best Case", CONFIG.multipliers.best],
      ["expected", "Expected Case", CONFIG.multipliers.expected],
      ["worst", "Worst Case", CONFIG.multipliers.worst],
    ] as const
  ).map(([id, label, mult]) => {
    const raw = base * scale * mult;
    const move = Math.round(raw * (signed === 0 ? 1 : signed) * 10) / 10;
    // Worst case intentionally can reverse against the bias.
    const finalMove =
      id === "worst" && signed !== 0
        ? Math.round(base * scale * Math.abs(mult) * -signed * 10) / 10
        : move;
    return {
      id,
      label,
      move: finalMove,
      unit,
      display: formatMove(finalMove, unit),
    };
  });

  return {
    assetLabel: input.assetLabel,
    pairId: input.pairId,
    cases,
  };
}

function formatMove(move: number, unit: string): string {
  const sign = move > 0 ? "+" : "";
  return `${sign}${move} ${unit}`;
}
