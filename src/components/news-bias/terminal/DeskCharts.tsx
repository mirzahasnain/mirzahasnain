"use client";

import { TERMINAL_COPY } from "@/lib/news-bias/modules/dashboard/copy";
import type { MiniChartSeries } from "@/lib/news-bias/modules/types";

interface DeskChartsProps {
  series: MiniChartSeries[];
}

export function DeskCharts({ series }: DeskChartsProps) {
  return (
    <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
      <h2 className="text-sm font-semibold text-nb-text">{TERMINAL_COPY.charts.title}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {series.map((chart) => (
          <MiniChartCard key={chart.assetId} chart={chart} />
        ))}
      </div>
    </section>
  );
}

function MiniChartCard({ chart }: { chart: MiniChartSeries }) {
  const width = 200;
  const height = 64;
  const values = chart.points.map((p) => p.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const d = chart.points
    .map((p, i) => {
      const x = (i / Math.max(chart.points.length - 1, 1)) * width;
      const y = height - ((p.v - min) / span) * (height - 8) - 4;
      return `${i === 0 ? "M" : "L"} ${x},${y}`;
    })
    .join(" ");
  const up = chart.changePct >= 0;

  return (
    <div className="rounded-xl bg-nb-elevated/50 px-3 py-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-bold text-nb-text">{chart.label}</p>
        <p
          className={[
            "font-mono text-xs tabular-nums",
            up ? "text-nb-up" : "text-nb-down",
          ].join(" ")}
        >
          {up ? "+" : ""}
          {chart.changePct}%
        </p>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-2 h-16 w-full"
        role="img"
        aria-label={`${chart.label} mini chart`}
      >
        <path
          d={d}
          fill="none"
          stroke={up ? "var(--nb-up)" : "var(--nb-down)"}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
