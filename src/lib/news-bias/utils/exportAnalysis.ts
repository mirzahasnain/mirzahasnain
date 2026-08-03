import { EXPORT_COPY } from "../constants";
import type { Analysis, ShareResult } from "../types/interfaces";
import { buildAnalysisFields, buildExportText } from "./analysisGenerator";
import { writeToClipboard } from "./clipboard";
import { downloadBlob } from "./download";
import { createTextPdf, type PdfTextLine } from "./pdf";

const TXT_MIME = "text/plain;charset=utf-8";
const TITLE_SIZE = 18;
const FIELD_GAP = 7;

export async function copyAnalysis(analysis: Analysis): Promise<boolean> {
  return writeToClipboard(buildExportText(analysis));
}

export function downloadAnalysisTxt(analysis: Analysis): boolean {
  const blob = new Blob([buildExportText(analysis)], { type: TXT_MIME });
  return downloadBlob(blob, buildFileName(analysis, "txt"));
}

export function downloadAnalysisPdf(analysis: Analysis): boolean {
  return downloadBlob(
    createTextPdf(buildPdfLines(analysis)),
    buildFileName(analysis, "pdf"),
  );
}

export async function shareAnalysis(analysis: Analysis): Promise<ShareResult> {
  const text = buildExportText(analysis);

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

  return lines;
}

export function buildFileName(analysis: Analysis, extension: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `${EXPORT_COPY.fileBaseName}-${analysis.pair.label}-${date}.${extension}`;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}
