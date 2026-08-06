# NIBBO Landing Page

Premium single-page landing site for **NIBBO** — a Solana meme coin.

## Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4
- Framer Motion
- Lucide Icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint

## Structure

```
src/
  app/                 # App router entry
    news-bias/         # News Bias Tool route
  components/
    effects/           # Loader, cursor, particles, glow, scroll bar
    layout/            # Header, Footer
    news-bias/         # Header, Dropdown, ButtonGroup, ResultCard, analysis cards
    sections/          # Hero, About, Why, Token, Roadmap, Community, FAQ
    ui/                # Shared UI primitives
  lib/constants.ts     # Site copy & links
  lib/news-bias/       # news.ts, pairs.ts, logic.ts, share.ts, future.ts
public/nibbo-mascot.png
```

## News Bias Tool

A standalone trading utility at [/news-bias](http://localhost:3000/news-bias),
built mobile-first around one job: get to a decision fast.

**Three taps to a result.** Tap the economic release, tap the pair, tap whether
the actual beat, missed or matched the forecast. There is no analyse button: the
result updates as soon as the three answers exist. Each step collapses into a
chip, and one large result card shows the call (`SELL XAUUSD`), the direction,
confidence and expected impact. Everything else — release values, surprise
breakdown, full analysis, affected markets, exports and history — sits behind a
single **More details** disclosure, whose code only loads when it is opened.

Typing the real numbers into that panel replaces the assumed strength with a
measured one, so the confidence and wording sharpen.

Shortcuts for speed:

- **Quick picks** for CPI, NFP, FOMC, Interest Rate and ISM PMI
- **Favourite pairs** (XAUUSD, XAGUSD, BTCUSD, EURUSD) listed before the rest
- **Search** that understands names as well as tickers — `gold` finds XAUUSD,
  `bitcoin` finds BTCUSD
- **Recent** analyses grouped by day, one tap to reopen
- **Dark and light themes**, remembered in localStorage and applied before the
  first paint
- **Keyboard support**: arrows move through options, Enter selects, Escape backs
  out

### Economic calendar (Version 6)

Live calendar surfaces at [`/calendar`](http://localhost:3000/calendar) and
[`/event/[id]`](http://localhost:3000/event/usd-cpi-upcoming). High-impact
releases show countdown, favorites, currency filters, local reminders, and
searchable history. Opening an event auto-fills News / Forecast / Previous on
`/news-bias`. Providers are swapped in one config file
(`calendar/config.ts`) — Mock today; TradingEconomics, FMP, and MarketAux stubs
are ready. No paid API is connected yet.

### Smart Decision Engine (Version 7)

Intelligence lives under `src/lib/news-bias/engine/`. Rules and mappings are JSON
(`newsRules.json`, `pairMappings.json`, `impactLevels.json`,
`historicalMoves.json`) — nothing is hardcoded in React. The UI calls
`buildAnalysis` → `decisionEngine.decide()`. Unit tests: `npm test`.

### Historical Intelligence (Version 8)

Answers “what usually happened after similar news?” using JSON releases in
`src/lib/news-bias/data/history/`. Engines: `similarityEngine`, `historyEngine`,
`statisticsEngine`, `probabilityEngine`. The `history-api` interface is ready
for a real database later. More details shows match votes, probabilities,
average moves, a timeline, and a lazy-loaded chart. Export supports CSV.

### News Trading Terminal (Version 9)

Professional desk at [`/terminal`](http://localhost:3000/terminal). Modular
domains under `src/lib/news-bias/modules/` (dashboard, calendar, decision,
history, playbook, watchlist, alerts, analytics, preferences). The existing
`/news-bias` analysis UI is unchanged.

### Real Economic Calendar API (Version 10)

Provider architecture under `src/lib/news-bias/providers/` — `MockProvider`,
`TradingEconomicsProvider`, and `ProviderFactory` all implement
`IEconomicCalendarProvider`. Switch with `ECONOMIC_PROVIDER` in `.env.local`
(keys never hardcoded). Standard `EconomicEvent` model + mappers, 60s cache,
3× retry, mock fallback, and hooks (`useEconomicCalendar`, etc.). See
[`docs/API.md`](docs/API.md).

### TradeImpact Workspace (Version 11)

Trader workspace at [`/workspace`](http://localhost:3000/workspace). Feature
modules: `dashboard`, `watchlist`, `journal`, `settings`, `notifications`,
`search`. Home desk covers next high-impact news, countdown, today's bias,
pinned watchlist, one-click analysis, trade checklist, journal, favorites,
global search, market status, local notifications, settings, and quick-action
FABs — all localStorage-backed. Existing `/news-bias` style is unchanged.

### AI Trade Playbook (Version 12)

When an economic news analysis is ready, the app builds a full actionable
playbook from JSON rules (`playbook/`, `risk/`, `strategy/`, `volatility/`).
Shows trade setup, before/during/after plan, entry strategies, risk sizing,
TP/SL guides, fake-spike warning, historical behaviour, volatility meter, AI
notes, plus PDF/TXT/Copy/Share export. Surfaces: analysis details, event
detail, and workspace.

### TradeImpact Intelligence Engine (Version 13)

Core TIE under `engine/intelligenceEngine.ts` + `engine/intelligence/`.
Produces TradeImpact Score™ (0–100), reliability meter, historical match,
correlation map, best/expected/worst scenarios, risk level, AI narrative, and
Avoid/Wait/Aggressive|Conservative Buy/Sell decisions via a formal decision
tree. See [`docs/ENGINE.md`](docs/ENGINE.md).

### Decision engine

```
tapped outcome             -> direction, with an assumed Moderate strength
Actual - Forecast          -> surprise (replaces the assumption)
|surprise| vs thresholds   -> Neutral / Weak / Moderate / Strong / Extreme
strength                   -> expected impact + confidence (0-100%)
sign of surprise           -> USD Bullish / Bearish / Neutral
USD direction + pair       -> pair direction (via each pair's usdRelation)
pair direction + strength  -> BUY / SELL / WAIT
```

A surprise inside the neutral band (under 0.20), or an actual that matches the
forecast, resolves to **WAIT**: there may be a direction, but not enough of one
to trade.

### Layout

```
lib/news-bias/
  news.ts                     # Events + per-direction dollar effects
  pairs.ts                    # Pairs, display names, USD relation
  logic.ts                    # Composition root: request -> Analysis
  constants.ts                # All user-facing copy and engine thresholds
  types/interfaces.ts         # Interfaces and unions
  utils/calculateSurprise.ts  # Actual - forecast, parsing, formatting
  utils/calculateStrength.ts  # Strength bands + expected impact
  utils/calculateConfidence.ts
  utils/marketLogic.ts        # Asset mapping engine + trade decision
  utils/analysisGenerator.ts  # Reason, full analysis, export fields
  utils/exportAnalysis.ts     # Copy, TXT, PDF, Share
  utils/pdf.ts                # Dependency-free PDF writer
  utils/history.ts            # Last 20 analyses in localStorage
  utils/clipboard.ts, download.ts
  calendar/                   # Types, config, mock JSON, providers, hooks
  engine/                     # V7–V8 decision + historical intelligence
    decisionEngine.ts
    surpriseEngine.ts
    confidenceEngine.ts
    playbookEngine.ts
    historicalEngine.ts
    similarityEngine.ts
    historyEngine.ts
    statisticsEngine.ts
    probabilityEngine.ts
    newsRules.ts
    pairMapping.ts
    data/*.json
  data/history/               # Per-news historical release JSON
  services/history-api/       # Pluggable history data source
  services/economicCalendar.ts
  services/calendarProvider.ts
  services/liveNews.ts
  services/news.ts
  services/market.ts
```

Adding a market is one row in `TRADING_PAIRS` with its `usdRelation` (`direct`
for USD-base pairs, `inverse` for anything quoted or priced in dollars); no
component or engine change is needed. Every export format is built from the same
`buildAnalysisFields` output, so a new field appears in the clipboard, the TXT
and the PDF at once.

Switch the calendar provider with `CALENDAR_CONFIG.calendarProvider` in
`src/lib/news-bias/calendar/config.ts`. Retune news bias with the JSON files
under `src/lib/news-bias/engine/data/`. Historical prints live in
`src/lib/news-bias/data/history/`.
