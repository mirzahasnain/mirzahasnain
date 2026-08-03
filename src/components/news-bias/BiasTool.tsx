"use client";

import { useEffect, useRef, useState } from "react";
import { AffectedAssetsGrid } from "@/components/news-bias/AffectedAssetsGrid";
import { ButtonGroup } from "@/components/news-bias/ButtonGroup";
import { CopyAnalysisButton } from "@/components/news-bias/CopyAnalysisButton";
import { Dropdown } from "@/components/news-bias/Dropdown";
import { ImpactStrengthCard } from "@/components/news-bias/ImpactStrengthCard";
import { MarketExplanation } from "@/components/news-bias/MarketExplanation";
import { ResultCard } from "@/components/news-bias/ResultCard";
import { Section } from "@/components/news-bias/Section";
import { TradeBiasCard } from "@/components/news-bias/TradeBiasCard";
import { DEFAULT_DEVIATION } from "@/lib/news-bias/constants";
import { getBiasAnalysis } from "@/lib/news-bias/logic";
import { newsEventOptions } from "@/lib/news-bias/news";
import { tradingPairOptions } from "@/lib/news-bias/pairs";
import { buildAnalysisText } from "@/lib/news-bias/share";
import type {
  DeviationSize,
  NewsEventId,
  PairId,
  ReleaseOutcome,
} from "@/lib/news-bias/types";

export function BiasTool() {
  const [eventId, setEventId] = useState<NewsEventId | null>(null);
  const [pairId, setPairId] = useState<PairId | null>(null);
  const [outcome, setOutcome] = useState<ReleaseOutcome | null>(null);
  const [deviation, setDeviation] =
    useState<DeviationSize>(DEFAULT_DEVIATION);
  const resultRef = useRef<HTMLDivElement>(null);

  const isReady = Boolean(eventId && pairId);
  const analysis = getBiasAnalysis(eventId, pairId, outcome, deviation);

  useEffect(() => {
    if (!outcome) return;
    resultRef.current?.scrollIntoView({ block: "nearest" });
  }, [outcome]);

  const reset = () => {
    setEventId(null);
    setPairId(null);
    setOutcome(null);
    setDeviation(DEFAULT_DEVIATION);
  };

  return (
    <div className="space-y-4">
      <Section step="01" title="Economic News">
        <Dropdown
          label="Economic news event"
          placeholder="Select an economic news event"
          options={newsEventOptions}
          value={eventId}
          onChange={setEventId}
        />
      </Section>

      <Section step="02" title="Trading Pair">
        <Dropdown
          label="Trading pair"
          placeholder="Select a trading pair"
          options={tradingPairOptions}
          value={pairId}
          onChange={setPairId}
        />
      </Section>

      <Section
        step="03"
        title="Result"
        hint={
          isReady
            ? "How did the release land against the forecast?"
            : "Select a news event and trading pair first."
        }
      >
        <ButtonGroup value={outcome} onChange={setOutcome} disabled={!isReady} />
      </Section>

      <div ref={resultRef} className="space-y-4">
        {analysis ? (
          <>
            <ResultCard verdict={analysis} onReset={reset} />
            <ImpactStrengthCard
              outcome={analysis.outcome}
              value={deviation}
              onChange={setDeviation}
            />
            <TradeBiasCard analysis={analysis} />
            <MarketExplanation lines={analysis.explanation} />
            <AffectedAssetsGrid assets={analysis.affectedAssets} />
            <CopyAnalysisButton text={buildAnalysisText(analysis)} />
          </>
        ) : (
          <p className="rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center text-sm text-slate-500">
            Your bias will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
