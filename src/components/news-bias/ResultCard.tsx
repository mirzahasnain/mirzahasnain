"use client";

import { Minus, RotateCcw, TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Field } from "@/components/news-bias/Field";
import {
  CARD_COPY,
  DIRECTION_LABELS,
  OUTCOME_LABELS,
} from "@/lib/news-bias/constants";
import type { Analysis, Direction } from "@/lib/news-bias/types/interfaces";

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
  chip: string;
}

const THEME: Record<Direction, DirectionTheme> = {
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
  neutral: {
    icon: Minus,
    text: "text-slate-300",
    border: "border-white/15",
    halo: "bg-slate-500/15",
    ring: "ring-white/20",
    chip: "bg-white/5 text-slate-300",
  },
};

export function ResultCard({ analysis, onReset }: ResultCardProps) {
  const theme = THEME[analysis.pairDirection];
  const Icon = theme.icon;
  const { eyebrow, usdPrefix, reset, labels } = CARD_COPY.result;

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
          {eyebrow}
        </p>
        <p
          className={`mt-2 text-5xl font-black uppercase tracking-tight sm:text-6xl ${theme.text}`}
        >
          {DIRECTION_LABELS[analysis.pairDirection]}
        </p>

        <span
          className={`mt-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${theme.chip}`}
        >
          {usdPrefix} {DIRECTION_LABELS[analysis.usdDirection]}
        </span>
      </div>

      <dl className="relative mt-8 grid gap-3 sm:grid-cols-3">
        <Field label={labels.news} value={analysis.event.label} />
        <Field label={labels.pair} value={analysis.pair.label} />
        <Field
          label={labels.result}
          value={OUTCOME_LABELS[analysis.surprise.sign]}
        />
      </dl>

      <button
        type="button"
        onClick={onReset}
        className="relative mt-6 inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-white/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
      >
        <RotateCcw aria-hidden className="size-4" />
        {reset}
      </button>
    </section>
  );
}
