"use client";

import { useId, useMemo } from "react";
import type { HistoricalIntelligenceView } from "@/lib/news-bias/types/interfaces";

interface HistoricalChartProps {
  intel: HistoricalIntelligenceView;
}

type SeriesKey = "forecast" | "previous" | "actual" | "surprise";

const SERIES: { key: SeriesKey; label: string; color: string }[] = [
  { key: "forecast", label: "Forecast", color: "var(--nb-muted)" },
  { key: "previous", label: "Previous", color: "var(--nb-faint)" },
  { key: "actual", label: "Actual", color: "var(--nb-accent)" },
  { key: "surprise", label: "Surprise", color: "var(--nb-wait)" },
];

/**
 * Lightweight SVG multi-line chart — no chart library dependency.
 * Lazy-loaded via next/dynamic from the details panel.
 */
export function HistoricalChart({ intel }: HistoricalChartProps) {
  const gradId = useId();
  const { dates } = intel.chart;
  const width = 320;
  const height = 160;
  const pad = { top: 12, right: 8, bottom: 22, left: 8 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const paths = useMemo(() => {
    return SERIES.map((series) => {
      const values = intel.chart[series.key];
      if (values.length < 2) return { ...series, d: "" };

      const min = Math.min(...values);
      const max = Math.max(...values);
      const span = max - min || 1;

      const points = values.map((v, i) => {
        const x = pad.left + (i / (values.length - 1)) * innerW;
        const y = pad.top + (1 - (v - min) / span) * innerH;
        return `${x},${y}`;
      });

      return { ...series, d: `M ${points.join(" L ")}` };
    });
  }, [intel.chart, innerH, innerW, pad.left, pad.top]);

  if (dates.length < 2) {
    return <p className="text-sm text-nb-muted">Not enough history to chart.</p>;
  }

  return (
    <div className="space-y-3">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Historical forecast, previous, actual and surprise"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--nb-accent)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--nb-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect
          x={pad.left}
          y={pad.top}
          width={innerW}
          height={innerH}
          fill={`url(#${gradId})`}
          opacity={0.35}
        />
        {paths.map((series) =>
          series.d ? (
            <path
              key={series.key}
              d={series.d}
              fill="none"
              stroke={series.color}
              strokeWidth={series.key === "actual" ? 2.25 : 1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null,
        )}
        <text
          x={pad.left}
          y={height - 6}
          className="fill-nb-faint"
          style={{ fontSize: 9 }}
        >
          {dates[0]}
        </text>
        <text
          x={width - pad.right}
          y={height - 6}
          textAnchor="end"
          className="fill-nb-faint"
          style={{ fontSize: 9 }}
        >
          {dates[dates.length - 1]}
        </text>
      </svg>

      <ul className="flex flex-wrap gap-3 text-[11px] text-nb-muted">
        {SERIES.map((series) => (
          <li key={series.key} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="inline-block size-2 rounded-full"
              style={{ background: series.color }}
            />
            {series.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
