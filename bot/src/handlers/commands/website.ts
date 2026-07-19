import type { Telegraf } from "telegraf";
import { Markup } from "telegraf";
import { BRAND, LINKS } from "../../config/constants.js";

export function registerWebsite(bot: Telegraf): void {
  bot.command("website", async (ctx) => {
    const text = [
      `🌐 <b>${BRAND.name} Website</b>`,
      "",
      `<i>${BRAND.tagline}</i>`,
      "",
      "Everything NIBBO — lore, token info, roadmap, and the game.",
      LINKS.website,
    ].join("\n");

    await ctx.reply(text, {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.url("Open nibbo.fun", LINKS.website)],
      ]),
    });
  });
}
