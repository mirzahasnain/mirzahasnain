"use client";

import { Minus, RotateCcw, TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { memo } from "react";
import { Field } from "@/components/news-bias/Field";
import {
  ACTION_LABELS,
  DIRECTION_LABELS,
  IMPACT_LABELS,
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
  dot: string;
  border: string;
  halo: string;
  ring: string;
}

const THEME: Record<Direction, DirectionTheme> = {
  bullish: {
    icon: TrendingUp,
    text: "text-nb-up",
    dot: "bg-nb-up",
    border: "border-nb-up/30",
    halo: "bg-nb-up/15",
    ring: "ring-nb-up/30",
  },
  bearish: {
    icon: TrendingDown,
    text: "text-nb-down",
    dot: "bg-nb-down",
    border: "border-nb-down/30",
    halo: "bg-nb-down/15",
    ring: "ring-nb-down/30",
  },
  neutral: {
    icon: Minus,
    text: "text-nb-flat",
    dot: "bg-nb-flat",
    border: "border-nb-border",
    halo: "bg-nb-flat/10",
    ring: "ring-nb-border-strong",
  },
};

const ACTION_TEXT: Record<TradeAction, string> = {
  buy: "text-nb-up",
  sell: "text-nb-down",
  wait: "text-nb-wait",
};

function ResultCardComponent({ analysis, onReset }: ResultCardProps) {
  const theme = THEME[analysis.pairDirection];
  const Icon = theme.icon;

  return (
    <section
      aria-live="polite"
      className={`nb-fade relative overflow-hidden rounded-3xl border bg-nb-surface px-6 py-8 text-center sm:px-10 sm:py-10 ${theme.border}`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-28 left-1/2 size-72 -translate-x-1/2 rounded-full blur-3xl ${theme.halo}`}
      />

      <div className="relative flex flex-col items-center">
        <div
          className={`flex size-14 items-center justify-center rounded-full bg-nb-elevated ring-1 ${theme.ring}`}
        >
          <Icon aria-hidden className={`size-7 ${theme.text}`} />
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.35em] text-nb-faint">
          {RESULT_COPY.eyebrow}
        </p>

        <h2 className="mt-2 text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl">
          <span className={ACTION_TEXT[analysis.action]}>
            {ACTION_LABELS[analysis.action]}
          </span>{" "}
          <span className="text-nb-text">{analysis.pair.label}</span>
        </h2>

        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-nb-text-soft">
          <span aria-hidden className={`size-2.5 rounded-full ${theme.dot}`} />
          {DIRECTION_LABELS[analysis.pairDirection]}
          <span className="text-nb-faint">·</span>
          {analysis.event.label}
        </p>

        <dl className="mt-6 grid w-full max-w-sm grid-cols-2 gap-3 text-left">
          <Field
            label={RESULT_COPY.confidence}
            value={formatConfidence(analysis.surprise.confidence)}
            valueClassName="text-base tabular-nums text-nb-text"
          />
          <Field
            label={RESULT_COPY.impact}
            value={IMPACT_LABELS[analysis.surprise.impact]}
            valueClassName="text-base text-nb-text"
          />
        </dl>

        <p className="mt-6 max-w-md text-base leading-relaxed text-nb-text-soft">
          {analysis.reason}
        </p>

        {analysis.surprise.isEstimate ? (
          <p className="mt-3 text-xs text-nb-faint">{RESULT_COPY.estimate}</p>
        ) : null}

        <button
          type="button"
          onClick={onReset}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-nb-border px-6 text-sm font-semibold text-nb-text-soft hover:border-nb-border-strong hover:text-nb-text focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
        >
          <RotateCcw aria-hidden className="size-4" />
          {RESULT_COPY.reset}
        </button>
      </div>
    </section>
  );
}

export const ResultCard = memo(ResultCardComponent);
