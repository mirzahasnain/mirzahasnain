import type { Telegraf } from "telegraf";
import { Markup } from "telegraf";
import { LINKS } from "../../config/constants.js";

export function registerSocials(bot: Telegraf): void {
  bot.command("socials", async (ctx) => {
    const text = [
      "📣 <b>NIBBO Socials</b>",
      "",
      "Follow the Army. Share the memes. Stay weird.",
      "",
      `✈️ Telegram → ${LINKS.telegram}`,
      `🐦 X / Twitter → ${LINKS.twitter}`,
      `📸 Instagram → ${LINKS.instagram}`,
      `🌐 Website → ${LINKS.website}`,
    ].join("\n");

    await ctx.reply(text, {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          Markup.button.url("Telegram", LINKS.telegram),
          Markup.button.url("X", LINKS.twitter),
        ],
        [
          Markup.button.url("Instagram", LINKS.instagram),
          Markup.button.url("Website", LINKS.website),
        ],
      ]),
    });
  });
}
