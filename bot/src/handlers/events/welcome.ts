import type { Telegraf } from "telegraf";
import { Markup } from "telegraf";
import { BRAND, FUN_REPLY_HINTS, LINKS } from "../../config/constants.js";
import {
  displayName,
  mentionHtml,
} from "../../utils/messages.js";

export function registerWelcome(bot: Telegraf): void {
  bot.on("new_chat_members", async (ctx) => {
    const members = ctx.message.new_chat_members;

    for (const member of members) {
      if (member.is_bot) continue;

      const name = displayName(member);
      const who = mentionHtml(member.id, name);
      const funHints = FUN_REPLY_HINTS.map((h) => `<b>${h}</b>`).join(" · ");

      const text = [
        `🐾 <b>Welcome to ${BRAND.name}!</b> ${BRAND.emoji}`,
        "",
        `${who} just landed from another galaxy.`,
        "",
        `<i>${BRAND.tagline}</i>`,
        "",
        BRAND.description,
        "",
        "<b>Starter pack</b>",
        `🌐 Website → ${LINKS.website}`,
        `✈️ Community → ${LINKS.telegram}`,
        `🐦 X → ${LINKS.twitter}`,
        `🎮 Play → ${LINKS.play}`,
        "",
        "Type /help for commands.",
        `Or just say ${funHints}`,
        "",
        "Stay weird. Stay meme. Stay NIBBO. 🚀",
      ].join("\n");

      await ctx.reply(text, {
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
        ...Markup.inlineKeyboard([
          [Markup.button.url("Join vibes", LINKS.telegram)],
          [
            Markup.button.url("Website", LINKS.website),
            Markup.button.url("X", LINKS.twitter),
          ],
        ]),
      });
    }
  });
}
