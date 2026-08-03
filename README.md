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

A standalone trading utility at [/news-bias](http://localhost:3000/news-bias). Pick a
high-impact USD economic release and a trading pair, type in the release numbers,
and the decision engine works out the rest: surprise, strength, direction,
expected market impact, confidence, a BUY/SELL/WAIT call, a written analysis,
every affected market, and exports.

The tool is intentionally offline: no API, database, or auth.

### Decision engine

```
Actual - Forecast          -> surprise
|surprise| vs thresholds   -> Neutral / Weak / Moderate / Strong / Extreme
strength                   -> expected impact + confidence (0-100%)
sign of surprise           -> USD Bullish / Bearish / Neutral
USD direction + pair       -> pair direction (via each pair's usdRelation)
pair direction + strength  -> BUY / SELL / WAIT
```

A surprise inside the neutral band (under 0.20) resolves to **WAIT**: there is a
direction, but not enough of one to trade.

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
