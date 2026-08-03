import { BIAS_LABELS, CONFIDENCE_LABELS, OUTCOME_LABELS } from "./constants";
import type { BiasAnalysis } from "./types";

/** Plain-text payload behind the Copy Analysis button. */
export function buildAnalysisText(analysis: BiasAnalysis): string {
  const fields: [string, string][] = [
    ["News", analysis.event.label],
    ["Pair", analysis.pair.label],
    ["Result", OUTCOME_LABELS[analysis.outcome]],
    ["Bias", BIAS_LABELS[analysis.pairBias]],
    ["Confidence", CONFIDENCE_LABELS[analysis.confidence]],
    ["Reason", analysis.reason],
  ];

  return fields.map(([label, value]) => `${label}:\n${value}`).join("\n\n");
}
