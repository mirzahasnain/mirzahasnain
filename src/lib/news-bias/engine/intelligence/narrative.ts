import narrativeJson from "./data/narrativeTemplates.json";
import type { Direction } from "../../types/interfaces";

interface NarrativeConfig {
  templates: Record<string, string>;
}

const CONFIG = narrativeJson as NarrativeConfig;

export function buildIntelligenceNarrative(input: {
  newsLabel: string;
  surpriseSign: "positive" | "negative" | "flat";
  isEstimate: boolean;
  usdDirection: Direction;
  assetLabel: string;
  pairDirection: Direction;
  winRatePct: number | null;
  confidenceScore: number;
}): string[] {
  const t = CONFIG.templates;
  const lines: string[] = [];

  if (input.isEstimate) {
    lines.push(fill(t.estimate, { news: input.newsLabel }));
  } else if (input.surpriseSign === "positive") {
    lines.push(fill(t.exceeded, { news: input.newsLabel }));
  } else if (input.surpriseSign === "negative") {
    lines.push(fill(t.missed, { news: input.newsLabel }));
  } else {
    lines.push(fill(t.inline, { news: input.newsLabel }));
  }

  if (input.usdDirection === "bullish") lines.push(t.usdStrong);
  else if (input.usdDirection === "bearish") lines.push(t.usdWeak);
  else lines.push(t.usdFlat);

  if (input.winRatePct !== null) {
    const direction =
      input.pairDirection === "bearish"
        ? "lower"
        : input.pairDirection === "bullish"
          ? "higher"
          : "sideways";
    lines.push(
      fill(t.histAsset, {
        asset: input.assetLabel,
        direction,
        pct: String(Math.round(input.winRatePct)),
      }),
    );
  }

  if (input.confidenceScore >= 75) lines.push(t.confidenceHigh);
  else if (input.confidenceScore >= 50) lines.push(t.confidenceMedium);
  else lines.push(t.confidenceLow);

  return lines;
}

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}
