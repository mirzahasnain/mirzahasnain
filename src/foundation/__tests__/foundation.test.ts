import { describe, expect, it } from "vitest";
import { escapeHtml, sanitizePlainText, sanitizeSearchQuery } from "@/utils/sanitize";
import { createStore } from "@/state/createStore";
import { validateAnalysisRequest } from "@/lib/validation";
import { ProviderFactory } from "@/providers";
import { nullAuthAdapter } from "@/lib/auth";

describe("sanitize", () => {
  it("strips angle brackets from search queries", () => {
    expect(sanitizeSearchQuery("<script>gold</script>")).toBe("scriptgold/script");
  });

  it("escapes html entities", () => {
    expect(escapeHtml(`a & b <c>`)).toBe("a &amp; b &lt;c&gt;");
  });

  it("truncates plain text", () => {
    expect(sanitizePlainText("x".repeat(50), 10)).toHaveLength(10);
  });
});

describe("createStore", () => {
  it("notifies subscribers on setState", () => {
    const store = createStore({ count: 0 });
    let seen = 0;
    const unsub = store.subscribe(() => {
      seen += 1;
    });
    store.setState({ count: 1 });
    expect(store.getState().count).toBe(1);
    expect(seen).toBe(1);
    unsub();
    store.setState({ count: 2 });
    expect(seen).toBe(1);
  });
});

describe("validateAnalysisRequest", () => {
  it("accepts numeric CPI gold request", () => {
    const result = validateAnalysisRequest({
      newsId: "cpi",
      pairId: "XAUUSD",
      forecast: 3.2,
      actual: 3.5,
    });
    expect(result.ok).toBe(true);
  });

  it("rejects unknown pair without outcome", () => {
    const result = validateAnalysisRequest({
      newsId: "cpi",
      pairId: "UNKNOWN",
    });
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe("ProviderFactory foundation", () => {
  it("creates mock provider by default", () => {
    const provider = ProviderFactory.create("mock");
    expect(provider.config.id).toMatch(/mock/i);
  });
});

describe("auth preparation", () => {
  it("null adapter returns no session", async () => {
    await expect(nullAuthAdapter.getSession()).resolves.toBeNull();
  });
});
