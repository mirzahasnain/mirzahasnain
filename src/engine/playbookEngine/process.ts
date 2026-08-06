import planJson from "./data/tradingPlan.json";
import entriesJson from "./data/entryStrategies.json";
import type { PlaybookInput, PlaybookResult } from "./types";

interface PlanPhase {
  id: string;
  title: string;
  action?: string;
  actionByDirection?: Record<string, string>;
  steps?: string[];
}

interface PlanConfig {
  phases: PlanPhase[];
}

interface EntryItem {
  id: string;
  label: string;
  explanation?: string;
  summary?: string;
}

interface EntryConfig {
  strategies: EntryItem[];
}

const PLAN = planJson as PlanConfig;
const ENTRIES = entriesJson as EntryConfig;

function phaseSteps(phase: PlanPhase, direction: "buy" | "sell" | "wait"): string[] {
  if (phase.steps?.length) return phase.steps;
  if (phase.actionByDirection) {
    return [phase.actionByDirection[direction] ?? phase.actionByDirection.wait];
  }
  if (phase.action) return [phase.action];
  return [];
}

function mapPhaseId(id: string): "before" | "during" | "after" {
  if (id === "before") return "before";
  if (id === "release" || id === "during") return "during";
  return "after";
}

export function processPlaybook(input: PlaybookInput): PlaybookResult {
  const avoid = input.decisionId === "avoid";
  const wait = input.decisionId === "wait" || avoid;
  const direction: "buy" | "sell" | "wait" = input.decisionId.includes("buy")
    ? "buy"
    : input.decisionId.includes("sell")
      ? "sell"
      : "wait";

  const phases = PLAN.phases.map((phase) => ({
    id: mapPhaseId(phase.id),
    title: phase.title,
    steps: phaseSteps(phase, wait ? "wait" : direction),
  }));

  const entries = avoid
    ? []
    : ENTRIES.strategies
        .filter((e) => {
          if (wait) return e.id === "conservative";
          // MVP brain: Aggressive + Conservative only (Architecture Review cut)
          return e.id === "aggressive" || e.id === "conservative";
        })
        .map((e) => ({
          id: e.id,
          label: e.label,
          summary: e.summary ?? e.explanation ?? "",
        }));

  return {
    setup: {
      asset: input.pairId,
      bias: input.pairDirection,
      decisionId: input.decisionId,
      score: input.score,
      riskLevel: input.riskLevel,
    },
    phases,
    entries,
    risk: {
      suggestedPct: input.suggestedRiskPct,
      maxPct: 2,
      reminder: "Size from stop distance, not conviction.",
    },
    levels: {
      takeProfitGuide: ["TP1 — partial", "TP2 — core", "TP3 — runner / trail"],
      stopLossGuide: [
        "Beyond news spike liquidity",
        "Beyond pre-release range",
        "Prior swing invalidation",
      ],
    },
    fakeSpikeWarning: input.fakeSpikeLikely
      ? "First minutes are noise — wait for confirmation before committing size."
      : null,
    disclaimer:
      "Educational decision support. Not financial advice. " + input.riskWarning,
  };
}
