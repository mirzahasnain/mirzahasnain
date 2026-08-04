"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DataModeToggle } from "@/components/news-bias/calendar/DataModeToggle";
import { Disclosure } from "@/components/news-bias/Disclosure";
import { NewsSummary } from "@/components/news-bias/NewsSummary";
import { focusFirstOption } from "@/components/news-bias/optionKeyboard";
import { OutcomeButtons } from "@/components/news-bias/OutcomeButtons";
import { QuickPresets } from "@/components/news-bias/QuickPresets";
import { RecentAnalyses } from "@/components/news-bias/RecentAnalyses";
import type { ReleaseInputValues } from "@/components/news-bias/ReleaseInputs";
import { ResultCard } from "@/components/news-bias/ResultCard";
import { SearchField } from "@/components/news-bias/SearchField";
import type { SelectionChip } from "@/components/news-bias/SelectionBar";
import { StepPicker } from "@/components/news-bias/StepPicker";
import {
  DETAILS_COPY,
  HISTORY_SAVE_DELAY_MS,
  OUTCOME_OPTIONS,
  STEP_COPY,
} from "@/lib/news-bias/constants";
import { useLiveNews, type DataMode } from "@/lib/news-bias/calendar";
import { loadDataMode, saveDataMode } from "@/lib/news-bias/calendar/utils/dataMode";
import { buildAnalysis } from "@/lib/news-bias/logic";
import {
  findEvent,
  newsEventOptions,
  newsPresetOptions,
} from "@/lib/news-bias/news";
import { findPair, getPairSections } from "@/lib/news-bias/pairs";
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
import { groupRecent } from "@/lib/news-bias/utils/recent";

/** Loaded the first time the disclosure is opened. */
const DetailsPanel = dynamic(
  () =>
    import("@/components/news-bias/DetailsPanel").then((mod) => mod.DetailsPanel),
  { ssr: false },
);

type StepKey = "news" | "pair" | "outcome";

const EMPTY_INPUTS: ReleaseInputValues = {
  forecast: "",
  previous: "",
  actual: "",
};

const NEWS_EVENT_IDS: ReadonlySet<string> = new Set(
  newsEventOptions.map((o) => o.value),
);

const NEWS_SECTIONS = [{ id: "news", options: newsEventOptions }];

function isNewsEventId(value: string | null): value is NewsEventId {
  return value !== null && NEWS_EVENT_IDS.has(value as NewsEventId);
}

function readPrefill(searchParams: URLSearchParams): {
  eventId: NewsEventId | null;
  inputs: ReleaseInputValues;
  mode: DataMode | null;
  calendarId: string | null;
} {
  const eventParam = searchParams.get("event");
  const modeParam = searchParams.get("mode");
  return {
    eventId: isNewsEventId(eventParam) ? eventParam : null,
    inputs: {
      forecast: searchParams.get("forecast") ?? "",
      previous: searchParams.get("previous") ?? "",
      actual: searchParams.get("actual") ?? "",
    },
    mode: modeParam === "live" || modeParam === "manual" ? modeParam : null,
    calendarId: searchParams.get("calendarId"),
  };
}

export function BiasTool() {
  const searchParams = useSearchParams();
  const prefill = readPrefill(searchParams);
  const autofillApplied = useRef(Boolean(prefill.eventId || prefill.calendarId || prefill.inputs.forecast));

  const [eventId, setEventId] = useState<NewsEventId | null>(prefill.eventId);
  const [pairId, setPairId] = useState<PairId | null>(null);
  const [outcome, setOutcome] = useState<SurpriseSign | null>(null);
  const [inputs, setInputs] = useState<ReleaseInputValues>(prefill.inputs);
  const [editingStep, setEditingStep] = useState<StepKey | null>(null);
  const [pairQuery, setPairQuery] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [dataMode, setDataMode] = useState<DataMode>(prefill.mode ?? "manual");
  const [calendarId, setCalendarId] = useState<string | null>(prefill.calendarId);

  const forecast = parseNumber(inputs.forecast);
  const previous = parseNumber(inputs.previous);
  const actual = parseNumber(inputs.actual);

  const live = useLiveNews(calendarId, dataMode, Boolean(calendarId));

  const analysis = useMemo(
    () =>
      buildAnalysis({ eventId, pairId, outcome, forecast, previous, actual }),
    [eventId, pairId, outcome, forecast, previous, actual],
  );

  const effectiveSign = analysis?.surprise.sign ?? outcome;
  const nextStep: StepKey | null = !eventId
    ? "news"
    : !pairId
      ? "pair"
      : effectiveSign === null
        ? "outcome"
        : null;
  const activeStep = editingStep ?? nextStep;

  const pairSections = useMemo(() => getPairSections(pairQuery), [pairQuery]);
  const recentGroups = useMemo(() => groupRecent(history), [history]);

  useEffect(() => {
    setHistory(loadHistory());
    if (!prefill.mode) setDataMode(loadDataMode());
    else saveDataMode(prefill.mode);
  }, [prefill.mode]);

  /** Re-apply auto-fill if the query string changes after mount. */
  useEffect(() => {
    const next = readPrefill(searchParams);
    const hasAutofill =
      next.eventId ||
      next.calendarId ||
      next.inputs.forecast ||
      next.inputs.previous ||
      next.inputs.actual;
    if (!hasAutofill || autofillApplied.current) return;
    autofillApplied.current = true;
    if (next.eventId) setEventId(next.eventId);
    setInputs(next.inputs);
    if (next.mode) setDataMode(saveDataMode(next.mode));
    if (next.calendarId) setCalendarId(next.calendarId);
  }, [searchParams]);

  /** Live mode: push API actual into the release inputs when available. */
  useEffect(() => {
    if (dataMode !== "live") return;
    if (live.actual === null) return;
    setInputs((prev) => {
      const next = String(live.actual);
      if (prev.actual === next) return prev;
      return { ...prev, actual: next };
    });
  }, [dataMode, live.actual]);

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
    setPairQuery("");
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

  const cancelEditing = useCallback(() => setEditingStep(null), []);

  const reset = useCallback(() => {
    setEventId(null);
    setPairId(null);
    setOutcome(null);
    setInputs(EMPTY_INPUTS);
    setEditingStep(null);
    setPairQuery("");
    setCalendarId(null);
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

  const clearAllHistory = useCallback(
    () => setHistory(clearHistory()),
    [],
  );

  const onDataModeChange = useCallback((mode: DataMode) => {
    setDataMode(saveDataMode(mode));
  }, []);

  const chips = useMemo(
    () =>
      buildChips({
        eventId,
        pairId,
        sign: effectiveSign,
        activeStep,
        onEdit: setEditingStep,
      }),
    [eventId, pairId, effectiveSign, activeStep],
  );

  const showRecent = analysis === null && recentGroups.length > 0;
  const hasPrefill =
    inputs.forecast !== "" ||
    inputs.previous !== "" ||
    inputs.actual !== "" ||
    calendarId !== null;

  return (
    <div className="space-y-5">
      <NewsSummary chips={chips} analysis={analysis} />

      {activeStep === "news" ? (
        <StepPicker
          step={STEP_COPY.news.step}
          title={STEP_COPY.news.title}
          sections={NEWS_SECTIONS}
          value={eventId}
          onChange={chooseEvent}
          onCancel={editingStep ? cancelEditing : undefined}
          header={
            <QuickPresets
              options={newsPresetOptions}
              value={eventId}
              onSelect={chooseEvent}
            />
          }
        />
      ) : null}

      {activeStep === "pair" ? (
        <StepPicker
          step={STEP_COPY.pair.step}
          title={STEP_COPY.pair.title}
          sections={pairSections}
          value={pairId}
          onChange={choosePair}
          columns={2}
          onCancel={editingStep ? cancelEditing : undefined}
          header={
            <SearchField
              value={pairQuery}
              onChange={setPairQuery}
              onArrowDown={() =>
                focusFirstOption(
                  document.querySelector<HTMLElement>("[data-nb-options]"),
                )
              }
              onCancel={() => (pairQuery ? setPairQuery("") : cancelEditing())}
            />
          }
        />
      ) : null}

      {activeStep === "outcome" ? (
        <OutcomeButtons
          value={effectiveSign}
          onChange={chooseOutcome}
          onCancel={editingStep ? cancelEditing : undefined}
        />
      ) : null}

      {analysis ? <ResultCard analysis={analysis} onReset={reset} /> : null}

      {showRecent ? (
        <RecentAnalyses groups={recentGroups} onOpen={openEntry} />
      ) : null}

      {analysis || history.length > 0 || hasPrefill ? (
        <Disclosure title={DETAILS_COPY.toggle} defaultOpen={hasPrefill && !analysis}>
          {() => (
            <>
              <div className="mb-5">
                <DataModeToggle value={dataMode} onChange={onDataModeChange} />
                {dataMode === "live" && live.unavailable ? (
                  <p className="mt-2 text-xs text-nb-down">
                    Live data is temporarily unavailable.
                  </p>
                ) : null}
              </div>
              <DetailsPanel
                analysis={analysis}
                inputs={inputs}
                onInputsChange={setInputs}
                history={history}
                onOpenEntry={openEntry}
                onClearHistory={clearAllHistory}
                actualReadOnly={dataMode === "live" && live.actual !== null}
              />
            </>
          )}
        </Disclosure>
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
