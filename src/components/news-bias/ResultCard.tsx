"use client";

import { RotateCcw, TrendingDown, TrendingUp } from "lucide-react";
import { BIAS_LABELS, OUTCOME_LABELS } from "@/lib/news-bias/constants";
import type { BiasVerdict } from "@/lib/news-bias/types";

interface ResultCardProps {
  verdict: BiasVerdict;
  onReset: () => void;
}

const THEME = {
  bullish: {
    icon: TrendingUp,
    text: "text-emerald-400",
    border: "border-emerald-400/30",
    halo: "bg-emerald-500/15",
    ring: "ring-emerald-400/30",
    chip: "bg-emerald-400/10 text-emerald-300",
  },
  bearish: {
    icon: TrendingDown,
    text: "text-red-400",
    border: "border-red-400/30",
    halo: "bg-red-500/15",
    ring: "ring-red-400/30",
    chip: "bg-red-400/10 text-red-300",
  },
} as const;

export function ResultCard({ verdict, onReset }: ResultCardProps) {
  const theme = THEME[verdict.pairBias];
  const Icon = theme.icon;

  return (
    <section
      aria-live="polite"
      className={`relative overflow-hidden rounded-2xl border bg-[#0b1119]/80 p-6 sm:p-8 ${theme.border}`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full blur-3xl ${theme.halo}`}
      />

      <div className="relative flex flex-col items-center text-center">
        <div
          className={`flex size-20 items-center justify-center rounded-full bg-white/5 ring-1 sm:size-24 ${theme.ring}`}
        >
          <Icon aria-hidden className={`size-10 sm:size-12 ${theme.text}`} />
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
          Expected Bias
        </p>
        <p
          className={`mt-2 text-5xl font-black uppercase tracking-tight sm:text-6xl ${theme.text}`}
        >
          {BIAS_LABELS[verdict.pairBias]}
        </p>

        <span
          className={`mt-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${theme.chip}`}
        >
          USD {BIAS_LABELS[verdict.usdBias]}
        </span>
      </div>

      <dl className="relative mt-8 grid gap-3 sm:grid-cols-3">
        <Detail label="News" value={verdict.event.label} />
        <Detail label="Pair" value={verdict.pair.label} />
        <Detail label="Result" value={OUTCOME_LABELS[verdict.outcome]} />
      </dl>

      <p className="relative mt-5 text-sm leading-relaxed text-slate-400">
        {verdict.rationale}
      </p>

      <button
        type="button"
        onClick={onReset}
        className="relative mt-6 inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-white/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
      >
        <RotateCcw aria-hidden className="size-4" />
        New selection
      </button>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
      <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-bold text-balance text-slate-100">
        {value}
      </dd>
    </div>
  );
}
