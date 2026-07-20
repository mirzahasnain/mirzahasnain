import type { Telegraf } from "telegraf";
import { Markup } from "telegraf";
import { env } from "../../config/env.js";
import { BRAND, LAUNCH, LINKS } from "../../config/constants.js";
import {
  buyUrl,
  comingSoonMessage,
  isTokenLive,
} from "../../utils/token.js";
import { PARSE_HTML } from "../../utils/messages.js";

export function registerBuy(bot: Telegraf): void {
  bot.command("buy", async (ctx) => {
    if (!isTokenLive()) {
      await ctx.reply(comingSoonMessage("buy"), {
        ...PARSE_HTML,
        link_preview_options: { is_disabled: true },
      });
      return;
    }

    const url = buyUrl();
    const text = [
      "🛒 <b>Buy NIBBO</b>",
      "",
      `<i>${BRAND.tagline}</i>`,
      "",
      "How to ape (safely):",
      "1. Open a Solana wallet",
      "2. Fund with SOL",
      "3. Tap Buy below — double-check the mint",
      "",
      `<b>Mint:</b> <code>${env.tokenMint}</code>`,
      `<b>Network:</b> ${LAUNCH.network}`,
      `<b>Pad:</b> ${LAUNCH.launchpad}`,
      "",
      `🌐 ${LINKS.website}`,
      "",
      "Not financial advice. Just kitten energy. 🐾💙",
    ].join("\n");

    await ctx.reply(text, {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.url("Buy on Pump.fun", url)],
        [Markup.button.url("Website", LINKS.website)],
      ]),
    });
  });
}
