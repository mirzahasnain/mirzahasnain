import type { Telegraf } from "telegraf";
import {
  BRAND,
  BOT_COMMANDS,
  FUN_REPLY_HINTS,
} from "../../config/constants.js";
import { PARSE_HTML } from "../../utils/messages.js";

export function registerHelp(bot: Telegraf): void {
  bot.command(["help", "start"], async (ctx) => {
    const commandLines = BOT_COMMANDS.map(
      (c) => `/${c.command} — ${c.description}`,
    ).join("\n");

    const funLines = FUN_REPLY_HINTS.map((h) => `• ${h}`).join("\n");

    const text = [
      `🐾 <b>${BRAND.name} Bot</b> ${BRAND.emoji}`,
      `<i>${BRAND.tagline}</i>`,
      "",
      "Premium meme-coin community bot.",
      "Cute. Funny. Energetic. Meme-powered.",
      "",
      "<b>Commands</b>",
      commandLines,
      "",
      "<b>Fun replies</b> (just type them):",
      funLines,
      "",
      "New members get an automatic NIBBO welcome. Let's meme. 🚀",
    ].join("\n");

    await ctx.reply(text, PARSE_HTML);
  });
}
