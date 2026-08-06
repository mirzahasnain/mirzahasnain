# TradeImpact — Project Structure

Sprint 1 introduces a **foundation import surface** while preserving existing
implementations under `src/lib/news-bias` and presentational UI under
`src/components/news-bias` (no UI redesign).

```text
docs/                         # PRD, ENGINE, API, architecture, sprint + MVP reports
src/
  app/                        # Next.js App Router (routes + API)
    api/economic-calendar/    # Calendar BFF (secrets server-side)
    workspace/ calendar/ news-bias/ event/ terminal/
    not-found.tsx error.tsx global-error.tsx
  components/
    news-bias/                # Existing trading UI (do not redesign)
    system/                   # ErrorBoundary, Loading, Empty, Offline, Providers
    ui/                       # Landing primitives
    ui/ti/                    # TradeImpact primitives on nb-* tokens
  config/                     # application, environment, constants, routes,
                              # newsRules, pairMappings
  engine/                     # TradeImpact Brain (orchestrator + modules)
  rules/                      # Rules Engine IP (JSON + registry/resolver)
  features/                   # Feature barrels (calendar, analysis, …)
  hooks/                      # Shared hooks + domain hooks
  providers/                  # BaseProvider, MockProvider, ProviderFactory
  services/                   # Economic calendar service facade
  state/                      # user / calendar / analysis / watchlist / settings
  types/                      # Central shared domain types
  utils/                      # logger, sanitize, storage, cn, lazyPanel
  lib/
    news-bias/                # Existing engines, modules, providers (impl)
    auth/                     # Auth adapter preparation (null adapter)
    validation/               # Input validation helpers
    game/                     # Unrelated NIBBO game (legacy product)
  game/                       # Phaser game sources
```

## Import guidance

| Need                 | Import from           |
| -------------------- | --------------------- |
| Product config       | `@/config`            |
| Brain (new code)     | `@/engine`            |
| Rules Engine         | `@/rules`             |
| Providers (new code) | `@/providers`         |
| Domain state         | `@/state`             |
| Shared types         | `@/types`             |
| Logging              | `@/utils/logger`      |
| Existing deep impl   | `@/lib/news-bias/...` |

## Rules

1. **No business logic in UI components.**
2. Prefer facades (`@/engine`, `@/providers`, `@/rules`) for new modules.
3. Do not fork a new design system — extend `nb-*`.
4. Legacy V6 calendar provider stubs are deprecated for new callers.
5. Event ids must resolve through `eventIdAliases` (Brain ↔ Rules).
