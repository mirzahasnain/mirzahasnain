# TradeImpact — Architecture (Sprint 1 Foundation)

## Goals

Provide a rock-solid, maintainable foundation aligned with:

- `docs/PRD.md`
- `docs/ARCHITECTURE_DESIGN_REVIEW.md`
- `docs/ENGINE.md`
- `docs/API.md`
- Existing `nb-*` design system

Sprint 1 does **not** implement Live vendor APIs as new work, AI narration
features, or net-new product surfaces.

## Runtime topology

```text
Browser (Next.js App Router)
  ├─ Presentational UI (components/news-bias + ui/ti)
  ├─ Domain state (state/*) — separated by concern
  ├─ Pure engines (@/engine → lib/news-bias/engine)
  └─ SWR / fetch → /api/economic-calendar/*
                         │
                         ▼
              ProviderFactory (server)
                ├─ MockProvider (default + fallback)
                └─ TradingEconomicsProvider (env-gated)
```

## Rules Engine (IP layer)

Canonical intelligence database: **`src/rules/**`**

- JSON event/profile rules by category (`macro`, `forex`, `commodities`, `crypto`, `indices`, `central-banks`)
- Loader · Validator · Registry · Resolver · Priority / conflict resolution
- Docs: `docs/rules/RULE_ENGINE.md`, `docs/rules/RULE_COVERAGE_REPORT.md`

The Brain (`src/engine`) computes decisions; the Rules Engine stores the firm’s configurable market intelligence.

**MVP wiring:** `runTradeImpactBrain` resolves event ids via aliases, looks up
`src/rules` through `rulesBridge`, applies confidence / score / risk modifiers,
and records rule provenance on `meta.rules`.

## Decision engines

Canonical public surface: **`src/engine/**` (TradeImpact Brain)**

| Module              | Role                              |
| ------------------- | --------------------------------- |
| `surpriseEngine`    | Actual vs Forecast surprise       |
| `confidenceEngine`  | Classic confidence blend          |
| `correlationEngine` | USD → pair bias + affected assets |
| `historicalEngine`  | Similar-release statistics        |
| `volatilityEngine`  | Expected volatility band          |
| `riskEngine`        | Risk level + suggested %          |
| `scoreEngine`       | TradeImpact Score™ + Reliability  |
| `scenarioEngine`    | Best / Expected / Worst           |
| `playbookEngine`    | Before / During / After plan      |
| `decisionEngine`    | Avoid / Wait / Buy / Sell         |
| `orchestrator`      | `runTradeImpactBrain` pipeline    |

Pure functions + JSON config. Legacy `src/lib/news-bias/engine` remains until UI integration. See `docs/engine/BRAIN_ARCHITECTURE_REPORT.md`.

## State management

Lightweight external stores (`createStore` + `useSyncExternalStore`):

| Store            | Responsibility                             |
| ---------------- | ------------------------------------------ |
| `userStore`      | Identity / plan (auth prepared, not wired) |
| `calendarStore`  | Events, filters, offline/fallback flags    |
| `analysisStore`  | Active request/result                      |
| `watchlistStore` | Pinned pairs (localStorage)                |
| `settingsStore`  | Theme + defaults (localStorage)            |

**Do not** merge unrelated domains into a single global blob.

## Providers

Public: `@/providers`  
Contract: `IEconomicCalendarProvider`  
Resilience: retry + cache + mock fallback (existing service).

## Security (foundation)

- Vendor keys: server env only
- `src/lib/validation` for analysis inputs
- `src/utils/sanitize` for text
- `src/lib/auth` null adapter prepares future sessions
- Rate limiting / full auth: later sprints

## Error & resilience UX

- `ErrorBoundary` + App Router `error.tsx` / `global-error.tsx` / `not-found.tsx`
- `LoadingState`, `EmptyState`, `OfflineBanner`

## Performance

- Existing `next/dynamic` lazy panels retained
- `lazyClientPanel` helper for future heavy panels
- Next image formats AVIF/WebP already configured
- Route-level code splitting via App Router

## Out of scope (explicit)

- Live News product feed
- LLM / AI features
- Billing / Stripe
- Decision Contract product changes
- UI redesign / new visual theme
