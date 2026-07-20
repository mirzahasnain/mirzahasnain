import type { Telegraf } from "telegraf";
import { Markup } from "telegraf";
import { BRAND, LINKS } from "../../config/constants.js";

export function registerSocials(bot: Telegraf): void {
  bot.command("socials", async (ctx) => {
    const text = [
      "📣 <b>NIBBO Socials</b>",
      "",
      `<i>${BRAND.tagline}</i>`,
      "",
      "Follow the Army. Share the memes. Stay weird.",
      "",
      `✈️ Telegram → ${LINKS.telegram}`,
      `🐦 X → ${LINKS.twitter}`,
      `🌐 Website → ${LINKS.website}`,
    ].join("\n");

    await ctx.reply(text, {
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
      ...Markup.inlineKeyboard([
        [
          Markup.button.url("Telegram", LINKS.telegram),
          Markup.button.url("X", LINKS.twitter),
        ],
        [Markup.button.url("Website", LINKS.website)],
      ]),
    });
  });
}
