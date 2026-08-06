# TradeImpact

**Know the Impact Before You Trade.**

TradeImpact is an AI-assisted **News Trading Decision Platform**. It converts
macroeconomic releases into explainable trading decisions (Score, Why?, Risk,
Playbook) for Forex, metals, crypto, and index traders.

> Educational decision support only — not financial advice.

## Sprint 1 status

Sprint 1 delivers the **production-ready foundation**: architecture surfaces,
config, typed domain boundaries, provider facades, domain state, system UI
states, logging, security prep, tooling, and docs.

It does **not** add Live APIs, AI, or new product features.

See `docs/sprint1/SPRINT1_REPORT.md` for the readiness score.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript (strict)
- Tailwind CSS 4 · existing `nb-*` design tokens
- Vitest · Testing Library · ESLint · Prettier · Husky · lint-staged
- SWR (calendar) · pure TS engines

## Getting started

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Open:

- [/workspace](http://localhost:3000/workspace) — TradeImpact workspace
- [/calendar](http://localhost:3000/calendar) — economic calendar
- [/news-bias](http://localhost:3000/news-bias) — analysis tool

## Scripts

| Script                  | Purpose          |
| ----------------------- | ---------------- |
| `npm run dev`           | Dev server       |
| `npm run build`         | Production build |
| `npm run lint`          | ESLint           |
| `npm run format`        | Prettier write   |
| `npm run typecheck`     | `tsc --noEmit`   |
| `npm test`              | Vitest           |
| `npm run test:coverage` | Coverage         |

## Documentation

| Doc                              | Description              |
| -------------------------------- | ------------------------ |
| `docs/PRD.md`                    | Product Requirements     |
| `docs/ENGINE.md`                 | Intelligence Engine      |
| `docs/API.md`                    | Calendar API / providers |
| `docs/ARCHITECTURE.md`           | Foundation architecture  |
| `docs/PROJECT_STRUCTURE.md`      | Folder map               |
| `CONTRIBUTING.md`                | Contribution guide       |
| `docs/sprint1/SPRINT1_REPORT.md` | Sprint 1 final review    |

## Environment

Server-only secrets (never `NEXT_PUBLIC_*` for vendor keys):

```bash
ECONOMIC_PROVIDER=mock
TRADING_ECONOMICS_KEY=
TRADING_ECONOMICS_SECRET=
ECONOMIC_CALENDAR_REFRESH_MS=60000
ECONOMIC_CALENDAR_MAX_RETRIES=3
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Architecture principles

1. **No business logic in UI components** — engines + config own rules.
2. **Provider-agnostic calendar** — `ProviderFactory` + `MockProvider` fallback.
3. **Deterministic decisions** — AI (future) narrates; engines compute.
4. **Preserve `nb-*` design system** — do not invent a parallel visual language.
5. **Local-first MVP persistence** — cloud sync is post-foundation.

## License

Private / proprietary unless otherwise stated.
