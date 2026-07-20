import type { Telegraf } from "telegraf";
import { BRAND, LAUNCH, LINKS } from "../../config/constants.js";
import { formatCountdown, msUntilLaunch } from "../../utils/token.js";
import { PARSE_HTML } from "../../utils/messages.js";

export function registerCountdown(bot: Telegraf): void {
  bot.command("countdown", async (ctx) => {
    const remaining = msUntilLaunch();

    if (remaining <= 0) {
      await ctx.reply(
        [
          "🚀 <b>NIBBO Countdown</b>",
          "",
          "<b>WE'RE LIVE!</b> The kitten has left the galaxy.",
          "",
          `Buy / chart → /buy · /price`,
          `Community → ${LINKS.telegram}`,
          "",
          `<i>${BRAND.tagline}</i>`,
        ].join("\n"),
        PARSE_HTML,
      );
      return;
    }

    const text = [
      "⏳ <b>NIBBO Countdown</b>",
      "",
      `<b>${formatCountdown(remaining)}</b> until launch`,
      "",
      `<b>Target:</b> ${LAUNCH.label}`,
      `<b>Pad:</b> ${LAUNCH.launchpad} · ${LAUNCH.network}`,
      "",
      "T-minus memes. T-minus vibes. T-minus NIBBO. 🐾💙",
      "",
      "Type /launch for full details.",
    ].join("\n");

    await ctx.reply(text, PARSE_HTML);
  });
}
