# NIBBO Telegram Bot

Official community bot for **NIBBO** — cute, funny, energetic, and meme-friendly.

Built with **Node.js**, **TypeScript**, and **Telegraf**. Ready to deploy on **Railway** or **Render**.

## Features

- Branded welcome for every new group member
- Commands: `/help` `/play` `/website` `/socials` `/meme` `/news` `/leaderboard` `/giveaway` `/price` `/roadmap`
- Fun text replies:
  - `GM` → *GM NIBBO Army! 💙*
  - `Hello` → *Meow! Welcome to NIBBO 🐾*
  - `Wen Moon` → *First build. Then moon. 🚀*
- Modular handlers, typed config, graceful shutdown
- Live `/price` via DexScreener when `TOKEN_MINT` is set

## Project structure

```
bot/
├── src/
│   ├── index.ts                 # Entry point
│   ├── bot.ts                   # Telegraf setup & lifecycle
│   ├── config/
│   │   ├── env.ts               # Environment validation
│   │   └── constants.ts         # Brand, links, copy
│   ├── handlers/
│   │   ├── commands/            # /help, /play, …
│   │   ├── events/welcome.ts    # New member greetings
│   │   └── text/funReplies.ts   # GM / Hello / Wen Moon
│   ├── middleware/
│   │   └── errorHandler.ts
│   └── utils/
│       ├── logger.ts
│       └── messages.ts
├── .env.example
├── Procfile
├── railway.toml
├── render.yaml
├── package.json
└── tsconfig.json
```

## Prerequisites

1. Node.js **20+**
2. A Telegram bot token from [@BotFather](https://t.me/BotFather)
3. Add the bot to your group and grant it permission to see messages (disable privacy mode in BotFather → `/setprivacy` → Disable) so fun replies and welcomes work in groups

## Local setup

```bash
cd bot
cp .env.example .env
# Edit .env and set TELEGRAM_BOT_TOKEN=...

npm install
npm run dev
```

Production-style local run:

```bash
npm run build
npm start
```

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Yes | Token from @BotFather |
| `WEBSITE_URL` | No | Defaults to `https://nibbo.fun` |
| `TOKEN_MINT` | No | Solana mint for `/price` (coming-soon message if empty) |
| `PRICE_API_URL` | No | Defaults to DexScreener token endpoint |
| `NODE_ENV` | No | `development` or `production` |

## Commands

| Command | Description |
|---|---|
| `/help` | List commands & fun replies |
| `/play` | Link to the NIBBO mini-game |
| `/website` | Open nibbo.fun |
| `/socials` | Telegram, X, Instagram |
| `/meme` | Random NIBBO meme line |
| `/news` | Latest community updates |
| `/leaderboard` | Game leaderboard link |
| `/giveaway` | Giveaway status & safety notes |
| `/price` | Live price (or pre-launch message) |
| `/roadmap` | Phase 1–4 roadmap |

`/start` also shows the help message.

## Deploy on Railway

1. Push this repo to GitHub.
2. Create a new project on [Railway](https://railway.app) → **Deploy from GitHub**.
3. Set the **Root Directory** to `bot` (or deploy only the `bot` folder).
4. Add variables:
   - `TELEGRAM_BOT_TOKEN` = your token
   - `NODE_ENV` = `production`
   - Optional: `WEBSITE_URL`, `TOKEN_MINT`
5. Build/start (also defined in `railway.toml`):
   - Build: `npm install && npm run build`
   - Start: `npm start`
6. Deploy. Check logs for `NIBBO bot is online`.

Railway tip: use a **Worker** service (long-running process). Polling does not need a public HTTP port.

## Deploy on Render

### Option A — Blueprint

1. In [Render](https://render.com), create a new **Blueprint**.
2. Point it at this repo; it will pick up `bot/render.yaml`.
3. Set `TELEGRAM_BOT_TOKEN` (and optional `TOKEN_MINT`) in the dashboard.
4. Deploy the worker.

### Option B — Manual worker

1. **New → Background Worker**
2. Root directory: `bot`
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add env vars (`TELEGRAM_BOT_TOKEN`, `NODE_ENV=production`, …)
6. Deploy

## BotFather checklist

```
/newbot          → create the bot
/setcommands     → paste commands from /help descriptions
/setprivacy      → Disable (needed for group text replies)
/setdescription  → Born Weird. Built to Meme. Official NIBBO Army bot 💙
```

Suggested command list for `/setcommands`:

```
help - Show all commands & vibes
play - Play the NIBBO mini-game
website - Visit nibbo.fun
socials - Follow NIBBO everywhere
meme - Get a random NIBBO meme
news - Latest NIBBO updates
leaderboard - Game high scores
giveaway - Giveaway info
price - NIBBO token price
roadmap - The path to the galaxy
```

(The bot also registers these via `setMyCommands` on startup.)

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Hot-reload with `tsx watch` |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run compiled bot |
| `npm run typecheck` | Type-check without emit |

## Personality

Replies stay in character: cute, funny, energetic, meme-friendly — the NIBBO Army vibe. Update copy in `src/config/constants.ts` without touching handler logic.

## License

Private — NIBBO project.
