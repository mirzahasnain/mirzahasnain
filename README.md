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
    news-bias/         # Header, Dropdown, ButtonGroup, ResultCard, Footer
    sections/          # Hero, About, Why, Token, Roadmap, Community, FAQ
    ui/                # Shared UI primitives
  lib/constants.ts     # Site copy & links
  lib/news-bias/       # Events, pairs, bias logic, future hooks
public/nibbo-mascot.png
```

## News Bias Tool

A standalone trading utility at [/news-bias](http://localhost:3000/news-bias). Pick a
high-impact USD economic release, a trading pair, and whether the actual came in
above or below forecast — the tool returns the expected **Bullish** or **Bearish**
bias for that pair.

V1 is intentionally offline: no API, database, or auth. The rule set lives in
`src/lib/news-bias/logic.ts` and derives direction from each pair's
`usdRelation` (`direct` pairs follow the dollar, `inverse` pairs move against it),
so adding a pair only means adding a row to `TRADING_PAIRS`.

`src/lib/news-bias/future.ts` holds the typed seams for later versions — live
economic calendar, market data API, AI analysis, probability, and expected move.
