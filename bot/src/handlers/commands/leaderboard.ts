import type { Telegraf } from "telegraf";
import { Markup } from "telegraf";
import { LINKS } from "../../config/constants.js";

export function registerLeaderboard(bot: Telegraf): void {
  bot.command("leaderboard", async (ctx) => {
    const text = [
      "🏆 <b>NIBBO Leaderboard</b>",
      "",
      "Who's got the highest score in the galaxy?",
      "Tap below, climb the ranks, and make the Army proud. 🐾",
    ].join("\n");

    await ctx.reply(text, {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.url("View leaderboard", LINKS.leaderboard)],
        [Markup.button.url("Play to climb", LINKS.play)],
      ]),
    });
  });
}
