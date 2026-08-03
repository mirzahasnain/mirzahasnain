"use client";

import { useCallback, useEffect, useState } from "react";
import { AffectedAssetsGrid } from "@/components/news-bias/AffectedAssetsGrid";
import { Dropdown } from "@/components/news-bias/Dropdown";
import { ExportActions } from "@/components/news-bias/ExportActions";
import { FullAnalysis } from "@/components/news-bias/FullAnalysis";
import { HistoryPanel } from "@/components/news-bias/HistoryPanel";
import { ReleaseInputs } from "@/components/news-bias/ReleaseInputs";
import type { ReleaseInputValues } from "@/components/news-bias/ReleaseInputs";
import { ResultCard } from "@/components/news-bias/ResultCard";
import { Section } from "@/components/news-bias/Section";
import { SurpriseCard } from "@/components/news-bias/SurpriseCard";
import { TradeDecisionCard } from "@/components/news-bias/TradeDecisionCard";
import {
  EMPTY_STATE,
  HISTORY_SAVE_DELAY_MS,
  SECTION_COPY,
} from "@/lib/news-bias/constants";
import { buildAnalysis } from "@/lib/news-bias/logic";
import { newsEventOptions } from "@/lib/news-bias/news";
import { tradingPairOptions } from "@/lib/news-bias/pairs";
import type {
  HistoryEntry,
  NewsEventId,
  PairId,
} from "@/lib/news-bias/types/interfaces";
import { parseNumber } from "@/lib/news-bias/utils/calculateSurprise";
import {
  clearHistory,
  loadHistory,
  saveToHistory,
} from "@/lib/news-bias/utils/history";

const EMPTY_INPUTS: ReleaseInputValues = {
  forecast: "",
  previous: "",
  actual: "",
};

export function BiasTool() {
  const [eventId, setEventId] = useState<NewsEventId | null>(null);
  const [pairId, setPairId] = useState<PairId | null>(null);
  const [inputs, setInputs] = useState<ReleaseInputValues>(EMPTY_INPUTS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const forecast = parseNumber(inputs.forecast);
  const previous = parseNumber(inputs.previous);
  const actual = parseNumber(inputs.actual);

  const isSelected = Boolean(eventId && pairId);
  const analysis = buildAnalysis({ eventId, pairId, forecast, previous, actual });

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    if (!eventId || !pairId || forecast === null || actual === null) return;

    const timer = setTimeout(() => {
      setHistory(
        saveToHistory({ eventId, pairId, forecast, previous, actual }),
      );
    }, HISTORY_SAVE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [eventId, pairId, forecast, previous, actual]);

  const reset = useCallback(() => {
    setEventId(null);
    setPairId(null);
    setInputs(EMPTY_INPUTS);
  }, []);

  const openEntry = useCallback((entry: HistoryEntry) => {
    setEventId(entry.eventId);
    setPairId(entry.pairId);
    setInputs({
      forecast: String(entry.forecast),
      previous: entry.previous === null ? "" : String(entry.previous),
      actual: String(entry.actual),
    });
  }, []);

  return (
    <div className="space-y-4">
      <Section step={SECTION_COPY.news.step} title={SECTION_COPY.news.title}>
        <Dropdown
          label={SECTION_COPY.news.label}
          placeholder={SECTION_COPY.news.placeholder}
          options={newsEventOptions}
          value={eventId}
          onChange={setEventId}
        />
      </Section>

      <Section step={SECTION_COPY.pair.step} title={SECTION_COPY.pair.title}>
        <Dropdown
          label={SECTION_COPY.pair.label}
          placeholder={SECTION_COPY.pair.placeholder}
          options={tradingPairOptions}
          value={pairId}
          onChange={setPairId}
        />
      </Section>

      <Section
        step={SECTION_COPY.release.step}
        title={SECTION_COPY.release.title}
        hint={
          isSelected
            ? SECTION_COPY.release.readyHint
            : SECTION_COPY.release.waitingHint
        }
      >
        <ReleaseInputs values={inputs} onChange={setInputs} />
      </Section>

      {analysis ? (
        <>
          <ResultCard analysis={analysis} onReset={reset} />
          <SurpriseCard
            surprise={analysis.surprise}
            values={analysis.values}
          />
          <TradeDecisionCard analysis={analysis} />
          <FullAnalysis lines={analysis.analysisLines} />
          <AffectedAssetsGrid assets={analysis.affectedAssets} />
          <ExportActions analysis={analysis} />
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center text-sm text-slate-500">
          {isSelected ? EMPTY_STATE.missingValues : EMPTY_STATE.waiting}
        </p>
      )}

      {history.length > 0 ? (
        <HistoryPanel
          entries={history}
          onOpen={openEntry}
          onClear={() => setHistory(clearHistory())}
        />
      ) : null}
    </div>
  );
}
