"use client";

import type { TradeImpactIntelligenceView } from "@/lib/news-bias/types/interfaces";

interface IntelligencePanelProps {
  intelligence: TradeImpactIntelligenceView;
}

/** Compact TIE detail blocks — reuses existing nb surface styles. */
export function IntelligencePanel({ intelligence }: IntelligencePanelProps) {
  return (
    <div className="space-y-4">
      <Block title="TradeImpact Score™">
        <p className="text-2xl font-black tabular-nums text-nb-text">
          {intelligence.scoreTotal}
          <span className="text-sm font-semibold text-nb-muted"> / 100</span>
        </p>
        <ul className="mt-3 space-y-1 text-xs text-nb-muted">
          <li>Historical Match {intelligence.scoreBreakdown.historicalMatch}</li>
          <li>Surprise Strength {intelligence.scoreBreakdown.surpriseStrength}</li>
          <li>News Importance {intelligence.scoreBreakdown.newsImportance}</li>
          <li>Market Correlation {intelligence.scoreBreakdown.marketCorrelation}</li>
          <li>Volatility {intelligence.scoreBreakdown.volatility}</li>
        </ul>
      </Block>

      <Block title="Historical Match">
        <p className="text-sm font-semibold text-nb-text">
          Similar Releases {intelligence.historicalSimilar}
        </p>
        <ul className="mt-2 space-y-1 text-sm text-nb-text-soft">
          {intelligence.averageMoves.map((m) => (
            <li key={m.label}>
              Average {m.label} Move {m.display}
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Scenarios">
        <ul className="space-y-1 text-sm text-nb-text-soft">
          {intelligence.scenarios.map((s) => (
            <li key={s.label} className="flex justify-between gap-3">
              <span>{s.label}</span>
              <span className="font-mono text-nb-text">{s.display}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Correlation">
        <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {intelligence.correlation.map((c) => (
            <li
              key={c.label}
              className="rounded-xl bg-nb-elevated/50 px-2.5 py-2 text-center text-xs font-semibold text-nb-text"
            >
              {c.label}{" "}
              <span className="text-nb-muted">{c.move}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Decision Tree">
        <ol className="space-y-2">
          {intelligence.decisionTree.map((step) => (
            <li key={step.label} className="rounded-xl bg-nb-elevated/40 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-nb-faint">
                {step.label}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-nb-text">{step.summary}</p>
              <p className="text-xs text-nb-muted">{step.detail}</p>
            </li>
          ))}
        </ol>
      </Block>

      <Block title="AI Narrative">
        <ul className="space-y-2">
          {intelligence.narrative.map((line) => (
            <li key={line} className="text-sm leading-relaxed text-nb-text-soft">
              {line}
            </li>
          ))}
        </ul>
      </Block>
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nb-faint">
        {title}
      </h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}
