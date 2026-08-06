import {
  DIRECTION_LABELS,
  EXPORT_COPY,
  IMPACT_LABELS,
  OUTCOME_LABELS,
  STRENGTH_LABELS,
} from "../constants";
import type {
  Analysis,
  AnalysisContext,
  AnalysisField,
  Direction,
  SurpriseStrength,
} from "../types/interfaces";
import { formatConfidence } from "./calculateConfidence";
import { formatNumber, formatSurprise } from "./calculateSurprise";
import { getAssetsByDirection } from "./marketLogic";

/** How many peer markets to name in the cross-market sentence. */
const NAMED_ASSETS = 2;

const SIZE_QUALIFIER: Record<SurpriseStrength, string> = {
  neutral: "",
  weak: "slightly ",
  moderate: "",
  strong: "well ",
  extreme: "far ",
};

const BEAT_VERB: Record<SurpriseStrength, string> = {
  neutral: "matched",
  weak: "edged past",
  moderate: "exceeded",
  strong: "significantly exceeded",
  extreme: "dramatically exceeded",
};

const MISS_VERB: Record<SurpriseStrength, string> = {
  neutral: "matched",
  weak: "slipped under",
  moderate: "missed",
  strong: "significantly missed",
  extreme: "dramatically missed",
};

const SIGNIFICANCE: Record<SurpriseStrength, string> = {
  neutral: "the surprise is too small to separate from noise",
  weak: "the surprise is small",
  moderate: "the surprise is meaningful",
  strong: "the surprise is statistically significant",
  extreme: "the surprise is exceptionally large",
};

const ESTIMATED_SIGNIFICANCE =
  "the size of the surprise has not been entered yet";

const DOLLAR_CLAUSE: Record<Direction, string> = {
  bullish: "strengthening USD",
  bearish: "weakening USD",
  neutral: "leaving USD unchanged",
};

const PRESSURE_CLAUSE: Record<Direction, string> = {
  bullish: "bullish momentum in",
  bearish: "bearish pressure on",
  neutral: "no clear direction for",
};

export function buildReason(context: AnalysisContext): string {
  const { event, pair, surprise, usdDirection, pairDirection, action } = context;

  if (action === "wait") {
    if (surprise.sign === "flat") {
      return `${event.label} matched the forecast, so there is no edge to trade on ${pair.displayName}.`;
    }
    return `A surprise of ${formatSurprise(surprise.value ?? 0)} sits inside the neutral band, so waiting for a clearer signal on ${pair.displayName} is preferred.`;
  }

  const verb = surprise.isEstimate
    ? surprise.sign === "positive"
      ? "came in above"
      : "came in below"
    : surprise.sign === "positive"
      ? BEAT_VERB[surprise.strength]
      : MISS_VERB[surprise.strength];

  return `Actual ${event.label} ${verb} the forecast, ${DOLLAR_CLAUSE[usdDirection]} and creating ${PRESSURE_CLAUSE[pairDirection]} ${pair.displayName}.`;
}

export function buildAnalysisLines(context: AnalysisContext): string[] {
  const { event, surprise } = context;
  const lines = [buildHeadline(context)];

  lines.push(
    surprise.sign === "flat"
      ? "With the actual matching the forecast, this release gives the US Dollar no clear direction."
      : event.dollarEffect[surprise.sign],
  );

  const previousLine = buildPreviousLine(context);
  if (previousLine) lines.push(previousLine);

  lines.push(buildCrossMarketLine(context));

  const significance = surprise.isEstimate
    ? ESTIMATED_SIGNIFICANCE
    : SIGNIFICANCE[surprise.strength];
  lines.push(
    `Confidence is ${IMPACT_LABELS[surprise.impact]} at ${formatConfidence(surprise.confidence)} because ${significance}.`,
  );

  return lines;
}

function buildHeadline(context: AnalysisContext): string {
  const { event, values, surprise } = context;

  if (surprise.sign === "flat") {
    return `${event.label} came in exactly in line with expectations.`;
  }

  const side = surprise.sign === "positive" ? "above" : "below";

  if (!values) {
    return `${event.label} came in ${side} expectations.`;
  }

  if (surprise.strength === "neutral") {
    return `${event.label} came in broadly in line with expectations at ${formatNumber(values.actual)} against a forecast of ${formatNumber(values.forecast)}.`;
  }

  return `${event.label} came in ${SIZE_QUALIFIER[surprise.strength]}${side} expectations at ${formatNumber(values.actual)} against a forecast of ${formatNumber(values.forecast)}.`;
}

function buildPreviousLine(context: AnalysisContext): string | null {
  const { values, event } = context;
  if (!values || values.previous === null) return null;

  const change = values.actual - values.previous;
  const previous = formatNumber(values.previous);

  if (change === 0) {
    return `${event.label} was unchanged from the previous reading of ${previous}.`;
  }

  const move = change > 0 ? "up from" : "down from";
  return `That is ${move} the previous reading of ${previous}.`;
}

function buildCrossMarketLine(context: AnalysisContext): string {
  const { affectedAssets, usdDirection } = context;

  if (usdDirection === "neutral") {
    return "With no surprise to trade, the wider market takes no lead from this release.";
  }

  const pressured = nameAssets(context, "bearish");
  const supported = nameAssets(context, "bullish");

  if (!pressured || !supported) {
    return `The move runs across ${affectedAssets.length} tracked markets.`;
  }

  return `Historically this creates bearish pressure on ${pressured} while supporting ${supported}.`;
}

/** Names a couple of markets on one side, leading with the selected pair. */
function nameAssets(context: AnalysisContext, direction: Direction): string {
  const assets = getAssetsByDirection(context.affectedAssets, direction);
  const ordered = [
    ...assets.filter((asset) => asset.isSelected),
    ...assets.filter((asset) => !asset.isSelected),
  ].slice(0, NAMED_ASSETS);

  return joinWithAnd(ordered.map((asset) => asset.name));
}

function joinWithAnd(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export function buildAnalysisFields(analysis: Analysis): AnalysisField[] {
  const { fields } = EXPORT_COPY;
  const { event, pair, values, surprise, pairDirection } = analysis;

  const rows: AnalysisField[] = [
    { label: fields.news, value: event.label },
    { label: fields.pair, value: pair.label },
    { label: fields.result, value: OUTCOME_LABELS[surprise.sign] },
  ];

  if (values) {
    rows.push({ label: fields.forecast, value: formatNumber(values.forecast) });
    if (values.previous !== null) {
      rows.push({
        label: fields.previous,
        value: formatNumber(values.previous),
      });
    }
    rows.push({ label: fields.actual, value: formatNumber(values.actual) });
  }

  if (surprise.value !== null) {
    rows.push({
      label: fields.surprise,
      value: formatSurprise(surprise.value),
    });
  }

  if (surprise.percentage !== null) {
    rows.push({
      label: "% Surprise",
      value: `${surprise.percentage > 0 ? "+" : ""}${surprise.percentage}%`,
    });
  }

  rows.push(
    { label: fields.strength, value: STRENGTH_LABELS[surprise.strength] },
    { label: fields.impact, value: IMPACT_LABELS[surprise.impact] },
    { label: fields.bias, value: DIRECTION_LABELS[pairDirection] },
    { label: fields.recommendation, value: analysis.summary.recommendation },
    {
      label: fields.confidence,
      value: formatConfidence(analysis.summary.confidence),
    },
    { label: fields.reason, value: analysis.reason },
  );

  if (analysis.playbook.expectedMove) {
    rows.push({
      label: "Expected Move",
      value: analysis.playbook.expectedMove.label,
    });
  }

  rows.push(
    { label: "Risk Warning", value: analysis.riskWarning },
    { label: fields.analysis, value: analysis.analysisLines.join("\n") },
  );

  return rows;
}

/** Plain-text payload shared by copy, TXT download and share. */
export function buildExportText(analysis: Analysis): string {
  const body = buildAnalysisFields(analysis)
    .map((field) => `${field.label}:\n${field.value}`)
    .join("\n\n");

  return `${EXPORT_COPY.documentTitle}\n\n${body}\n`;
}
