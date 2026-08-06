"use client";

import { ChevronDown, Minus, RotateCcw, TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { memo, useState } from "react";
import { Field } from "@/components/news-bias/Field";
import {
  DIRECTION_LABELS,
  IMPACT_LABELS,
  RESULT_COPY,
} from "@/lib/news-bias/constants";
import type {
  Analysis,
  Direction,
  TradeAction,
} from "@/lib/news-bias/types/interfaces";

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
  const { summary, playbook, intelligence } = analysis;
  const [whyOpen, setWhyOpen] = useState(false);

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

        <h2
          className={`mt-2 text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl ${ACTION_TEXT[analysis.action]}`}
        >
          {intelligence.decisionLabel}
        </h2>
        <p className="mt-1 text-lg font-bold text-nb-text">{analysis.pair.displayName}</p>

        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-nb-text-soft">
          <span aria-hidden className={`size-2.5 rounded-full ${theme.dot}`} />
          {DIRECTION_LABELS[analysis.pairDirection]}
          <span className="text-nb-faint">·</span>
          {analysis.event.label}
        </p>

        <dl className="mt-6 grid w-full max-w-sm grid-cols-2 gap-3 text-left">
          <Field
            label={RESULT_COPY.tradeImpactScore}
            value={`${intelligence.scoreTotal} / 100`}
            valueClassName="text-base tabular-nums text-nb-text"
          />
          <Field
            label={RESULT_COPY.reliability}
            value={intelligence.reliabilityLabel}
            valueClassName="text-base text-nb-text"
          />
          <Field
            label={RESULT_COPY.impact}
            value={IMPACT_LABELS[summary.impact]}
            valueClassName="text-base text-nb-text"
          />
          <Field
            label={RESULT_COPY.riskLevel}
            value={intelligence.riskLabel}
            valueClassName="text-base text-nb-text"
          />
        </dl>

        {playbook.expectedMove && analysis.action !== "wait" ? (
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-nb-faint">
            {RESULT_COPY.expectedMove}
            <span className="ml-2 font-mono normal-case tracking-normal text-nb-text-soft">
              {playbook.expectedMove.label}
            </span>
          </p>
        ) : null}

        <p className="mt-6 max-w-md text-base leading-relaxed text-nb-text-soft">
          {summary.reason}
        </p>

        <button
          type="button"
          aria-expanded={whyOpen}
          onClick={() => setWhyOpen((v) => !v)}
          className="mt-4 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-nb-border px-4 text-xs font-semibold uppercase tracking-[0.14em] text-nb-muted hover:border-nb-border-strong hover:text-nb-text focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
        >
          {RESULT_COPY.why}
          <ChevronDown
            aria-hidden
            className={`size-3.5 transition ${whyOpen ? "rotate-180" : ""}`}
          />
        </button>

        {whyOpen ? (
          <div className="mt-3 w-full max-w-md space-y-2 rounded-2xl border border-nb-border bg-nb-elevated/40 px-4 py-3 text-left">
            {intelligence.why.map((factor) => (
              <div key={factor.title}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-nb-faint">
                  {factor.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-nb-text-soft">
                  {factor.detail}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {analysis.surprise.isEstimate ? (
          <p className="mt-3 text-xs text-nb-faint">{RESULT_COPY.estimate}</p>
        ) : null}

        <p className="mt-4 max-w-md text-xs leading-relaxed text-nb-faint">
          <span className="font-semibold uppercase tracking-[0.14em]">
            {RESULT_COPY.risk}
          </span>
          <span className="mt-1 block normal-case tracking-normal">
            {analysis.riskWarning}
          </span>
        </p>

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
