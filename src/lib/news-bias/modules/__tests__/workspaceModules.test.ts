import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildOneClickAnalysis } from "../dashboard/oneClick";
import { buildTradeChecklist } from "../dashboard/tradeChecklist";
import { buildMarketStatus } from "../dashboard/marketStatus";
import { searchWorkspace } from "../search";
import {
  addJournalEntry,
  deleteJournalEntry,
  JOURNAL_STORAGE_KEY,
  loadJournal,
} from "../journal";
import { getSessionStatus } from "../analytics";
import { estimateVolatility } from "../analytics";
import type { CalendarEvent } from "../../calendar/types";
import { WATCH_ASSETS } from "../watchlist";

const memory = new Map<string, string>();

beforeEach(() => {
  memory.clear();
  const localStorageMock = {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => {
      memory.set(key, value);
    },
    removeItem: (key: string) => {
      memory.delete(key);
    },
  };
  Object.defineProperty(globalThis, "window", {
    value: { localStorage: localStorageMock },
    configurable: true,
  });
});

afterEach(() => {
  memory.delete(JOURNAL_STORAGE_KEY);
});

describe("buildTradeChecklist", () => {
  it("returns the six required pre-trade checks", () => {
    const session = getSessionStatus(new Date("2026-08-06T14:00:00Z"));
    const volatility = estimateVolatility({
      impact: "high",
      minutesToRelease: 30,
      isReleased: false,
      session,
    });
    const items = buildTradeChecklist({
      session,
      volatility,
      isHighImpact: true,
      minutesToRelease: 30,
      isReleased: false,
    });
    expect(items.map((i) => i.label)).toEqual([
      "High Impact News",
      "Session Active",
      "Volatility",
      "Spread Warning",
      "Fake Spike Risk",
      "Wait Confirmation",
    ]);
  });
});

describe("buildMarketStatus", () => {
  it("marks the active session and market open/closed", () => {
    const session = getSessionStatus(new Date("2026-08-06T13:00:00Z"));
    const status = buildMarketStatus(session);
    expect(status.rows).toHaveLength(4);
    expect(status.rows.some((r) => r.label === "Overlap")).toBe(true);
    expect(status.marketOpen).toBe(session.session !== "off");
  });
});

describe("buildOneClickAnalysis", () => {
  it("returns bias rows for pinned assets without extra clicks", () => {
    const event: CalendarEvent = {
      id: "usd-cpi",
      eventKey: "cpi",
      country: "United States",
      countryCode: "US",
      currency: "USD",
      name: "CPI m/m",
      impact: "high",
      releaseAt: new Date().toISOString(),
      forecast: 0.2,
      previous: 0.1,
      actual: 0.5,
      isReleased: true,
    };
    const pinned = WATCH_ASSETS.filter((a) =>
      ["gold", "silver", "btc", "eurusd"].includes(a.id),
    );
    const result = buildOneClickAnalysis(event, pinned);
    expect(result.rows).toHaveLength(4);
    expect(result.rows.every((r) => r.bias === "bearish")).toBe(true);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.eventLabel).toBe("CPI m/m");
  });
});

describe("searchWorkspace", () => {
  it("finds gold, cpi, nfp, btc, and eurusd", () => {
    expect(searchWorkspace("Gold").some((h) => h.label === "Gold")).toBe(true);
    expect(searchWorkspace("CPI").some((h) => h.kind === "news")).toBe(true);
    expect(searchWorkspace("NFP").some((h) => h.kind === "news")).toBe(true);
    expect(searchWorkspace("BTC").some((h) => h.label === "BTC")).toBe(true);
    expect(searchWorkspace("EURUSD").length).toBeGreaterThan(0);
  });
});

describe("journal module", () => {
  it("persists entry / SL / TP / result / P/L / notes in localStorage", () => {
    const saved = addJournalEntry({
      pairId: "XAUUSD",
      newsLabel: "CPI",
      entry: 2400,
      stopLoss: 2390,
      takeProfit: 2420,
      result: "win",
      profitLoss: 200,
      notes: "Waited confirmation",
    });
    expect(saved).toHaveLength(1);
    expect(loadJournal()[0].notes).toBe("Waited confirmation");
    expect(loadJournal()[0].stopLoss).toBe(2390);

    const cleared = deleteJournalEntry(saved[0].id);
    expect(cleared).toHaveLength(0);
  });
});
