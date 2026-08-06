import type {
  ChecklistItem,
  ImpactMeterLevel,
  LiquidityLevel,
  SessionId,
  SessionStatus,
  VolatilityBand,
  VolatilityReading,
} from "../types";
import type { ExpectedImpact } from "../../types/interfaces";

/** FX session windows in UTC hours (inclusive start, exclusive end). */
const SESSIONS: {
  id: SessionId;
  label: string;
  start: number;
  end: number;
  liquidity: LiquidityLevel;
  description: string;
}[] = [
  {
    id: "asian",
    label: "Asian",
    start: 0,
    end: 7,
    liquidity: "medium",
    description: "Tokyo-led liquidity. News spikes can fade into London.",
  },
  {
    id: "london",
    label: "London",
    start: 7,
    end: 12,
    liquidity: "high",
    description: "Primary European flow. Spreads typically tighten.",
  },
  {
    id: "overlap",
    label: "London / New York Overlap",
    start: 12,
    end: 16,
    liquidity: "very-high",
    description: "Peak liquidity window — best for high-impact releases.",
  },
  {
    id: "newyork",
    label: "New York",
    start: 16,
    end: 21,
    liquidity: "high",
    description: "US cash session. USD prints often dominate.",
  },
];

export function getSessionStatus(now = new Date()): SessionStatus {
  const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60;
  const hit = SESSIONS.find((s) => utcHour >= s.start && utcHour < s.end);
  if (hit) {
    return {
      session: hit.id,
      label: hit.label,
      liquidity: hit.liquidity,
      description: hit.description,
      utcHour: now.getUTCHours(),
    };
  }
  return {
    session: "off",
    label: "Off-hours",
    liquidity: "low",
    description: "Thin liquidity. Widen risk assumptions.",
    utcHour: now.getUTCHours(),
  };
}

const IMPACT_SCORE: Record<ImpactMeterLevel, number> = {
  "very-low": 15,
  low: 30,
  medium: 50,
  high: 75,
  extreme: 95,
};

export function toImpactMeterLevel(
  impact: ExpectedImpact | null | undefined,
): ImpactMeterLevel {
  switch (impact) {
    case "very-low":
      return "very-low";
    case "low":
      return "low";
    case "medium":
      return "medium";
    case "high":
      return "high";
    case "very-high":
      return "extreme";
    default:
      return "medium";
  }
}

export function estimateVolatility(input: {
  impact: ImpactMeterLevel;
  minutesToRelease: number | null;
  isReleased: boolean;
  session: SessionStatus;
}): VolatilityReading {
  const base = IMPACT_SCORE[input.impact];
  const sessionBoost =
    input.session.liquidity === "very-high"
      ? 10
      : input.session.liquidity === "high"
        ? 5
        : input.session.liquidity === "low"
          ? -10
          : 0;

  let currentScore = 35 + sessionBoost;
  let expectedScore = base + sessionBoost;
  const postScore = base + 15 + sessionBoost;

  if (input.minutesToRelease !== null && input.minutesToRelease <= 30) {
    currentScore += 20;
    expectedScore += 10;
  }
  if (input.isReleased) {
    currentScore = postScore;
    expectedScore = base;
  }

  return {
    current: bandFromScore(currentScore),
    expected: bandFromScore(expectedScore),
    postNews: bandFromScore(postScore),
    score: Math.max(0, Math.min(100, Math.round(expectedScore))),
  };
}

function bandFromScore(score: number): VolatilityBand {
  if (score >= 85) return "extreme";
  if (score >= 65) return "elevated";
  if (score >= 40) return "moderate";
  return "low";
}

export function buildNewsChecklist(input: {
  session: SessionStatus;
  impact: ImpactMeterLevel;
  isHighImpact: boolean;
  minutesToRelease: number | null;
}): ChecklistItem[] {
  const nearRelease =
    input.minutesToRelease !== null && input.minutesToRelease <= 5;
  const liquid =
    input.session.liquidity === "high" ||
    input.session.liquidity === "very-high";

  return [
    {
      id: "spread",
      label: "Spread",
      ok: liquid,
      hint: liquid
        ? "Session liquidity supports tighter spreads."
        : "Spreads may widen — size down.",
    },
    {
      id: "slippage",
      label: "Slippage Risk",
      ok: !nearRelease || liquid,
      hint: nearRelease
        ? "Slippage risk spikes into the print."
        : "Slippage risk is manageable.",
    },
    {
      id: "session",
      label: "Session",
      ok: liquid,
      hint: `${input.session.label} — ${input.session.liquidity} liquidity.`,
    },
    {
      id: "high-impact",
      label: "High Impact",
      ok: input.isHighImpact,
      hint: input.isHighImpact
        ? "Release is marked high impact."
        : "Not a top-tier impact event.",
    },
    {
      id: "fake-spike",
      label: "Fake Spike Warning",
      ok: true,
      hint: "Assume a two-sided spike before trend selection.",
    },
    {
      id: "liquidity",
      label: "Liquidity Risk",
      ok: liquid,
      hint: liquid
        ? "Liquidity looks adequate for the plan."
        : "Liquidity risk elevated — wait for overlap if possible.",
    },
  ];
}

export const IMPACT_METER_LABELS: Record<ImpactMeterLevel, string> = {
  "very-low": "Very Low",
  low: "Low",
  medium: "Medium",
  high: "High",
  extreme: "Extreme",
};

export const VOLATILITY_LABELS: Record<VolatilityBand, string> = {
  low: "Low",
  moderate: "Moderate",
  elevated: "Elevated",
  extreme: "Extreme",
};

export { buildMiniChart } from "./miniCharts";
