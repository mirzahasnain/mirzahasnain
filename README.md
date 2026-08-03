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
high-impact USD economic release, a trading pair, and whether the actual came in
above or below forecast — the tool returns the expected **Bullish** or **Bearish**
bias for that pair, plus impact strength, a trade bias card, a plain-English
explanation, every affected market, and a one-click copy of the analysis.

The tool is intentionally offline: no API, database, or auth. Data and rules are
split so components stay presentational:

```
lib/news-bias/
  news.ts        # Economic events + per-direction market explanations
  pairs.ts       # Trading pairs, display names, USD relation
  logic.ts       # Bias, impact strength, confidence, affected assets
  constants.ts   # Labels and copy
  share.ts       # Copy Analysis payload
  future.ts      # Typed seams for later versions
  types.ts       # Interfaces and unions
```

Direction comes from each pair's `usdRelation` (`direct` pairs follow the dollar,
`inverse` pairs move against it), so adding a pair only means adding a row to
`TRADING_PAIRS`. Impact strength comes from a manually selected deviation bucket
(`In Line`, `Small`, `Medium`, `Large`); once real actual and forecast numbers are
available, `gradeDeviation` in `future.ts` is the only piece that needs filling in.

`future.ts` also holds the seams for a live economic calendar, market data API,
AI analysis, probability, and expected move.
