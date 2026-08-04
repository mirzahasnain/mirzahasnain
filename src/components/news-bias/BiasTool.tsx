"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DetailsPanel } from "@/components/news-bias/DetailsPanel";
import { OutcomeButtons } from "@/components/news-bias/OutcomeButtons";
import type { ReleaseInputValues } from "@/components/news-bias/ReleaseInputs";
import { ResultCard } from "@/components/news-bias/ResultCard";
import { StepPicker } from "@/components/news-bias/StepPicker";
import { HISTORY_SAVE_DELAY_MS, STEP_COPY } from "@/lib/news-bias/constants";
import { buildAnalysis } from "@/lib/news-bias/logic";
import { newsEventOptions } from "@/lib/news-bias/news";
import { tradingPairOptions } from "@/lib/news-bias/pairs";
import type {
  HistoryEntry,
  NewsEventId,
  PairId,
  SurpriseSign,
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
  const [outcome, setOutcome] = useState<SurpriseSign | null>(null);
  const [inputs, setInputs] = useState<ReleaseInputValues>(EMPTY_INPUTS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const forecast = parseNumber(inputs.forecast);
  const previous = parseNumber(inputs.previous);
  const actual = parseNumber(inputs.actual);

  const analysis = buildAnalysis({
    eventId,
    pairId,
    outcome,
    forecast,
    previous,
    actual,
  });
  const hasResult = analysis !== null;

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    if (hasResult) resultRef.current?.scrollIntoView({ block: "nearest" });
  }, [hasResult]);

  useEffect(() => {
    if (!eventId || !pairId) return;
    if (outcome === null && (forecast === null || actual === null)) return;

    const timer = setTimeout(() => {
      setHistory(
        saveToHistory({ eventId, pairId, outcome, forecast, previous, actual }),
      );
    }, HISTORY_SAVE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [eventId, pairId, outcome, forecast, previous, actual]);

  /**
   * Tapping an outcome is the quick path, so it drops release values that point
   * the other way rather than silently losing to them.
   */
  const chooseOutcome = useCallback(
    (sign: SurpriseSign) => {
      setOutcome(sign);
      if (analysis?.values && analysis.surprise.sign !== sign) {
        setInputs(EMPTY_INPUTS);
      }
    },
    [analysis],
  );

  const reset = useCallback(() => {
    setEventId(null);
    setPairId(null);
    setOutcome(null);
    setInputs(EMPTY_INPUTS);
  }, []);

  const openEntry = useCallback((entry: HistoryEntry) => {
    setEventId(entry.eventId);
    setPairId(entry.pairId);
    setOutcome(entry.outcome);
    setInputs({
      forecast: entry.forecast === null ? "" : String(entry.forecast),
      previous: entry.previous === null ? "" : String(entry.previous),
      actual: entry.actual === null ? "" : String(entry.actual),
    });
  }, []);

  return (
    <div className="space-y-5">
      <StepPicker
        step={STEP_COPY.news.step}
        title={STEP_COPY.news.title}
        options={newsEventOptions}
        value={eventId}
        onChange={setEventId}
      />

      {eventId ? (
        <StepPicker
          step={STEP_COPY.pair.step}
          title={STEP_COPY.pair.title}
          options={tradingPairOptions}
          value={pairId}
          onChange={setPairId}
          columns={2}
        />
      ) : null}

      {eventId && pairId ? (
        <OutcomeButtons
          value={analysis?.surprise.sign ?? outcome}
          onChange={chooseOutcome}
        />
      ) : null}

      <div ref={resultRef}>
        {analysis ? <ResultCard analysis={analysis} onReset={reset} /> : null}
      </div>

      {analysis || history.length > 0 ? (
        <DetailsPanel
          analysis={analysis}
          inputs={inputs}
          onInputsChange={setInputs}
          history={history}
          onOpenEntry={openEntry}
          onClearHistory={() => setHistory(clearHistory())}
        />
      ) : null}
    </div>
  );
}
