import type { AiTradePlaybook } from "../modules/playbook/types";
import { writeToClipboard } from "./clipboard";
import { downloadBlob } from "./download";
import { createTextPdf, type PdfTextLine } from "./pdf";

const TXT_MIME = "text/plain;charset=utf-8";

export function buildPlaybookExportText(playbook: AiTradePlaybook): string {
  const lines: string[] = [
    "AI Trade Playbook",
    "",
    "Trade Setup",
    `Asset: ${playbook.setup.asset} (${playbook.setup.pairId})`,
    `Bias: ${playbook.setup.bias}`,
    `Confidence: ${playbook.setup.confidence}%`,
    `Risk: ${playbook.setup.risk}`,
    "",
    "Trading Plan",
    ...playbook.plan.map((p) => `${p.title}: ${p.action}`),
    "",
    "Entry Strategy",
    ...playbook.entries.map((e) => `${e.label}: ${e.explanation}`),
    "",
    "Risk Management",
    ...playbook.risk.options.map(
      (o) =>
        `${o.label}${o.id === playbook.risk.recommendedId ? " (recommended)" : ""}`,
    ),
    playbook.risk.positionSizingReminder,
    "",
    "Take Profit",
    ...playbook.takeProfit.levels.map((l) => `${l.label}: ${l.placeholder}`),
    `${playbook.takeProfit.trailStop.label}: ${playbook.takeProfit.trailStop.placeholder}`,
    "",
    "Stop Loss Guide",
    ...playbook.stopLoss.placements.map((p) => `${p.label}: ${p.hint}`),
    playbook.stopLoss.note,
    "",
    playbook.volatility.title,
    playbook.volatility.label,
  ];

  if (playbook.fakeSpike) {
    lines.push(
      "",
      playbook.fakeSpike.title,
      playbook.fakeSpike.message,
      playbook.fakeSpike.hint,
    );
  }

  if (playbook.historical) {
    lines.push(
      "",
      "Historical Behaviour",
      `Previous ${playbook.historical.total} similar releases`,
      playbook.historical.summaryLine,
      playbook.historical.averageMoveLabel,
    );
  }

  lines.push("", "AI Notes", ...playbook.aiNotes);
  return `${lines.join("\n")}\n`;
}

export async function copyPlaybook(playbook: AiTradePlaybook): Promise<boolean> {
  return writeToClipboard(buildPlaybookExportText(playbook));
}

export function downloadPlaybookTxt(playbook: AiTradePlaybook): boolean {
  const blob = new Blob([buildPlaybookExportText(playbook)], { type: TXT_MIME });
  return downloadBlob(blob, playbookFileName(playbook, "txt"));
}

export function downloadPlaybookPdf(playbook: AiTradePlaybook): boolean {
  const lines: PdfTextLine[] = [
    { text: "AI Trade Playbook", size: 18, bold: true },
  ];
  for (const block of buildPlaybookExportText(playbook).split("\n\n")) {
    const [title, ...rest] = block.split("\n");
    if (!title) continue;
    lines.push({ text: title, bold: true, spaceBefore: 7 });
    for (const row of rest) {
      if (row) lines.push({ text: row });
    }
  }
  return downloadBlob(createTextPdf(lines), playbookFileName(playbook, "pdf"));
}

export async function sharePlaybook(
  playbook: AiTradePlaybook,
): Promise<"shared" | "copied" | "dismissed" | "failed"> {
  const text = playbook.shareSummary;
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title: "Trade Setup", text });
      return "shared";
    } catch (error) {
      if (
        error instanceof DOMException &&
        (error.name === "AbortError" || error.name === "NotAllowedError")
      ) {
        return "dismissed";
      }
    }
  }
  return (await writeToClipboard(text)) ? "copied" : "failed";
}

function playbookFileName(playbook: AiTradePlaybook, ext: string): string {
  const stamp = new Date().toISOString().slice(0, 10);
  return `trade-playbook-${playbook.setup.pairId}-${stamp}.${ext}`;
}
