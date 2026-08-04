"use client";

import { Minus, RotateCcw, TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  ACTION_LABELS,
  DIRECTION_LABELS,
  RESULT_COPY,
} from "@/lib/news-bias/constants";
import type {
  Analysis,
  Direction,
  TradeAction,
} from "@/lib/news-bias/types/interfaces";
import { formatConfidence } from "@/lib/news-bias/utils/calculateConfidence";

interface ResultCardProps {
  analysis: Analysis;
  onReset: () => void;
}

interface DirectionTheme {
  icon: LucideIcon;
  text: string;
  border: string;
  halo: string;
  ring: string;
}

const THEME: Record<Direction, DirectionTheme> = {
  bullish: {
    icon: TrendingUp,
    text: "text-emerald-400",
    border: "border-emerald-400/30",
    halo: "bg-emerald-500/15",
    ring: "ring-emerald-400/30",
  },
  bearish: {
    icon: TrendingDown,
    text: "text-red-400",
    border: "border-red-400/30",
    halo: "bg-red-500/15",
    ring: "ring-red-400/30",
  },
  neutral: {
    icon: Minus,
    text: "text-slate-300",
    border: "border-white/15",
    halo: "bg-slate-500/15",
    ring: "ring-white/20",
  },
};

const ACTION_CLASS: Record<TradeAction, string> = {
  buy: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
  sell: "bg-red-400/10 text-red-300 ring-red-400/30",
  wait: "bg-amber-300/10 text-amber-300 ring-amber-300/30",
};

export function ResultCard({ analysis, onReset }: ResultCardProps) {
  const theme = THEME[analysis.pairDirection];
  const Icon = theme.icon;

  return (
    <section
      aria-live="polite"
      className={`relative overflow-hidden rounded-3xl border bg-[#0b1119]/80 px-6 py-10 text-center sm:px-10 sm:py-12 ${theme.border}`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-28 left-1/2 size-72 -translate-x-1/2 rounded-full blur-3xl ${theme.halo}`}
      />

      <div className="relative flex flex-col items-center">
        <div
          className={`flex size-20 items-center justify-center rounded-full bg-white/5 ring-1 ${theme.ring}`}
        >
          <Icon aria-hidden className={`size-10 ${theme.text}`} />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
          {RESULT_COPY.eyebrow}
        </p>
        <p
          className={`mt-3 text-6xl font-black uppercase leading-none tracking-tight sm:text-7xl ${theme.text}`}
        >
          {DIRECTION_LABELS[analysis.pairDirection]}
        </p>
        <p className="mt-4 text-base font-semibold text-slate-300">
          {analysis.pair.label}
          <span className="text-slate-600"> · </span>
          {analysis.event.label}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span
            className={`rounded-full px-6 py-2.5 text-2xl font-black tracking-wide ring-1 ${ACTION_CLASS[analysis.action]}`}
          >
            {ACTION_LABELS[analysis.action]}
          </span>
          <span className="text-base font-semibold text-slate-400">
            {formatConfidence(analysis.surprise.confidence)}{" "}
            {RESULT_COPY.confidenceSuffix}
          </span>
        </div>

        <p className="mt-8 max-w-md text-base leading-relaxed text-slate-300">
          {analysis.reason}
        </p>

        {analysis.surprise.isEstimate ? (
          <p className="mt-4 text-xs text-slate-500">{RESULT_COPY.estimate}</p>
        ) : null}

        <button
          type="button"
          onClick={onReset}
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-6 text-sm font-semibold text-slate-300 hover:border-white/30 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
        >
          <RotateCcw aria-hidden className="size-4" />
          {RESULT_COPY.reset}
        </button>
      </div>
    </section>
  );
}
