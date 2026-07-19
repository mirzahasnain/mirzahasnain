import type { Telegraf } from "telegraf";
import { Markup } from "telegraf";
import { LINKS } from "../../config/constants.js";

export function registerPlay(bot: Telegraf): void {
  bot.command("play", async (ctx) => {
    const text = [
      "🎮 <b>Play NIBBO</b>",
      "",
      "Jump into the mini-game, chase high scores, and flex on the leaderboard.",
      "Kitten reflexes recommended. 🐾",
    ].join("\n");

    await ctx.reply(text, {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.url("▶ Play now", LINKS.play)],
        [Markup.button.url("🏆 Leaderboard", LINKS.leaderboard)],
      ]),
    });
  });
}
