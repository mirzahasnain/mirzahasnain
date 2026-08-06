import { EXPORT_COPY } from "../constants";
import { buildAiTradePlaybook } from "../modules/playbook/buildAiPlaybook";
import type { Analysis, ShareResult } from "../types/interfaces";
import { buildAnalysisFields, buildExportText } from "./analysisGenerator";
import { writeToClipboard } from "./clipboard";
import { downloadBlob } from "./download";
import { buildPlaybookExportText } from "./exportPlaybook";
import { createTextPdf, type PdfTextLine } from "./pdf";

const TXT_MIME = "text/plain;charset=utf-8";
const CSV_MIME = "text/csv;charset=utf-8";
const TITLE_SIZE = 18;
const FIELD_GAP = 7;

export async function copyAnalysis(analysis: Analysis): Promise<boolean> {
  return writeToClipboard(buildFullExportText(analysis));
}

export function downloadAnalysisTxt(analysis: Analysis): boolean {
  const blob = new Blob([buildFullExportText(analysis)], { type: TXT_MIME });
  return downloadBlob(blob, buildFileName(analysis, "txt"));
}

export function downloadAnalysisPdf(analysis: Analysis): boolean {
  return downloadBlob(
    createTextPdf(buildPdfLines(analysis)),
    buildFileName(analysis, "pdf"),
  );
}

export function downloadAnalysisCsv(analysis: Analysis): boolean {
  const blob = new Blob([buildHistoricalCsv(analysis)], { type: CSV_MIME });
  return downloadBlob(blob, buildFileName(analysis, "csv"));
}

export async function shareAnalysis(analysis: Analysis): Promise<ShareResult> {
  const text = buildFullExportText(analysis);

  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title: EXPORT_COPY.documentTitle, text });
      return "shared";
    } catch (error) {
      if (isAbortError(error)) return "dismissed";
    }
  }

  return (await writeToClipboard(text)) ? "copied" : "failed";
}

/** The PDF reuses the same fields as every other export format. */
export function buildPdfLines(analysis: Analysis): PdfTextLine[] {
  const lines: PdfTextLine[] = [
    { text: EXPORT_COPY.documentTitle, size: TITLE_SIZE, bold: true },
  ];

  for (const field of buildAnalysisFields(analysis)) {
    lines.push({ text: field.label, bold: true, spaceBefore: FIELD_GAP });
    for (const value of field.value.split("\n")) {
      lines.push({ text: value });
    }
  }

  const hist = analysis.historicalIntelligence;
  if (hist && hist.summary.length > 0) {
    lines.push({
      text: "Historical Summary",
      bold: true,
      spaceBefore: FIELD_GAP,
    });
    for (const line of hist.summary) {
      lines.push({ text: line });
    }
  }

  return lines;
}

export function buildFullExportText(analysis: Analysis): string {
  const base = buildExportText(analysis);
  const hist = analysis.historicalIntelligence;
  let text = base;

  if (hist && hist.sampleSize > 0) {
    const assetLines = hist.assets
      .map(
        (a) =>
          `${a.label}: ↓${a.down} ↑${a.up} | Bearish ${a.bearishProbability}% | Avg ${Math.abs(a.averageMove)} ${a.unit}`,
      )
      .join("\n");

    text = `${base}\nHistorical Match:\n${hist.sampleSize} similar releases (confidence ${hist.confidenceScore}%)\n\n${hist.summary.join("\n")}\n\nAsset Votes:\n${assetLines}\n`;
  }

  const playbook = buildAiTradePlaybook(analysis);
  return `${text}\n${buildPlaybookExportText(playbook)}`;
}

export function buildHistoricalCsv(analysis: Analysis): string {
  const hist = analysis.historicalIntelligence;
  const header = [
    "date",
    "forecast",
    "actual",
    "previous",
    "surprise",
    "gold_move",
    "silver_move",
    "eurusd_move",
    "gbpusd_move",
    "btc_move",
    "eth_move",
    "nasdaq_move",
    "us30_move",
    "direction",
    "similarity_score",
  ].join(",");

  const rows = (hist?.matches ?? []).map((m) =>
    [
      m.date,
      m.forecast,
      m.actual,
      m.previous,
      m.surprise,
      m.gold_move,
      m.silver_move,
      m.eurusd_move,
      m.gbpusd_move,
      m.btc_move,
      m.eth_move,
      m.nasdaq_move,
      m.us30_move,
      m.direction,
      m.score,
    ].join(","),
  );

  if (rows.length === 0 && hist) {
    return [
      header.replace(",similarity_score", ""),
      ...hist.timeline.map((m) =>
        [
          m.date,
          m.forecast,
          m.actual,
          m.previous,
          m.surprise,
          m.gold_move,
          m.silver_move,
          m.eurusd_move,
          m.gbpusd_move,
          m.btc_move,
          m.eth_move,
          m.nasdaq_move,
          m.us30_move,
          m.direction,
        ].join(","),
      ),
    ].join("\n");
  }

  return [header, ...rows].join("\n");
}

export function buildFileName(analysis: Analysis, extension: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `${EXPORT_COPY.fileBaseName}-${analysis.pair.label}-${date}.${extension}`;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}
