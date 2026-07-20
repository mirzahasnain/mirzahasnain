# NIBBO Telegram Bot

Premium meme-coin community bot for **NIBBO**.

**Born Weird. Built To Meme.**

Built with **Node.js**, **TypeScript**, and **Telegraf**. Ready to deploy on **Railway** or **Render**.

## Links

- Website: https://nibbo.fun
- X: https://x.com/RealNibbo
- Telegram: https://t.me/nibbocommunity

## Features

- Automatic branded welcome for every new group member
- Full command suite (play, launch, buy, airdrop, countdown, …)
- Fun text replies: `GM` `GN` `Hello` `Wen Moon` `Bullish` `LFG` `NIBBO`
- `/price` and `/buy` show **Coming Soon** when `TOKEN_MINT` is empty
- Live DexScreener price when `TOKEN_MINT` is set
- Modular handlers, typed config, graceful shutdown

## Project structure

```
src/
  index.ts
  bot.ts
  config/           # env + brand constants
  handlers/
    commands/       # one file per command
    events/welcome.ts
    text/funReplies.ts
  middleware/
  utils/
```

## Prerequisites

1. Node.js **20+**
2. Bot token from [@BotFather](https://t.me/BotFather)
3. Disable privacy mode (`/setprivacy` → Disable) so group welcomes & fun replies work

## Local setup

```bash
cp .env.example .env
# set TELEGRAM_BOT_TOKEN=...

npm install
npm run dev
```

Production-style:

```bash
npm run build
npm start
```

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Yes | Token from @BotFather |
| `WEBSITE_URL` | No | Defaults to `https://nibbo.fun` |
| `TOKEN_MINT` | No | Solana mint — empty → Coming Soon for `/price` & `/buy` |
| `PRICE_API_URL` | No | DexScreener token endpoint |
| `NODE_ENV` | No | `development` or `production` |

## Commands

| Command | Description |
|---|---|
| `/help` | List commands & fun replies |
| `/play` | NIBBO mini-game |
| `/website` | nibbo.fun |
| `/socials` | Telegram + X |
| `/community` | Join the Army |
| `/meme` | Random meme line |
| `/news` | Latest updates |
| `/leaderboard` | Game leaderboard |
| `/giveaway` | Giveaway info |
| `/airdrop` | Airdrop status |
| `/countdown` | Time until launch |
| `/launch` | Launch details |
| `/buy` | How to buy (or Coming Soon) |
| `/price` | Live price (or Coming Soon) |
| `/roadmap` | Phase 1–4 roadmap |

`/start` also shows help.

### Fun replies

| You type | Bot says |
|---|---|
| `GM` | GM NIBBO Army! 💙 |
| `GN` | GN NIBBO Army — dream of green candles. 🌙💙 |
| `Hello` | Meow! Welcome to NIBBO 🐾 |
| `Wen Moon` | First build. Then moon. 🚀 |
| `Bullish` | Bullish on vibes. Bullish on memes. Bullish on NIBBO. 📈💙 |
| `LFG` | LFG NIBBO Army!!! 🚀🐾 |
| `NIBBO` | NIBBO. Born Weird. Built To Meme. 💙 |

## Deploy on Railway

1. Deploy from GitHub (root = this repo, or `bot/` in the monorepo).
2. Set `TELEGRAM_BOT_TOKEN`, `NODE_ENV=production`.
3. Optional: `TOKEN_MINT`, `WEBSITE_URL`.
4. Build: `npm install && npm run build` · Start: `npm start`

Use a **Worker** service — polling needs no public HTTP port.

## Deploy on Render

1. **Background Worker**
2. Build: `npm install && npm run build`
3. Start: `npm start`
4. Add env vars and deploy

`render.yaml` / `railway.toml` / `Dockerfile` / `Procfile` are included.

## BotFather checklist

```
/setprivacy      → Disable
/setdescription  → Born Weird. Built To Meme. Official NIBBO community bot 💙
/setcommands     → (bot also auto-registers on startup)
```

```
help - Show all commands & vibes
play - Play the NIBBO mini-game
website - Visit nibbo.fun
socials - Follow NIBBO everywhere
community - Join the NIBBO community
meme - Get a random NIBBO meme
news - Latest NIBBO updates
leaderboard - Game high scores
giveaway - Giveaway info
airdrop - Airdrop status & tips
countdown - Time until NIBBO launch
launch - Launch details
buy - How to buy NIBBO
price - NIBBO token price
roadmap - The path to the galaxy
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Hot-reload with `tsx watch` |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run compiled bot |
| `npm run sync-commands` | Push full `/command` menu to Telegram (no polling) |
| `npm run typecheck` | Type-check without emit |

> **Only one bot instance can poll at a time.** If commands appear in the menu but do not reply, stop every other running instance (another terminal, Railway, Render, or a second `npm run dev`), then start this bot again. On boot the bot calls `setMyCommands` for default, private, and group scopes.

## License

Private — NIBBO project.
