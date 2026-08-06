import { findEvent } from "../news";
import type { NewsEventId, SurpriseSign } from "../types/interfaces";
import { buildChartSeries, loadHistoryReleases } from "./historyEngine";
import type { HistoricalIntelligence } from "./historyTypes";
import { applyProbabilities, leadingBias } from "./probabilityEngine";
import {
  cohortConfidence,
  findSimilarReleases,
  resolveBand,
} from "./similarityEngine";
import { computeAssetStatistics, formatAverageMove } from "./statisticsEngine";

/**
 * Orchestrates similarity → statistics → probability → AI summary.
 * Pure and cache-backed via the underlying engines.
 */
export function buildHistoricalIntelligence(input: {
  newsId: NewsEventId;
  surprise: number | null;
  surpriseSign: SurpriseSign;
  newsLabel?: string;
}): HistoricalIntelligence | null {
  const event = findEvent(input.newsId);
  const newsLabel = input.newsLabel ?? event?.label ?? input.newsId;
  const timeline = loadHistoryReleases(input.newsId);
  if (timeline.length === 0) return null;

  const matches =
    input.surprise === null
      ? []
      : findSimilarReleases({
          newsId: input.newsId,
          surprise: input.surprise,
          surpriseSign: input.surpriseSign,
        });

  const assets = applyProbabilities(computeAssetStatistics(matches));
  const confidenceScore = cohortConfidence(matches);
  const band =
    input.surprise === null ? null : resolveBand(input.surprise);

  return {
    newsId: input.newsId,
    newsLabel,
    sampleSize: matches.length,
    surprise: input.surprise,
    surpriseSign: input.surpriseSign,
    band,
    matches,
    assets,
    timeline,
    chart: buildChartSeries(timeline),
    summary: buildHistoricalSummary({
      newsLabel,
      surprise: input.surprise,
      matches: matches.length,
      assets,
      confidenceScore,
    }),
    confidenceScore,
  };
}

function buildHistoricalSummary(input: {
  newsLabel: string;
  surprise: number | null;
  matches: number;
  assets: ReturnType<typeof applyProbabilities>;
  confidenceScore: number;
}): string[] {
  const { newsLabel, surprise, matches, assets, confidenceScore } = input;
  const lines: string[] = [];

  if (surprise === null || matches === 0) {
    lines.push(
      `No closely matching historical ${newsLabel} releases were found for this surprise profile.`,
    );
    lines.push(
      "Enter a measured Actual vs Forecast to search the historical database.",
    );
    return lines;
  }

  const gold = assets.find((a) => a.key === "gold");
  const surpriseText =
    surprise > 0 ? `+${formatNum(surprise)}` : formatNum(surprise);

  lines.push(
    `Historically, when ${newsLabel} beats or misses Forecast by around ${surpriseText}, similar prints appeared ${matches} time${matches === 1 ? "" : "s"}.`,
  );

  if (gold && gold.up + gold.down > 0) {
    const bias = leadingBias(gold);
    const pct =
      bias === "bearish" ? gold.bearishProbability : gold.bullishProbability;
    const verb = bias === "bearish" ? "declined" : "advanced";
    lines.push(
      `Gold ${verb} ${pct}% of the time. Average move was ${formatAverageMove(gold)}.`,
    );
  }

  const silver = assets.find((a) => a.key === "silver");
  const eurusd = assets.find((a) => a.key === "eurusd");
  const btc = assets.find((a) => a.key === "btc");
  const extras = [silver, eurusd, btc].filter(Boolean);
  if (extras.length > 0) {
    const bits = extras.map((a) => {
      const bias = leadingBias(a!);
      const pct =
        bias === "bearish" ? a!.bearishProbability : a!.bullishProbability;
      return `${a!.label} ${bias} ${pct}%`;
    });
    lines.push(`Across the sample: ${bits.join(", ")}.`);
  }

  lines.push(
    `Today's release closely matches those historical events (similarity confidence ${confidenceScore}%).`,
  );

  return lines.slice(0, 5);
}

function formatNum(value: number): string {
  const abs = Math.abs(value);
  const digits = abs >= 10 ? 1 : 2;
  return String(Number(value.toFixed(digits)));
}
