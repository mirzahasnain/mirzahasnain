"use client";

import {
  Check,
  Copy,
  FileDown,
  FileText,
  Share2,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  EXPORT_FEEDBACK,
  EXPORT_LABELS,
  FEEDBACK_MS,
} from "@/lib/news-bias/constants";
import type { Analysis, ExportAction } from "@/lib/news-bias/types/interfaces";
import {
  copyAnalysis,
  downloadAnalysisPdf,
  downloadAnalysisTxt,
  shareAnalysis,
} from "@/lib/news-bias/utils/exportAnalysis";

interface ExportActionsProps {
  analysis: Analysis;
}

interface Feedback {
  action: ExportAction;
  label: string;
  failed: boolean;
}

const ICONS: Record<ExportAction, LucideIcon> = {
  copy: Copy,
  txt: FileText,
  pdf: FileDown,
  share: Share2,
};

const ORDER: ExportAction[] = ["copy", "txt", "pdf", "share"];

export function ExportActions({ analysis }: ExportActionsProps) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const signature = [
    analysis.event.id,
    analysis.pair.id,
    analysis.surprise.sign,
    analysis.surprise.value,
    analysis.values?.forecast,
    analysis.values?.previous,
    analysis.values?.actual,
  ].join("|");

  useEffect(() => {
    setFeedback(null);
  }, [signature]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleClick = async (action: ExportAction) => {
    const result = await runExport(action, analysis);
    if (!result) return;

    setFeedback({ action, label: result.label, failed: result.failed });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setFeedback(null), FEEDBACK_MS);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {ORDER.map((action) => {
        const active = feedback?.action === action ? feedback : null;
        const Icon = active
          ? active.failed
            ? TriangleAlert
            : Check
          : ICONS[action];

        return (
          <button
            key={action}
            type="button"
            onClick={() => handleClick(action)}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3.5 text-xs font-bold uppercase tracking-[0.1em] focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70 ${activeClass(active)}`}
          >
            <Icon aria-hidden className="size-4 shrink-0" />
            <span className="truncate">{active?.label ?? EXPORT_LABELS[action]}</span>
          </button>
        );
      })}
    </div>
  );
}

function activeClass(active: Feedback | null): string {
  if (!active) {
    return "border-nb-accent/40 bg-nb-accent/10 text-nb-accent hover:bg-nb-accent/15";
  }
  return active.failed
    ? "border-nb-down/50 bg-nb-down/10 text-nb-down"
    : "border-nb-up/50 bg-nb-up/10 text-nb-up";
}

async function runExport(
  action: ExportAction,
  analysis: Analysis,
): Promise<{ label: string; failed: boolean } | null> {
  switch (action) {
    case "copy":
      return toFeedback(await copyAnalysis(analysis), EXPORT_FEEDBACK.copy);
    case "txt":
      return toFeedback(downloadAnalysisTxt(analysis), EXPORT_FEEDBACK.txt);
    case "pdf":
      return toFeedback(downloadAnalysisPdf(analysis), EXPORT_FEEDBACK.pdf);
    case "share": {
      const result = await shareAnalysis(analysis);
      if (result === "dismissed") return null;
      if (result === "failed") return toFeedback(false, EXPORT_FEEDBACK.share);
      return toFeedback(
        true,
        result === "shared" ? EXPORT_FEEDBACK.share : EXPORT_FEEDBACK.copy,
      );
    }
  }
}

function toFeedback(
  succeeded: boolean,
  label: string,
): { label: string; failed: boolean } {
  return succeeded
    ? { label, failed: false }
    : { label: EXPORT_FEEDBACK.failed, failed: true };
}
