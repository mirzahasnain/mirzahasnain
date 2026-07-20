import type { Telegraf } from "telegraf";
import { Markup } from "telegraf";
import { AIRDROP_INFO, LINKS } from "../../config/constants.js";

export function registerAirdrop(bot: Telegraf): void {
  bot.command("airdrop", async (ctx) => {
    const steps = AIRDROP_INFO.howToQualify
      .map((step, i) => `${i + 1}. ${step}`)
      .join("\n");

    const text = [
      "🪂 <b>NIBBO Airdrop</b>",
      "",
      `<b>Status:</b> ${AIRDROP_INFO.status}`,
      "",
      "When the drop opens, the Army eats first. Stay weird. Stay active.",
      "",
      "<b>How to qualify:</b>",
      steps,
      "",
      `⚠️ <i>${AIRDROP_INFO.note}</i>`,
    ].join("\n");

    await ctx.reply(text, {
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
      ...Markup.inlineKeyboard([
        [
          Markup.button.url("Join Telegram", LINKS.telegram),
          Markup.button.url("Follow X", LINKS.twitter),
        ],
      ]),
    });
  });
}
