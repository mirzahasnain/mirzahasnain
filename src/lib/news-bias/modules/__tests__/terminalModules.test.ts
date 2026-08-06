import { describe, expect, it } from "vitest";
import { buildMarketBias, buildTopCards, buildHeatmap } from "../dashboard";
import { getSessionStatus, estimateVolatility, buildNewsChecklist } from "../analytics";
import { buildEventPlaybook } from "../playbook";
import type { CalendarEvent } from "../../calendar/types";

function event(partial: Partial<CalendarEvent> & Pick<CalendarEvent, "id" | "name" | "releaseAt">): CalendarEvent {
  return {
    eventKey: "cpi",
    country: "United States",
    countryCode: "US",
    currency: "USD",
    impact: "high",
    forecast: 0.2,
    previous: 0.1,
    actual: null,
    isReleased: false,
    ...partial,
  };
}

describe("dashboard module", () => {
  it("builds top cards from upcoming high-impact events", () => {
    const now = Date.parse("2026-08-06T12:00:00.000Z");
    const events = [
      event({
        id: "a",
        name: "CPI m/m",
        releaseAt: "2026-08-06T14:30:00.000Z",
      }),
      event({
        id: "b",
        name: "NFP",
        releaseAt: "2026-08-07T12:30:00.000Z",
      }),
    ];
    const cards = buildTopCards(events, now);
    expect(cards.todayHighImpact).toBe(1);
    expect(cards.upcomingEvent?.name).toBe("CPI m/m");
  });

  it("marks gold bearish when USD is bullish after a hot CPI", () => {
    const events = [
      event({
        id: "cpi",
        name: "CPI",
        releaseAt: "2026-08-06T12:30:00.000Z",
        isReleased: true,
        forecast: 0.2,
        actual: 0.5,
      }),
    ];
    const bias = buildMarketBias(events, Date.parse("2026-08-06T13:00:00.000Z"));
    expect(bias.usd).toBe("bullish");
    expect(bias.gold).toBe("bearish");
    expect(bias.crypto).toBe("bearish");
    const heat = buildHeatmap(bias);
    expect(heat.find((c) => c.id === "usd")?.tone).toBe("strong");
    expect(heat.find((c) => c.id === "gold")?.tone).toBe("weak");
  });
});

describe("analytics module", () => {
  it("detects London/NY overlap session", () => {
    const status = getSessionStatus(new Date("2026-08-06T13:30:00.000Z"));
    expect(status.session).toBe("overlap");
    expect(status.liquidity).toBe("very-high");
  });

  it("raises expected volatility near a high-impact release", () => {
    const session = getSessionStatus(new Date("2026-08-06T13:30:00.000Z"));
    const reading = estimateVolatility({
      impact: "extreme",
      minutesToRelease: 10,
      isReleased: false,
      session,
    });
    expect(["elevated", "extreme"]).toContain(reading.expected);
    expect(reading.score).toBeGreaterThan(60);
  });

  it("builds a pre-trade checklist", () => {
    const session = getSessionStatus(new Date("2026-08-06T13:30:00.000Z"));
    const items = buildNewsChecklist({
      session,
      impact: "high",
      isHighImpact: true,
      minutesToRelease: 20,
    });
    expect(items.length).toBe(6);
    expect(items.find((i) => i.id === "high-impact")?.ok).toBe(true);
  });
});

describe("playbook module", () => {
  it("builds before/during/after phases for gold sells", () => {
    const book = buildEventPlaybook({
      pairId: "XAUUSD",
      action: "sell",
      pairDirection: "bearish",
      strength: "strong",
      impact: "high",
    });
    expect(book.assetLabel).toBe("Gold");
    expect(book.phases).toHaveLength(3);
    expect(book.phases[0]?.action).toBe("No Trade");
    expect(book.phases[1]?.action).toMatch(/Wait 15 Seconds/);
    expect(book.phases[2]?.action).toMatch(/Sell/);
  });
});
