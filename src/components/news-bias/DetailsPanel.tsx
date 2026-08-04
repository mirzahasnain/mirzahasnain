"use client";

import { Trash2 } from "lucide-react";
import { AffectedAssetsGrid } from "@/components/news-bias/AffectedAssetsGrid";
import { DetailsSection } from "@/components/news-bias/DetailsSection";
import { ExportActions } from "@/components/news-bias/ExportActions";
import { FullAnalysis } from "@/components/news-bias/FullAnalysis";
import { HistoryList } from "@/components/news-bias/HistoryList";
import { ReleaseInputs } from "@/components/news-bias/ReleaseInputs";
import type { ReleaseInputValues } from "@/components/news-bias/ReleaseInputs";
import { SurpriseBreakdown } from "@/components/news-bias/SurpriseBreakdown";
import { DETAILS_COPY } from "@/lib/news-bias/constants";
import type { Analysis, HistoryEntry } from "@/lib/news-bias/types/interfaces";

interface DetailsPanelProps {
  analysis: Analysis | null;
  inputs: ReleaseInputValues;
  onInputsChange: (values: ReleaseInputValues) => void;
  history: HistoryEntry[];
  onOpenEntry: (entry: HistoryEntry) => void;
  onClearHistory: () => void;
  /** When live mode has pushed an actual, lock the field. */
  actualReadOnly?: boolean;
}

/**
 * Everything past the decision itself. Loaded on demand, so the export and PDF
 * code never reaches a trader who only wants the call.
 */
export function DetailsPanel({
  analysis,
  inputs,
  onInputsChange,
  history,
  onOpenEntry,
  onClearHistory,
  actualReadOnly = false,
}: DetailsPanelProps) {
  return (
    <>
      {analysis ? (
        <>
          <DetailsSection
            title={DETAILS_COPY.values.title}
            hint={DETAILS_COPY.values.hint}
          >
            <ReleaseInputs
              values={inputs}
              onChange={onInputsChange}
              actualReadOnly={actualReadOnly}
            />
          </DetailsSection>

          <DetailsSection title={DETAILS_COPY.breakdown.title}>
            <SurpriseBreakdown analysis={analysis} />
          </DetailsSection>

          <DetailsSection title={DETAILS_COPY.analysis.title}>
            <FullAnalysis lines={analysis.analysisLines} />
          </DetailsSection>

          <DetailsSection title={DETAILS_COPY.assets.title}>
            <AffectedAssetsGrid assets={analysis.affectedAssets} />
          </DetailsSection>

          <DetailsSection title={DETAILS_COPY.exports.title}>
            <ExportActions analysis={analysis} />
          </DetailsSection>
        </>
      ) : null}

      {history.length > 0 ? (
        <DetailsSection
          title={DETAILS_COPY.history.title}
          hint={DETAILS_COPY.history.hint}
          action={
            <button
              type="button"
              onClick={onClearHistory}
              className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-nb-border px-4 text-xs font-semibold text-nb-muted hover:border-nb-border-strong hover:text-nb-text focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70"
            >
              <Trash2 aria-hidden className="size-3.5" />
              {DETAILS_COPY.history.clear}
            </button>
          }
        >
          <HistoryList entries={history} onOpen={onOpenEntry} />
        </DetailsSection>
      ) : null}
    </>
  );
}
