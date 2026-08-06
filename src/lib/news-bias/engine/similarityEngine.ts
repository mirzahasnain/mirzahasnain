import { SIMILARITY_DEFAULTS } from "./historyConfig";
import { loadHistoryReleases } from "./historyEngine";
import type {
  HistoricalReleaseRecord,
  SimilarMatch,
  SimilarityQuery,
} from "./historyTypes";
import type { SurpriseSign } from "../types/interfaces";

const resultCache = new Map<string, SimilarMatch[]>();

/**
 * Similarity engine — same news + same direction + similar surprise.
 * Returns top matches with a 0–100 confidence score.
 */
export function findSimilarReleases(query: SimilarityQuery): SimilarMatch[] {
  const limit = query.limit ?? SIMILARITY_DEFAULTS.limit;
  const key = cacheKey(query, limit);
  const cached = resultCache.get(key);
  if (cached) return cached;

  const releases = loadHistoryReleases(query.newsId);
  if (releases.length === 0 || query.surprise === null) {
    resultCache.set(key, []);
    return [];
  }

  const band = resolveBand(query.surprise, query.bandPadding);
  const sign = query.surpriseSign;

  const matches = releases
    .filter((row) => inBand(row.surprise, band) && sameDirection(row.surprise, sign))
    .map((record) => scoreMatch(record, query.surprise!, sign))
    .sort((a, b) => b.score - a.score || a.surpriseDelta - b.surpriseDelta)
    .slice(0, limit);

  resultCache.set(key, matches);
  return matches;
}

export function resolveBand(
  surprise: number,
  paddingOverride?: number,
): { min: number; max: number } {
  const padding =
    paddingOverride ??
    Math.max(
      SIMILARITY_DEFAULTS.minPadding,
      Math.abs(surprise) * SIMILARITY_DEFAULTS.relativePadding,
    );
  return {
    min: surprise - padding,
    max: surprise + padding,
  };
}

export function scoreMatch(
  record: HistoricalReleaseRecord,
  targetSurprise: number,
  targetSign: SurpriseSign,
): SimilarMatch {
  const { weights } = SIMILARITY_DEFAULTS;
  const surpriseDelta = Math.abs(record.surprise - targetSurprise);
  const span = Math.max(Math.abs(targetSurprise) * 0.5, SIMILARITY_DEFAULTS.minPadding);
  const proximity = Math.max(0, 1 - surpriseDelta / (span * 2));

  const sameDirectionScore = sameDirection(record.surprise, targetSign)
    ? weights.sameDirection
    : 0;

  const score = Math.round(
    weights.sameNews +
      sameDirectionScore +
      proximity * weights.surpriseProximity,
  );

  return {
    record,
    score: Math.min(100, Math.max(0, score)),
    surpriseDelta: round(surpriseDelta, 4),
  };
}

/** Cohort-level confidence: mean of top match scores. */
export function cohortConfidence(matches: SimilarMatch[]): number {
  if (matches.length === 0) return 0;
  const sum = matches.reduce((acc, m) => acc + m.score, 0);
  return Math.round(sum / matches.length);
}

function sameDirection(surprise: number, sign: SurpriseSign): boolean {
  if (sign === "flat") return Math.abs(surprise) < 1e-9;
  if (sign === "positive") return surprise > 0;
  return surprise < 0;
}

function inBand(value: number, band: { min: number; max: number }): boolean {
  return value >= band.min && value <= band.max;
}

function cacheKey(query: SimilarityQuery, limit: number): string {
  return [
    query.newsId,
    query.surprise ?? "null",
    query.surpriseSign,
    query.bandPadding ?? "auto",
    limit,
  ].join("|");
}

function round(value: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

export function clearSimilarityCache(): void {
  resultCache.clear();
}
