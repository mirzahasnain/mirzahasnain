/**
 * Economic calendar API service.
 * Browser → /api/economic-calendar/* (keys stay on the server)
 * Server  → ProviderFactory directly
 * Cache + mock fallback so the app never crashes.
 */
import type { IEconomicCalendarProvider } from "../interfaces/IEconomicCalendarProvider";
import { ProviderFactory } from "../providers/ProviderFactory";
import type {
  EconomicEvent,
  HistoricalEconomicEvent,
} from "../types/event";
import { cacheGet, cacheGetStale, cacheSet } from "../utils/cache";
import { getCalendarRefreshMs, getEconomicProviderId } from "../utils/env";
import { calendarLogger } from "../utils/logger";

type Method =
  | "upcoming"
  | "today"
  | "historical"
  | "event"
  | "latest"
  | "search";

interface ApiEnvelope<T> {
  ok: boolean;
  provider?: string;
  fallback?: boolean;
  data?: T;
  error?: string;
}

export class EconomicCalendarApi {
  private provider: IEconomicCalendarProvider;
  private readonly ttlMs: number;
  private lastProviderId: string;

  constructor(provider?: IEconomicCalendarProvider, ttlMs = getCalendarRefreshMs()) {
    this.provider = provider ?? ProviderFactory.create(getEconomicProviderId());
    this.ttlMs = ttlMs;
    this.lastProviderId = this.provider.config.id;
  }

  setProvider(provider: IEconomicCalendarProvider): void {
    this.provider = provider;
    this.lastProviderId = provider.config.id;
  }

  getProviderId(): string {
    return this.lastProviderId;
  }

  getUpcomingEvents(): Promise<EconomicEvent[]> {
    return this.cached("upcoming", "upcoming", () =>
      this.invoke("upcoming"),
    );
  }

  getTodayEvents(): Promise<EconomicEvent[]> {
    return this.cached("today", "today", () => this.invoke("today"));
  }

  getHistoricalEvents(newsId: string): Promise<HistoricalEconomicEvent[]> {
    return this.cached(`historical:${newsId}`, "historical", () =>
      this.invoke("historical", { newsId }),
    );
  }

  getEvent(eventId: string): Promise<EconomicEvent | null> {
    return this.cached(`event:${eventId}`, "event", () =>
      this.invoke("event", { eventId }),
    );
  }

  getLatestResult(newsId: string): Promise<EconomicEvent | null> {
    return this.cached(`latest:${newsId}`, "latest", () =>
      this.invoke("latest", { newsId }),
    );
  }

  searchEvents(query: string): Promise<EconomicEvent[]> {
    const key = `search:${query.trim().toLowerCase()}`;
    return this.cached(key, "search", () => this.invoke("search", { q: query }));
  }

  private async invoke<T>(
    action: Method,
    params: Record<string, string> = {},
  ): Promise<T> {
    if (typeof window === "undefined") {
      return this.invokeDirect<T>(action, params);
    }
    return this.invokeHttp<T>(action, params);
  }

  private async invokeDirect<T>(
    action: Method,
    params: Record<string, string>,
  ): Promise<T> {
    const provider = this.provider;
    this.lastProviderId = provider.config.id;
    switch (action) {
      case "upcoming":
        return (await provider.getUpcomingEvents()) as T;
      case "today":
        return (await provider.getTodayEvents()) as T;
      case "historical":
        return (await provider.getHistoricalEvents(params.newsId ?? "")) as T;
      case "event":
        return (await provider.getEvent(params.eventId ?? "")) as T;
      case "latest":
        return (await provider.getLatestResult(params.newsId ?? "")) as T;
      case "search":
        return (await provider.searchEvents(params.q ?? "")) as T;
    }
  }

  private async invokeHttp<T>(
    action: Method,
    params: Record<string, string>,
  ): Promise<T> {
    const qs = new URLSearchParams(params);
    const url = `/api/economic-calendar/${action}${qs.size ? `?${qs}` : ""}`;
    const response = await fetch(url, { cache: "no-store" });
    const body = (await response.json()) as ApiEnvelope<T>;

    if (!response.ok || !body.ok) {
      throw new Error(body.error ?? "Live data is temporarily unavailable.");
    }

    if (body.provider) this.lastProviderId = body.provider;
    return body.data as T;
  }

  private async cached<T>(
    key: string,
    method: Method,
    fn: () => Promise<T>,
  ): Promise<T> {
    const fresh = cacheGet<T>(key);
    if (fresh !== null) return fresh;

    try {
      const value = await fn();
      cacheSet(key, value, this.ttlMs);
      return value;
    } catch (error) {
      const stale = cacheGetStale<T>(key);
      if (stale !== null) {
        calendarLogger.warn("Serving stale cache after provider failure", {
          method,
          provider: this.lastProviderId,
          error: error instanceof Error ? error.message : String(error),
        });
        return stale;
      }

      if (typeof window === "undefined" && !this.provider.config.isMock) {
        calendarLogger.warn("Falling back to MockProvider", {
          method,
          failedProvider: this.provider.config.id,
        });
        try {
          const mock = ProviderFactory.getMock();
          const previous = this.provider;
          this.provider = mock;
          const value = await this.invokeDirect<T>(method, keyToParams(key, method));
          this.provider = previous;
          this.lastProviderId = mock.config.id;
          cacheSet(key, value, this.ttlMs);
          return value;
        } catch (mockError) {
          calendarLogger.error("Mock fallback failed", {
            method,
            error:
              mockError instanceof Error
                ? mockError.message
                : String(mockError),
          });
        }
      }

      throw error instanceof Error
        ? error
        : new Error("Live data is temporarily unavailable.");
    }
  }
}

function keyToParams(key: string, method: Method): Record<string, string> {
  switch (method) {
    case "historical":
    case "latest":
      return { newsId: key.split(":").slice(1).join(":") };
    case "event":
      return { eventId: key.split(":").slice(1).join(":") };
    case "search":
      return { q: key.split(":").slice(1).join(":") };
    default:
      return {};
  }
}

/** App-wide singleton used by hooks and the legacy facade. */
export const economicCalendarApi = new EconomicCalendarApi();
