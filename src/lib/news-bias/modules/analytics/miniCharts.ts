import type { BiasTone, MiniChartSeries, WatchAssetId } from "../types";

/**
 * Deterministic mock mini-series for offline/terminal charts.
 * Seeded by asset + bias so charts stay stable across renders.
 */
export function buildMiniChart(
  assetId: WatchAssetId,
  label: string,
  bias: BiasTone,
  points = 24,
): MiniChartSeries {
  let seed = hash(`${assetId}:${bias}`);
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const drift =
    bias === "bullish" ? 0.08 : bias === "bearish" ? -0.08 : 0.01;
  let v = 100;
  const series: { t: number; v: number }[] = [];
  for (let i = 0; i < points; i++) {
    v = v + drift + (rand() - 0.5) * 1.4;
    series.push({ t: i, v: Number(v.toFixed(2)) });
  }
  const first = series[0]!.v;
  const last = series[series.length - 1]!.v;
  const changePct = Number((((last - first) / first) * 100).toFixed(2));

  return { assetId, label, points: series, changePct };
}

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
