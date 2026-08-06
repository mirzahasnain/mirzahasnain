import volJson from "./data/volatilityRules.json";
import { clamp } from "../shared/math";
import type { VolatilityBand } from "../shared/types";
import type { VolatilityInput, VolatilityResult } from "./types";

interface VolConfig {
  bands: { id: VolatilityBand; label: string; minScore: number }[];
  impactScore: Record<string, number>;
  strengthBoost: Record<string, number>;
  title: string;
}

const CONFIG = volJson as VolConfig;

export function processVolatility(input: VolatilityInput): VolatilityResult {
  const base = CONFIG.impactScore[input.impact] ?? 50;
  const boost = CONFIG.strengthBoost[input.strength] ?? 0;
  const score = clamp(base + boost, 0, 100);
  const ordered = [...CONFIG.bands].sort((a, b) => b.minScore - a.minScore);
  const band = ordered.find((b) => score >= b.minScore) ?? CONFIG.bands[0];
  return {
    band: band.id,
    score,
    label: band.label,
    // Extreme chaos is less "actionable" for entries.
    actionable: band.id !== "extreme",
  };
}
