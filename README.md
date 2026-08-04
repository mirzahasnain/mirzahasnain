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

The tool is intentionally offline: no API, database, or auth.

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
  services/calendar.ts        # V4 seams, typed and inert today
  services/news.ts
  services/market.ts
```

Adding a market is one row in `TRADING_PAIRS` with its `usdRelation` (`direct`
for USD-base pairs, `inverse` for anything quoted or priced in dollars); no
component or engine change is needed. Every export format is built from the same
`buildAnalysisFields` output, so a new field appears in the clipboard, the TXT
and the PDF at once.

`services/` is where Version 4 plugs in a live calendar, headlines, and quotes.
