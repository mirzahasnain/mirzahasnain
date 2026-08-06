import tradingPlanJson from "./data/tradingPlan.json";
import fakeSpikeJson from "./data/fakeSpike.json";
import aiNotesJson from "./data/aiNotes.json";
import phasesJson from "./data/phases.json";
import { buildRiskManagement } from "../risk";
import {
  buildStopLossGuide,
  buildTakeProfitPlan,
  listEntryStrategies,
} from "../strategy";
import { buildVolatilityMeter } from "../volatility";
import { ACTION_LABELS } from "../../constants";
import type { Analysis } from "../../types/interfaces";
import type {
  AiTradePlaybook,
  FakeSpikeWarning,
  PlaybookHistoricalBehaviour,
  PlaybookRiskLevel,
  TradingPlanPhase,
} from "./types";

interface TradingPlanConfig {
  phases: {
    id: "before" | "release" | "confirmation";
    title: string;
    action?: string;
    actionByDirection?: Record<string, string>;
  }[];
}

interface FakeSpikeConfig {
  thresholdProbability: number;
  minSampleSize: number;
  title: string;
  message: string;
  hint: string;
}

interface AiNotesConfig {
  templates: Record<string, string>;
}

interface PhasesConfig {
  default: {
    riskByImpact: Record<string, PlaybookRiskLevel>;
  };
}

const PLAN = tradingPlanJson as TradingPlanConfig;
const FAKE = fakeSpikeJson as FakeSpikeConfig;
const NOTES = aiNotesJson as AiNotesConfig;
const PHASES = phasesJson as PhasesConfig;

const PAIR_TO_HISTORY_KEY: Record<string, string> = {
  XAUUSD: "gold",
  XAGUSD: "silver",
  BTCUSD: "btc",
  ETHUSD: "eth",
  EURUSD: "eurusd",
  GBPUSD: "gbpusd",
  NAS100: "nasdaq",
  US30: "us30",
};

/**
 * Build a complete AI Trade Playbook from an analysis result.
 * All copy and thresholds come from JSON rules.
 */
export function buildAiTradePlaybook(analysis: Analysis): AiTradePlaybook {
  const riskLevel =
    PHASES.default.riskByImpact[analysis.summary.impact] ?? "Medium";

  const setup = {
    asset: analysis.pair.displayName,
    pairId: analysis.pair.id,
    bias: ACTION_LABELS[analysis.action],
    confidence: analysis.summary.confidence,
    risk: riskLevel,
  };

  const plan = buildTradingPlan(analysis.action);
  const historical = buildHistoricalBehaviour(analysis);
  const fakeSpike = buildFakeSpikeWarning(analysis);
  const volatility = buildVolatilityMeter({
    impact: analysis.summary.impact,
    strength: analysis.surprise.strength,
  });
  const aiNotes = buildAiNotes(analysis);
  const shareSummary = buildShareSummary({
    setup,
    plan,
    volatilityLabel: volatility.label,
    historical,
    fakeSpike,
  });

  return {
    setup,
    plan,
    entries: listEntryStrategies(),
    risk: buildRiskManagement({
      impact: analysis.summary.impact,
      riskLevel,
    }),
    takeProfit: buildTakeProfitPlan(),
    stopLoss: buildStopLossGuide(),
    fakeSpike,
    historical,
    volatility,
    aiNotes,
    shareSummary,
  };
}

export function buildTradingPlan(
  action: Analysis["action"],
): TradingPlanPhase[] {
  return PLAN.phases.map((phase) => ({
    id: phase.id,
    title: phase.title,
    action:
      phase.actionByDirection?.[action] ??
      phase.action ??
      phase.actionByDirection?.wait ??
      "",
  }));
}

function buildHistoricalBehaviour(
  analysis: Analysis,
): PlaybookHistoricalBehaviour | null {
  const intel = analysis.historicalIntelligence;
  if (!intel || intel.sampleSize === 0) return null;

  const pairId = analysis.pair.id;
  const assetKey = PAIR_TO_HISTORY_KEY[pairId];
  const asset =
    intel.assets.find((a) => a.key === assetKey) ??
    intel.assets.find((a) => a.key === "gold") ??
    intel.assets[0];
  if (!asset) return null;

  const bearish = analysis.pairDirection === "bearish";
  const withBias = bearish ? asset.down : analysis.pairDirection === "bullish" ? asset.up : Math.max(asset.up, asset.down);
  const total = asset.up + asset.down + asset.flat;
  const sample = Math.min(10, total || intel.sampleSize);
  const moved = Math.min(
    sample,
    Math.round((withBias / Math.max(1, total)) * sample),
  );

  const directionWord =
    analysis.pairDirection === "bearish"
      ? "down"
      : analysis.pairDirection === "bullish"
        ? "up"
        : "sideways";

  return {
    sampleSize: intel.sampleSize,
    assetLabel: asset.label,
    movedWithBias: moved,
    total: sample,
    summaryLine: `${asset.label} moved ${directionWord} ${moved} out of ${sample} times.`,
    averageMove: Math.round(Math.abs(asset.averageAbsMove || asset.averageMove)),
    averageMoveLabel: `Average move ${Math.round(Math.abs(asset.averageAbsMove || asset.averageMove))} ${asset.unit}.`,
    unit: asset.unit,
  };
}

function buildFakeSpikeWarning(
  analysis: Analysis,
): FakeSpikeWarning | null {
  const intel = analysis.historicalIntelligence;
  if (!intel || intel.sampleSize < FAKE.minSampleSize) {
    // Still warn on high-impact extreme surprises from risk language.
    if (
      analysis.summary.impact === "high" ||
      analysis.summary.impact === "very-high"
    ) {
      if (analysis.surprise.strength === "strong" || analysis.surprise.strength === "extreme") {
        return {
          title: FAKE.title,
          message: FAKE.message,
          hint: FAKE.hint,
          probability: 60,
        };
      }
    }
    return null;
  }

  // Mixed tape = higher fake-spike odds (neither side dominates).
  const assetKey = PAIR_TO_HISTORY_KEY[analysis.pair.id];
  const asset =
    intel.assets.find((a) => a.key === assetKey) ?? intel.assets[0];
  if (!asset) return null;

  const dominant = Math.max(asset.bearishProbability, asset.bullishProbability);
  const mixedProbability = 100 - dominant;
  const probability = Math.max(
    mixedProbability,
    analysis.surprise.strength === "extreme" ? 62 : 0,
  );

  if (probability < FAKE.thresholdProbability) return null;

  return {
    title: FAKE.title,
    message: FAKE.message,
    hint: FAKE.hint,
    probability: Math.round(probability),
  };
}

function buildAiNotes(analysis: Analysis): string[] {
  const t = NOTES.templates;
  const notes: string[] = [];

  if (analysis.values) {
    const diff = analysis.values.actual - analysis.values.forecast;
    if (Math.abs(diff) < 1e-9) notes.push(t.inLine);
    else if (diff > 0) notes.push(t.aboveForecast);
    else notes.push(t.belowForecast);
  } else {
    notes.push(t.estimate);
  }

  if (analysis.usdDirection === "bullish") notes.push(t.usdStrengthen);
  else if (analysis.usdDirection === "bearish") notes.push(t.usdWeaken);
  else notes.push(t.usdFlat);

  if (analysis.pair.id === "XAUUSD" || analysis.pair.category === "metal") {
    notes.push(
      analysis.pairDirection === "bearish" ? t.goldSpikeDown : t.goldSpikeUp,
    );
  } else {
    notes.push(t.genericSpike);
  }

  notes.push(
    analysis.summary.confidence >= 70 ? t.confidenceHigh : t.confidenceLow,
  );

  return notes.slice(0, 4);
}

function buildShareSummary(input: {
  setup: AiTradePlaybook["setup"];
  plan: TradingPlanPhase[];
  volatilityLabel: string;
  historical: PlaybookHistoricalBehaviour | null;
  fakeSpike: FakeSpikeWarning | null;
}): string {
  const lines = [
    `Trade Setup · ${input.setup.asset} (${input.setup.pairId})`,
    `Bias ${input.setup.bias} · Confidence ${input.setup.confidence}% · Risk ${input.setup.risk}`,
    `Volatility ${input.volatilityLabel}`,
    ...input.plan.map((p) => `${p.title}: ${p.action}`),
  ];
  if (input.historical) {
    lines.push(input.historical.summaryLine);
    lines.push(input.historical.averageMoveLabel);
  }
  if (input.fakeSpike) {
    lines.push(`${input.fakeSpike.title}: ${input.fakeSpike.message}`);
  }
  return lines.join("\n");
}

export type { AiTradePlaybook } from "./types";
// buildEventPlaybook lives in index.ts — re-export handled there.
