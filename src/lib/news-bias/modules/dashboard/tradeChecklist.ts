import type { ChecklistItem, SessionStatus, VolatilityReading } from "../types";

/**
 * Pre-trade checklist shown before every recommendation.
 * Labels match the TradeImpact workspace brief.
 */
export function buildTradeChecklist(input: {
  session: SessionStatus;
  volatility: VolatilityReading;
  isHighImpact: boolean;
  minutesToRelease: number | null;
  isReleased: boolean;
}): ChecklistItem[] {
  const sessionActive =
    input.session.session !== "off" &&
    (input.session.liquidity === "high" ||
      input.session.liquidity === "very-high" ||
      input.session.liquidity === "medium");

  const volOk =
    input.volatility.expected === "moderate" ||
    input.volatility.expected === "elevated" ||
    input.volatility.expected === "extreme";

  const liquid =
    input.session.liquidity === "high" ||
    input.session.liquidity === "very-high";

  const nearRelease =
    input.minutesToRelease !== null &&
    input.minutesToRelease <= 2 &&
    !input.isReleased;

  return [
    {
      id: "high-impact",
      label: "High Impact News",
      ok: input.isHighImpact,
      hint: input.isHighImpact
        ? "Release is marked high impact."
        : "Not a top-tier impact event.",
    },
    {
      id: "session-active",
      label: "Session Active",
      ok: sessionActive,
      hint: `${input.session.label} — ${input.session.liquidity} liquidity.`,
    },
    {
      id: "volatility",
      label: "Volatility",
      ok: volOk,
      hint: `Expected ${input.volatility.expected} (score ${input.volatility.score}).`,
    },
    {
      id: "spread-warning",
      label: "Spread Warning",
      ok: liquid,
      hint: liquid
        ? "Spreads should stay manageable in this session."
        : "Spreads may widen — size down.",
    },
    {
      id: "fake-spike",
      label: "Fake Spike Risk",
      ok: true,
      hint: "Assume a two-sided spike before committing.",
    },
    {
      id: "wait-confirmation",
      label: "Wait Confirmation",
      ok: !nearRelease,
      hint: nearRelease
        ? "Too close to the print — wait for confirmation."
        : input.isReleased
          ? "Print is out — confirm direction before entry."
          : "You have time to wait for confirmation.",
    },
  ];
}
