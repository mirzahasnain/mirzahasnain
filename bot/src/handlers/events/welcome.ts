import type { Telegraf } from "telegraf";
import { BRAND, LINKS } from "../../config/constants.js";
import {
  displayName,
  mentionHtml,
  PARSE_HTML,
} from "../../utils/messages.js";

export function registerWelcome(bot: Telegraf): void {
  bot.on("new_chat_members", async (ctx) => {
    const members = ctx.message.new_chat_members;

    for (const member of members) {
      if (member.is_bot) continue;

      const name = displayName(member);
      const who = mentionHtml(member.id, name);

      const text = [
        `🐾 <b>Welcome to the ${BRAND.name} Army!</b> ${BRAND.emoji}`,
        "",
        `${who} just landed from another galaxy.`,
        "",
        `<i>${BRAND.tagline}</i>`,
        "",
        `${BRAND.description}`,
        "",
        "Here's your starter pack:",
        `🌐 Website → ${LINKS.website}`,
        `🎮 Play → ${LINKS.play}`,
        `🐦 X → ${LINKS.twitter}`,
        "",
        "Type /help for commands — or just say <b>GM</b> / <b>Hello</b> / <b>Wen Moon</b> for vibes.",
        "",
        "Stay weird. Stay meme. Stay NIBBO. 🚀",
      ].join("\n");

      await ctx.reply(text, PARSE_HTML);
    }
  });
}
