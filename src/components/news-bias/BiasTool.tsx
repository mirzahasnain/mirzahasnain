"use client";

import { useEffect, useRef, useState } from "react";
import { ButtonGroup } from "@/components/news-bias/ButtonGroup";
import { Dropdown } from "@/components/news-bias/Dropdown";
import { ResultCard } from "@/components/news-bias/ResultCard";
import { Section } from "@/components/news-bias/Section";
import {
  getBiasVerdict,
  newsEventOptions,
  tradingPairOptions,
} from "@/lib/news-bias/logic";
import type {
  NewsEventId,
  PairId,
  ReleaseOutcome,
} from "@/lib/news-bias/types";

export function BiasTool() {
  const [eventId, setEventId] = useState<NewsEventId | null>(null);
  const [pairId, setPairId] = useState<PairId | null>(null);
  const [outcome, setOutcome] = useState<ReleaseOutcome | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const isReady = Boolean(eventId && pairId);
  const verdict = getBiasVerdict(eventId, pairId, outcome);

  useEffect(() => {
    if (!outcome) return;
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [outcome]);

  const reset = () => {
    setEventId(null);
    setPairId(null);
    setOutcome(null);
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

      <div ref={resultRef}>
        {verdict ? (
          <ResultCard verdict={verdict} onReset={reset} />
        ) : (
          <p className="rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center text-sm text-slate-500">
            Your bias will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
