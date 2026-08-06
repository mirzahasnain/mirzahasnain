import { afterEach, describe, expect, it } from "vitest";
import { ProviderFactory } from "../ProviderFactory";
import { MockProvider } from "../MockProvider";
import { TradingEconomicsProvider } from "../TradingEconomicsProvider";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("ProviderFactory", () => {
  it("returns MockProvider for mock", () => {
    const provider = ProviderFactory.create("mock");
    expect(provider).toBeInstanceOf(MockProvider);
    expect(provider.config.id).toBe("mock");
    expect(provider.config.isMock).toBe(true);
  });

  it("returns MockProvider for unknown ids via fromName", () => {
    const provider = ProviderFactory.fromName("future-vendor");
    expect(provider).toBeInstanceOf(MockProvider);
  });

  it("maps TradingEconomics names to TradingEconomicsProvider when keyed", () => {
    process.env.TRADING_ECONOMICS_KEY = "test-key";
    const a = ProviderFactory.fromName("TradingEconomics");
    const b = ProviderFactory.fromName("trading-economics");
    expect(a).toBeInstanceOf(TradingEconomicsProvider);
    expect(b).toBeInstanceOf(TradingEconomicsProvider);
    expect(a.config.id).toBe("trading-economics");
  });

  it("falls back to MockProvider when TradingEconomics key is missing", () => {
    delete process.env.TRADING_ECONOMICS_KEY;
    const provider = ProviderFactory.create("trading-economics");
    expect(provider).toBeInstanceOf(MockProvider);
  });

  it("reuses the same MockProvider singleton", () => {
    expect(ProviderFactory.getMock()).toBe(ProviderFactory.getMock());
  });
});
