import pairMappingsJson from "./data/pairMappings.json";
import type { Direction, PairId } from "../types/interfaces";
import type { PairBiasMap, PairMappingsConfig } from "./types";

const MAPPINGS = pairMappingsJson as PairMappingsConfig;

export function getPairMappings(
  config: PairMappingsConfig = MAPPINGS,
): PairMappingsConfig {
  return config;
}

/** Resolve every pair’s bias given a USD direction. */
export function mapPairsForUsd(
  usdDirection: Direction,
  config: PairMappingsConfig = MAPPINGS,
): PairBiasMap {
  if (usdDirection === "bullish") return { ...config.usdBullish };
  if (usdDirection === "bearish") return { ...config.usdBearish };
  return { ...config.usdNeutral };
}

export function getPairBias(
  pairId: PairId,
  usdDirection: Direction,
  config: PairMappingsConfig = MAPPINGS,
): Direction {
  return mapPairsForUsd(usdDirection, config)[pairId] ?? "neutral";
}

export { MAPPINGS as defaultPairMappings };
