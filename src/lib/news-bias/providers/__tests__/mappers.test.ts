import { describe, expect, it } from "vitest";
import {
  mapHistoricalResultToEvent,
  mapMockRowToEvent,
} from "../mappers/mockMapper";
import { mapTradingEconomicsEvent } from "../mappers/tradingEconomicsMapper";
import type { CalendarMockRow, HistoricalResult } from "../../calendar/types";

describe("mockMapper", () => {
  it("maps a calendar row into the standard EconomicEvent model", () => {
    const row: CalendarMockRow = {
      id: "evt-1",
      eventKey: "cpi",
      country: "United States",
      currency: "USD",
      name: "CPI m/m",
      impact: "high",
      offsetMinutes: 30,
      forecast: 0.2,
      previous: 0.1,
      actual: 0.3,
      unit: "%",
    };

    const now = Date.parse("2026-08-06T12:00:00.000Z");
    const event = mapMockRowToEvent(row, now);

    expect(event.id).toBe("evt-1");
    expect(event.title).toBe("CPI m/m");
    expect(event.country).toBe("United States");
    expect(event.currency).toBe("USD");
    expect(event.impact).toBe("high");
    expect(event.forecast).toBe(0.2);
    expect(event.previous).toBe(0.1);
    expect(event.actual).toBeNull(); // not yet released
    expect(event.unit).toBe("%");
    expect(event.source).toBe("mock");
    expect(event.newsId).toBe("cpi");
    expect(event.datetime).toBe("2026-08-06T12:30:00.000Z");
    expect(event.date).toBe("2026-08-06");
    expect(event.time).toBe("12:30");
    expect(event.revised).toBeNull();
  });

  it("includes actual when the mock row is already released", () => {
    const row: CalendarMockRow = {
      id: "evt-2",
      eventKey: "nfp",
      country: "United States",
      currency: "USD",
      name: "Nonfarm Payrolls",
      impact: "high",
      offsetMinutes: -10,
      forecast: 180,
      previous: 175,
      actual: 200,
    };

    const event = mapMockRowToEvent(row, Date.now());
    expect(event.actual).toBe(200);
  });

  it("maps historical results with surprise", () => {
    const row: HistoricalResult = {
      id: "h-1",
      eventKey: "cpi",
      name: "CPI m/m",
      currency: "USD",
      date: "2026-01-15",
      forecast: 0.2,
      previous: 0.1,
      actual: 0.4,
      surprise: 0.2,
      impact: "high",
    };

    const event = mapHistoricalResultToEvent(row);
    expect(event.newsId).toBe("cpi");
    expect(event.surprise).toBe(0.2);
    expect(event.date).toBe("2026-01-15");
    expect(event.source).toBe("mock");
  });
});

describe("tradingEconomicsMapper", () => {
  it("maps a TradingEconomics payload into EconomicEvent", () => {
    const event = mapTradingEconomicsEvent({
      CalendarId: 99,
      Country: "United States",
      Event: "CPI",
      Date: "2026-08-06T12:30:00",
      Importance: 3,
      Forecast: "0.2%",
      Previous: "0.1%",
      Actual: null,
      Currency: "USD",
      Unit: "%",
    });

    expect(event).not.toBeNull();
    expect(event!.id).toBe("99");
    expect(event!.title).toBe("CPI");
    expect(event!.impact).toBe("high");
    expect(event!.forecast).toBe(0.2);
    expect(event!.previous).toBe(0.1);
    expect(event!.actual).toBeNull();
    expect(event!.source).toBe("trading-economics");
    expect(event!.newsId).toBe("cpi");
    expect(event!.country).toBe("United States");
    expect(event!.currency).toBe("USD");
  });

  it("returns null when title or date is missing", () => {
    expect(mapTradingEconomicsEvent({ Country: "US" })).toBeNull();
    expect(
      mapTradingEconomicsEvent({ Event: "CPI", Date: undefined }),
    ).toBeNull();
  });

  it("infers currency from country when Currency is absent", () => {
    const event = mapTradingEconomicsEvent({
      Event: "GDP",
      Date: "2026-08-01T00:00:00Z",
      Country: "Euro Area",
      Importance: 2,
    });
    expect(event!.currency).toBe("EUR");
    expect(event!.impact).toBe("medium");
    expect(event!.newsId).toBe("gdp");
  });
});
