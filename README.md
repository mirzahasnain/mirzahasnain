# NIBBO

Premium landing site + official Telegram community bot for **NIBBO** — a Solana meme coin.

## Monorepo

| Path | What |
|---|---|
| `/` (root) | Next.js landing page + mini-game |
| [`bot/`](./bot) | Production Telegram bot (Telegraf + TypeScript) |

## Landing page

### Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4
- Framer Motion
- Lucide Icons

### Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint

### Structure

```
src/
  app/                 # App router entry
  components/
    effects/           # Loader, cursor, particles, glow, scroll bar
    layout/            # Header, Footer
    sections/          # Hero, About, Why, Token, Roadmap, Community, FAQ
    ui/                # Shared UI primitives
  lib/constants.ts     # Site copy & links
public/nibbo-mascot.png
```

## Telegram bot

See **[bot/README.md](./bot/README.md)** for full setup and Railway / Render deployment.

```bash
cd bot
cp .env.example .env   # set TELEGRAM_BOT_TOKEN
npm install
npm run dev
```
