import type { Telegraf } from "telegraf";
import { BRAND, BOT_COMMANDS } from "../../config/constants.js";
import { PARSE_HTML } from "../../utils/messages.js";

export function registerHelp(bot: Telegraf): void {
  bot.command(["help", "start"], async (ctx) => {
    const commandLines = BOT_COMMANDS.map(
      (c) => `/${c.command} — ${c.description}`,
    ).join("\n");

    const text = [
      `🐾 <b>${BRAND.name} Bot</b> ${BRAND.emoji}`,
      `<i>${BRAND.tagline}</i>`,
      "",
      "Cute. Funny. Energetic. Meme-powered.",
      "Here's what I can do:",
      "",
      commandLines,
      "",
      "<b>Fun replies</b> (just type them):",
      "• GM",
      "• Hello",
      "• Wen Moon",
      "",
      "New members get an automatic NIBBO welcome. Let's meme. 🚀",
    ].join("\n");

    await ctx.reply(text, PARSE_HTML);
  });
}
