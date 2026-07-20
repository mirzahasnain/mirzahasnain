import type { Telegraf } from "telegraf";
import { env } from "../../config/env.js";
import { LINKS } from "../../config/constants.js";
import { logger } from "../../utils/logger.js";
import { PARSE_HTML } from "../../utils/messages.js";
import {
  comingSoonMessage,
  isTokenLive,
} from "../../utils/token.js";

interface DexPair {
  chainId?: string;
  priceUsd?: string;
  priceChange?: { h24?: number };
  volume?: { h24?: number };
  liquidity?: { usd?: number };
  url?: string;
  baseToken?: { symbol?: string };
}

interface DexResponse {
  pairs?: DexPair[] | null;
}

async function fetchPrice(mint: string): Promise<DexPair | null> {
  const url = `${env.priceApiUrl}/${mint}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error(`Price API responded with ${response.status}`);
  }

  const data = (await response.json()) as DexResponse;
  const pairs = data.pairs ?? [];
  const solana = pairs.filter((p) => p.chainId === "solana");
  const best = (solana.length > 0 ? solana : pairs).sort(
    (a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0),
  )[0];

  return best ?? null;
}

function formatUsd(value: string | number | undefined): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (n === undefined || Number.isNaN(n)) return "—";
  if (n >= 1) return `$${n.toFixed(4)}`;
  if (n >= 0.0001) return `$${n.toFixed(6)}`;
  return `$${n.toExponential(2)}`;
}

export function registerPrice(bot: Telegraf): void {
  bot.command("price", async (ctx) => {
    if (!isTokenLive()) {
      await ctx.reply(comingSoonMessage("price"), {
        ...PARSE_HTML,
        link_preview_options: { is_disabled: true },
      });
      return;
    }

    try {
      const pair = await fetchPrice(env.tokenMint);

      if (!pair?.priceUsd) {
        await ctx.reply(
          "💰 Couldn't find a live pair yet. Markets might still be spinning up — try again soon! 🐾",
        );
        return;
      }

      const change = pair.priceChange?.h24;
      const changeText =
        change === undefined
          ? "—"
          : `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

      const text = [
        `💰 <b>${pair.baseToken?.symbol ?? "NIBBO"} Price</b>`,
        "",
        `<b>Price:</b> ${formatUsd(pair.priceUsd)}`,
        `<b>24h:</b> ${changeText}`,
        `<b>Volume 24h:</b> ${formatUsd(pair.volume?.h24)}`,
        `<b>Liquidity:</b> ${formatUsd(pair.liquidity?.usd)}`,
        "",
        pair.url ? `Chart → ${pair.url}` : `Buy → ${LINKS.pumpfun}`,
        "",
        "Not financial advice. Just kitten energy. 💙",
      ].join("\n");

      await ctx.reply(text, PARSE_HTML);
    } catch (error) {
      logger.error("Price fetch failed", error);
      await ctx.reply(
        "💰 Price oracle took a catnap. Try /price again in a moment! 🐾",
      );
    }
  });
}
