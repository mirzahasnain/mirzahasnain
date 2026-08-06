# Contributing to TradeImpact

## Branch naming

Use:

```text
cursor/<short-kebab-description>-e9ae
```

Examples:

- `cursor/tradeimpact-sprint1-e9ae`
- `cursor/decision-contract-e9ae`

## Conventional Commits

```text
feat: add watchlist pin persistence
fix: correct surprise sign for unemployment
docs: update ARCHITECTURE.md
chore: configure husky pre-commit
test: add provider factory coverage
refactor: facade engines under src/engine
```

Types: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`, `perf`, `build`, `ci`.

## Versioning

- **App / marketing version** — communicated in product (e.g. Version 13 TIE).
- **Score model** — `scoreWeights.v1` (+ changelog when weights change).
- **Semver package** — `package.json` version for releases.

## Development workflow

1. Branch from the agreed base (`main` or active TradeImpact integration branch).
2. Keep PRs focused — Sprint scope over drive-by refactors.
3. Do **not** redesign UI or invent features outside the PRD / sprint goal.
4. Run before push:

```bash
npm run typecheck
npm run lint
npm test
```

5. Husky runs `lint-staged` on commit (Prettier + ESLint).

## Code rules

- TypeScript strict — no `any`.
- Import engines from `@/engine` or existing `lib/news-bias/engine` facades.
- Import providers from `@/providers` for new code.
- Logging via `@/utils/logger` (dev-only) — no scattered `console.log`.
- Secrets only in server env — never `NEXT_PUBLIC_` for vendor keys.
- Preserve existing `nb-*` tokens and trading UI patterns.

## Pull requests

- Describe intent, risk, and test plan.
- Link PRD / ENGINE sections when changing decision behaviour.
- Prefer draft PRs for foundation work until checks are green.

## Security

- Do not commit `.env.local` or real API keys.
- Sanitize user text before render/export.
- Auth is prepared (`src/lib/auth`) but not wired in Sprint 1.
