"use client";

import { IMPACT_METER_LABELS } from "@/lib/news-bias/modules/analytics";
import { TERMINAL_COPY } from "@/lib/news-bias/modules/dashboard/copy";
import type { ImpactMeterLevel } from "@/lib/news-bias/modules/types";

interface ImpactMeterProps {
  level: ImpactMeterLevel;
}

const LEVEL_INDEX: Record<ImpactMeterLevel, number> = {
  "very-low": 0,
  low: 1,
  medium: 2,
  high: 3,
  extreme: 4,
};

export function ImpactMeter({ level }: ImpactMeterProps) {
  const idx = LEVEL_INDEX[level];
  const pct = ((idx + 0.5) / 5) * 100;

  return (
    <section className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4">
      <h2 className="text-sm font-semibold text-nb-text">{TERMINAL_COPY.impact.title}</h2>
      <div className="relative mx-auto mt-4 h-28 w-full max-w-xs">
        <div
          className="absolute inset-x-0 bottom-0 h-24 overflow-hidden rounded-t-full"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 100%, #34d399 0deg, #fcd34d 70deg, #f87171 140deg, transparent 180deg)",
            maskImage:
              "radial-gradient(circle at 50% 100%, transparent 42%, #000 43%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 100%, transparent 42%, #000 43%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 h-[4.5rem] w-0.5 origin-bottom bg-nb-text transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-50%) rotate(${-90 + pct * 1.8}deg)` }}
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 text-center">
          <p className="text-lg font-black text-nb-text">
            {IMPACT_METER_LABELS[level]}
          </p>
        </div>
      </div>
      <ul className="mt-3 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-nb-faint">
        {(["very-low", "low", "medium", "high", "extreme"] as const).map((l) => (
          <li key={l} className={l === level ? "text-nb-accent" : undefined}>
            {IMPACT_METER_LABELS[l].split(" ")[0]}
          </li>
        ))}
      </ul>
    </section>
  );
}
