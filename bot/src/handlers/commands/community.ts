import type { Telegraf } from "telegraf";
import { Markup } from "telegraf";
import { BRAND, LINKS } from "../../config/constants.js";

export function registerCommunity(bot: Telegraf): void {
  bot.command("community", async (ctx) => {
    const text = [
      `👥 <b>${BRAND.army}</b> ${BRAND.emoji}`,
      "",
      `<i>${BRAND.tagline}</i>`,
      "",
      "This is home base — memes, vibes, and cosmic chaos.",
      "",
      `✈️ Telegram → ${LINKS.telegram}`,
      `🐦 X → ${LINKS.twitter}`,
      `🌐 Website → ${LINKS.website}`,
      `🎮 Play → ${LINKS.play}`,
      "",
      "Say <b>GM</b>, drop a meme, climb the leaderboard.",
      "Welcome to the weird side. 🐾",
    ].join("\n");

    await ctx.reply(text, {
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
      ...Markup.inlineKeyboard([
        [Markup.button.url("Join Telegram", LINKS.telegram)],
        [
          Markup.button.url("Follow X", LINKS.twitter),
          Markup.button.url("Website", LINKS.website),
        ],
      ]),
    });
  });
}
