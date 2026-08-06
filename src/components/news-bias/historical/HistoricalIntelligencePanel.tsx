"use client";

import dynamic from "next/dynamic";
import { HistoricalAverageMovePanel } from "@/components/news-bias/historical/HistoricalAverageMovePanel";
import { HistoricalMatchCard } from "@/components/news-bias/historical/HistoricalMatchCard";
import { HistoricalProbabilityPanel } from "@/components/news-bias/historical/HistoricalProbabilityPanel";
import { HistoricalTimeline } from "@/components/news-bias/historical/HistoricalTimeline";
import { DetailsSection } from "@/components/news-bias/DetailsSection";
import { DETAILS_COPY } from "@/lib/news-bias/constants";
import type { HistoricalIntelligenceView } from "@/lib/news-bias/types/interfaces";

const HistoricalChart = dynamic(
  () =>
    import("@/components/news-bias/historical/HistoricalChart").then(
      (mod) => mod.HistoricalChart,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-40 animate-pulse rounded-xl bg-nb-elevated" aria-hidden />
    ),
  },
);

interface HistoricalIntelligencePanelProps {
  intel: HistoricalIntelligenceView;
}

/**
 * Version 8 historical intelligence block — dropped into More details.
 * Keeps the existing section pattern; no page redesign.
 */
export function HistoricalIntelligencePanel({
  intel,
}: HistoricalIntelligencePanelProps) {
  return (
    <>
      <DetailsSection title={DETAILS_COPY.historicalMatch.title}>
        <HistoricalMatchCard intel={intel} />
      </DetailsSection>

      <DetailsSection title={DETAILS_COPY.probability.title}>
        <HistoricalProbabilityPanel intel={intel} />
      </DetailsSection>

      <DetailsSection title={DETAILS_COPY.averageMove.title}>
        <HistoricalAverageMovePanel intel={intel} />
      </DetailsSection>

      <DetailsSection title={DETAILS_COPY.timeline.title}>
        <HistoricalTimeline intel={intel} />
      </DetailsSection>

      <DetailsSection title={DETAILS_COPY.chart.title}>
        <HistoricalChart intel={intel} />
      </DetailsSection>
    </>
  );
}
