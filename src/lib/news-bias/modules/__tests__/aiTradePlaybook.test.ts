import { describe, expect, it } from "vitest";
import { buildAnalysis } from "../../logic";
import { buildAiTradePlaybook, buildTradingPlan } from "../playbook";
import { buildRiskManagement } from "../risk";
import { listEntryStrategies, buildTakeProfitPlan, buildStopLossGuide } from "../strategy";
import { buildVolatilityMeter } from "../volatility";

describe("AI Trade Playbook modules", () => {
  const analysis = buildAnalysis({
    eventId: "cpi",
    pairId: "XAUUSD",
    outcome: null,
    forecast: 0.2,
    previous: 0.1,
    actual: 0.5,
  });

  it("builds a complete playbook from analysis", () => {
    expect(analysis).not.toBeNull();
    const playbook = buildAiTradePlaybook(analysis!);

    expect(playbook.setup.pairId).toBe("XAUUSD");
    expect(playbook.setup.bias).toBe("SELL");
    expect(playbook.setup.confidence).toBeGreaterThan(0);
    expect(["Low", "Medium", "High"]).toContain(playbook.setup.risk);

    expect(playbook.plan.map((p) => p.title)).toEqual([
      "Before News",
      "During Release",
      "After Confirmation",
    ]);
    expect(playbook.plan[0].action).toContain("Avoid");

    expect(playbook.entries.map((e) => e.label)).toEqual([
      "Aggressive Entry",
      "Conservative Entry",
      "Breakout Entry",
      "Pullback Entry",
    ]);
    expect(playbook.entries.every((e) => e.explanation.length > 10)).toBe(true);

    expect(playbook.risk.options.map((o) => o.label)).toEqual([
      "0.5%",
      "1%",
      "Maximum 2%",
    ]);
    expect(playbook.risk.positionSizingReminder.length).toBeGreaterThan(10);

    expect(playbook.takeProfit.levels.map((l) => l.label)).toEqual([
      "TP1",
      "TP2",
      "TP3",
    ]);
    expect(playbook.takeProfit.trailStop.label).toMatch(/Trail/i);

    expect(playbook.stopLoss.placements.map((p) => p.label)).toEqual([
      "Above liquidity",
      "Above news spike",
      "Previous swing",
    ]);

    expect(["Low", "Medium", "High", "Extreme"]).toContain(
      playbook.volatility.label,
    );
    expect(playbook.aiNotes.length).toBeGreaterThanOrEqual(3);
    expect(playbook.shareSummary).toContain("XAUUSD");
  });

  it("includes historical behaviour when similar releases exist", () => {
    const playbook = buildAiTradePlaybook(analysis!);
    if (playbook.historical) {
      expect(playbook.historical.summaryLine).toMatch(/out of/);
      expect(playbook.historical.averageMoveLabel).toMatch(/Average move/);
    }
  });

  it("keeps trading plan / risk / strategy / volatility JSON-driven", () => {
    expect(buildTradingPlan("sell")[1].title).toBe("During Release");
    expect(buildRiskManagement({ impact: "high", riskLevel: "Medium" }).options).toHaveLength(3);
    expect(listEntryStrategies()).toHaveLength(4);
    expect(buildTakeProfitPlan().levels).toHaveLength(3);
    expect(buildStopLossGuide().placements).toHaveLength(3);
    expect(buildVolatilityMeter({ impact: "high", strength: "strong" }).band).toMatch(
      /high|extreme|medium/,
    );
  });
});
