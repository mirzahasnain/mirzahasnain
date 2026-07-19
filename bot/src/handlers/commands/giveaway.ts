import type { Telegraf } from "telegraf";
import { GIVEAWAY_INFO } from "../../config/constants.js";
import { PARSE_HTML } from "../../utils/messages.js";

export function registerGiveaway(bot: Telegraf): void {
  bot.command("giveaway", async (ctx) => {
    const steps = GIVEAWAY_INFO.howToEnter
      .map((step, i) => `${i + 1}. ${step}`)
      .join("\n");

    const text = [
      "🎁 <b>NIBBO Giveaways</b>",
      "",
      `<b>Status:</b> ${GIVEAWAY_INFO.status}`,
      "",
      "<b>How to enter (when live):</b>",
      steps,
      "",
      `⚠️ <i>${GIVEAWAY_INFO.note}</i>`,
      "",
      "NIBBO never DMs you first asking for seeds or SOL. Stay safe! 🐾",
    ].join("\n");

    await ctx.reply(text, PARSE_HTML);
  });
}
