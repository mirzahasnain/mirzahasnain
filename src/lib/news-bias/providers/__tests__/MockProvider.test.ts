import { describe, expect, it } from "vitest";
import { MockProvider } from "../MockProvider";

describe("MockProvider", () => {
  const provider = new MockProvider();

  it("exposes mock provider config", () => {
    expect(provider.config.id).toBe("mock");
    expect(provider.config.label).toBe("MockProvider");
    expect(provider.config.isMock).toBe(true);
  });

  it("returns upcoming high-impact events sorted by datetime", async () => {
    const events = await provider.getUpcomingEvents();
    expect(events.length).toBeGreaterThan(0);
    expect(events.every((e) => e.impact === "high")).toBe(true);
    expect(events.every((e) => e.source === "mock")).toBe(true);

    for (let i = 1; i < events.length; i++) {
      expect(
        new Date(events[i].datetime).getTime(),
      ).toBeGreaterThanOrEqual(new Date(events[i - 1].datetime).getTime());
    }
  });

  it("implements the full IEconomicCalendarProvider surface", async () => {
    const upcoming = await provider.getUpcomingEvents();
    const first = upcoming[0];
    expect(first).toBeDefined();

    const byId = await provider.getEvent(first.id);
    expect(byId?.id).toBe(first.id);

    const today = await provider.getTodayEvents();
    expect(Array.isArray(today)).toBe(true);

    const newsId = first.newsId ?? "cpi";
    const history = await provider.getHistoricalEvents(newsId);
    expect(Array.isArray(history)).toBe(true);

    const latest = await provider.getLatestResult(newsId);
    expect(latest === null || typeof latest.id === "string").toBe(true);

    const search = await provider.searchEvents("CPI");
    expect(Array.isArray(search)).toBe(true);
  });

  it("searchEvents filters by title / currency / country", async () => {
    const usd = await provider.searchEvents("USD");
    expect(usd.length).toBeGreaterThan(0);
    expect(
      usd.every(
        (e) =>
          e.currency === "USD" ||
          e.title.toUpperCase().includes("USD") ||
          e.country.toUpperCase().includes("USD"),
      ),
    ).toBe(true);
  });
});
