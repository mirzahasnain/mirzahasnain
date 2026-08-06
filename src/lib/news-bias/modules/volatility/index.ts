import volatilityJson from "./data/volatilityRules.json";
import type { PlaybookVolatilityMeter } from "../playbook/types";
import type {
  ExpectedImpact,
  SurpriseStrength,
} from "../../types/interfaces";

interface VolatilityConfig {
  bands: { id: PlaybookVolatilityMeter["band"]; label: string; minScore: number }[];
  impactScore: Record<string, number>;
  strengthBoost: Record<string, number>;
  title: string;
}

const CONFIG = volatilityJson as VolatilityConfig;

export function buildVolatilityMeter(input: {
  impact: ExpectedImpact;
  strength: SurpriseStrength;
}): PlaybookVolatilityMeter {
  const base = CONFIG.impactScore[input.impact] ?? 55;
  const boost = CONFIG.strengthBoost[input.strength] ?? 0;
  const score = Math.max(0, Math.min(100, base + boost));

  const band =
    [...CONFIG.bands].reverse().find((b) => score >= b.minScore) ??
    CONFIG.bands[0];

  return {
    band: band.id,
    label: band.label,
    title: CONFIG.title,
    score,
  };
}
