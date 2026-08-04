"use client";

import { useCallback, useEffect, useState } from "react";
import { DetailsPanel } from "@/components/news-bias/DetailsPanel";
import { OutcomeButtons } from "@/components/news-bias/OutcomeButtons";
import type { ReleaseInputValues } from "@/components/news-bias/ReleaseInputs";
import { ResultCard } from "@/components/news-bias/ResultCard";
import { SelectionBar } from "@/components/news-bias/SelectionBar";
import type { SelectionChip } from "@/components/news-bias/SelectionBar";
import { StepPicker } from "@/components/news-bias/StepPicker";
import {
  HISTORY_SAVE_DELAY_MS,
  OUTCOME_OPTIONS,
  STEP_COPY,
} from "@/lib/news-bias/constants";
import { buildAnalysis } from "@/lib/news-bias/logic";
import { findEvent, newsEventOptions } from "@/lib/news-bias/news";
import { findPair, tradingPairOptions } from "@/lib/news-bias/pairs";
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

type StepKey = "news" | "pair" | "outcome";

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
  const [editingStep, setEditingStep] = useState<StepKey | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

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

  const effectiveSign = analysis?.surprise.sign ?? outcome;
  const nextStep: StepKey | null = !eventId
    ? "news"
    : !pairId
      ? "pair"
      : effectiveSign === null
        ? "outcome"
        : null;
  const activeStep = editingStep ?? nextStep;

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

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

  const chooseEvent = useCallback((id: NewsEventId) => {
    setEventId(id);
    setEditingStep(null);
  }, []);

  const choosePair = useCallback((id: PairId) => {
    setPairId(id);
    setEditingStep(null);
  }, []);

  /**
   * Tapping an outcome is the quick path, so it drops release values that point
   * the other way rather than silently losing to them.
   */
  const chooseOutcome = useCallback(
    (sign: SurpriseSign) => {
      setOutcome(sign);
      setEditingStep(null);
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
    setEditingStep(null);
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
    setEditingStep(null);
  }, []);

  const chips = buildChips({
    eventId,
    pairId,
    sign: effectiveSign,
    activeStep,
    onEdit: setEditingStep,
  });

  return (
    <div className="space-y-5">
      {chips.length > 0 ? <SelectionBar chips={chips} /> : null}

      {activeStep === "news" ? (
        <StepPicker
          step={STEP_COPY.news.step}
          title={STEP_COPY.news.title}
          options={newsEventOptions}
          value={eventId}
          onChange={chooseEvent}
        />
      ) : null}

      {activeStep === "pair" ? (
        <StepPicker
          step={STEP_COPY.pair.step}
          title={STEP_COPY.pair.title}
          options={tradingPairOptions}
          value={pairId}
          onChange={choosePair}
          columns={2}
        />
      ) : null}

      {activeStep === "outcome" ? (
        <OutcomeButtons value={effectiveSign} onChange={chooseOutcome} />
      ) : null}

      {analysis ? <ResultCard analysis={analysis} onReset={reset} /> : null}

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

function buildChips({
  eventId,
  pairId,
  sign,
  activeStep,
  onEdit,
}: {
  eventId: NewsEventId | null;
  pairId: PairId | null;
  sign: SurpriseSign | null;
  activeStep: StepKey | null;
  onEdit: (step: StepKey) => void;
}): SelectionChip[] {
  const chips: SelectionChip[] = [];
  const event = findEvent(eventId);
  const pair = findPair(pairId);
  const outcomeOption = OUTCOME_OPTIONS.find((option) => option.sign === sign);

  if (event && activeStep !== "news") {
    chips.push({
      id: "news",
      label: event.label,
      onEdit: () => onEdit("news"),
    });
  }
  if (pair && activeStep !== "pair") {
    chips.push({ id: "pair", label: pair.label, onEdit: () => onEdit("pair") });
  }
  if (outcomeOption && activeStep !== "outcome") {
    chips.push({
      id: "outcome",
      label: outcomeOption.caption,
      onEdit: () => onEdit("outcome"),
    });
  }

  return chips;
}
