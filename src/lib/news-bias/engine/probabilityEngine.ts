import type { AssetVoteStats } from "./historyTypes";

/**
 * Probability engine — converts up/down tallies into directional probabilities.
 */
export function applyProbabilities(stats: AssetVoteStats[]): AssetVoteStats[] {
  return stats.map((stat) => {
    const decided = stat.up + stat.down;
    if (decided === 0) {
      return {
        ...stat,
        bearishProbability: 50,
        bullishProbability: 50,
      };
    }

    return {
      ...stat,
      bearishProbability: Math.round((stat.down / decided) * 100),
      bullishProbability: Math.round((stat.up / decided) * 100),
    };
  });
}

/** Leading bias label for an asset given vote tallies. */
export function leadingBias(
  stat: AssetVoteStats,
): "bullish" | "bearish" | "neutral" {
  if (stat.bearishProbability === stat.bullishProbability) return "neutral";
  return stat.bearishProbability > stat.bullishProbability
    ? "bearish"
    : "bullish";
}
