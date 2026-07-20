import type { Telegraf } from "telegraf";
import { NEWS_UPDATES } from "../../config/constants.js";
import { PARSE_HTML } from "../../utils/messages.js";

export function registerNews(bot: Telegraf): void {
  bot.command("news", async (ctx) => {
    const updates = NEWS_UPDATES.map(
      (item, i) => `<b>${i + 1}. ${item.title}</b>\n${item.body}`,
    ).join("\n\n");

    const text = [
      "📰 <b>NIBBO News</b>",
      "",
      updates,
      "",
      "More soon. Stay tuned, Army! 💙",
    ].join("\n");

    await ctx.reply(text, PARSE_HTML);
  });
}
