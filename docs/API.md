# Economic Calendar API Architecture (Version 10)

The app never depends on a single calendar vendor. Every live source implements
the same interface, maps into one standard `EconomicEvent` model, and is selected
via environment variables. React components talk only to hooks / services.

## Folder layout

```
src/lib/news-bias/
  providers/          # BaseProvider, MockProvider, TradingEconomicsProvider, ProviderFactory
  providers/mappers/  # Provider JSON → EconomicEvent
  interfaces/         # IEconomicCalendarProvider
  services/           # economicCalendarApi, economicCalendar facade
  utils/              # cache, retry, logger, env, eventAdapter
  types/              # EconomicEvent standard model
  hooks/              # useEconomicCalendar, useUpcomingEvents, …
```

Gateway (keeps secrets on the server):

```
src/app/api/economic-calendar/[action]/route.ts
```

## Environment

Copy `.env.local.example` → `.env.local`:

```bash
ECONOMIC_PROVIDER=mock
TRADING_ECONOMICS_KEY=
TRADING_ECONOMICS_SECRET=
ECONOMIC_CALENDAR_REFRESH_MS=60000
ECONOMIC_CALENDAR_MAX_RETRIES=3
```

| Variable | Purpose |
|---|---|
| `ECONOMIC_PROVIDER` | `mock` (default) or `trading-economics` / `TradingEconomics` |
| `TRADING_ECONOMICS_KEY` | Server-only API key — never hardcode |
| `TRADING_ECONOMICS_SECRET` | Optional secret (sent as `key:secret`) |
| `ECONOMIC_CALENDAR_REFRESH_MS` | Cache / SWR refresh interval (default 60s) |
| `ECONOMIC_CALENDAR_MAX_RETRIES` | Provider retry attempts (default 3) |

Keys are read only on the server. The browser calls `/api/economic-calendar/*`.

## Provider interface

`IEconomicCalendarProvider`:

- `getUpcomingEvents()`
- `getTodayEvents()`
- `getHistoricalEvents(newsId)`
- `getEvent(eventId)`
- `getLatestResult(newsId)`
- `searchEvents(query)`

All providers extend `BaseProvider`, which wraps each method with retry +
development-only duration logging.

## Provider factory

```ts
import { ProviderFactory } from "@/lib/news-bias/providers";

const provider = ProviderFactory.create(); // reads ECONOMIC_PROVIDER
```

| Env value | Provider |
|---|---|
| `mock` (default) | `MockProvider` |
| `trading-economics` / `TradingEconomics` | `TradingEconomicsProvider` |
| anything else / missing TE key | `MockProvider` |

If a live provider throws at runtime, the API route and
`EconomicCalendarApi` automatically fall back to `MockProvider` (or stale cache).
The application must never crash because a vendor is down.

## Standard event model

```ts
interface EconomicEvent {
  id: string;
  country: string;
  currency: string;
  title: string;
  impact: "high" | "medium" | "low";
  forecast: number | null;
  previous: number | null;
  actual: number | null;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  datetime: string;   // ISO (for sorting / countdowns)
  unit: string | null;
  revised: number | null;
  source: string;
  newsId: string | null;
}
```

React never imports TradingEconomics (or any vendor) JSON shapes.
Existing UI types (`CalendarEvent`) are produced by `toCalendarEvent()` in
`utils/eventAdapter.ts`.

## Mapping

Every provider owns a mapper under `providers/mappers/`:

```
Provider JSON  →  mapper  →  EconomicEvent  →  (optional) CalendarEvent for UI
```

- `mapMockRowToEvent` / `mapHistoricalResultToEvent` — local JSON
- `mapTradingEconomicsEvent` — TradingEconomics calendar payload

Mappers are defensive: missing title/date → `null`; numeric fields parse `"0.2%"` safely.

## Caching

`utils/cache.ts` is a process-local TTL cache (default **60 seconds**).

1. Fresh hit → return immediately  
2. Miss → call provider → store with TTL  
3. Provider failure → serve **stale** cache if present  
4. Still nothing on the server → switch to `MockProvider`

SWR in the hooks also revalidates on the same interval.

## Retry

`utils/retry.ts` retries failed provider calls up to **3** attempts
(exponential backoff). `NonRetryableError` (e.g. missing API key) stops retries
immediately so we can fall back to mock without waiting.

## Logging (development only)

`calendarLogger` records:

- provider id
- method name
- duration (ms)
- retry attempt / max
- errors

Silent when `NODE_ENV !== "development"`.

## React hooks

Components never call providers or `fetch` directly:

```ts
import {
  useEconomicCalendar,
  useUpcomingEvents,
  useHistoricalNews,
  useLatestRelease,
} from "@/lib/news-bias/hooks";
```

| Hook | Data |
|---|---|
| `useEconomicCalendar(filter?)` | Upcoming events as UI `CalendarEvent[]` |
| `useUpcomingEvents()` | Standard `EconomicEvent[]` |
| `useHistoricalNews(newsId)` | Historical series for a release |
| `useLatestRelease(newsId)` | Most recent print |

Loading skeletons, error cards, and offline copy already live in the calendar /
terminal UI — hooks expose `isLoading`, `error`, and `offline`.

## How to add a new provider

1. **Implement** `IEconomicCalendarProvider` (extend `BaseProvider`).
2. **Add a mapper** `providers/mappers/yourVendorMapper.ts` → `EconomicEvent`.
3. **Register** in `ProviderFactory.create()` / `fromName()`.
4. **Extend** `EconomicProviderId` in `types/event.ts`.
5. **Document** the env vars (never hardcode secrets).
6. **Unit test** factory selection + mapper edge cases.

Example skeleton:

```ts
export class AcmeProvider extends BaseProvider {
  readonly config = { id: "acme", label: "Acme", isMock: false } as const;

  async fetchUpcomingEvents() {
    const raw = await fetchAcme();
    return raw.map(mapAcmeEvent).filter(Boolean);
  }
  // … remaining fetch* methods
}
```

Then in the factory:

```ts
case "acme":
  return new AcmeProvider();
```

## Testing

```bash
npm test
```

Covered:

- `ProviderFactory` selection + mock fallback
- Mock + TradingEconomics mappers
- `MockProvider` interface behaviour

## Production checklist

- Strict TypeScript throughout `/providers`, `/services`, `/hooks`
- No API keys in client bundles
- No duplicated fetch logic (BaseProvider + EconomicCalendarApi)
- Swap vendors with env only — no React changes
