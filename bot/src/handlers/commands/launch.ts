import type { Telegraf } from "telegraf";
import { Markup } from "telegraf";
import { BRAND, LAUNCH, LINKS } from "../../config/constants.js";
import { formatCountdown, isTokenLive, msUntilLaunch } from "../../utils/token.js";

export function registerLaunch(bot: Telegraf): void {
  bot.command("launch", async (ctx) => {
    const remaining = msUntilLaunch();
    const status =
      isTokenLive() || remaining <= 0
        ? "🟢 Live / launching"
        : `🟡 Countdown · ${formatCountdown(remaining)}`;

    const text = [
      "🚀 <b>NIBBO Launch</b>",
      "",
      `<i>${BRAND.tagline}</i>`,
      "",
      `<b>Status:</b> ${status}`,
      `<b>When:</b> ${LAUNCH.label}`,
      `<b>Where:</b> ${LAUNCH.launchpad}`,
      `<b>Network:</b> ${LAUNCH.network}`,
      "",
      "Mission brief:",
      "• Website live ✅",
      "• Community growing ✅",
      "• Token → launch window",
      "",
      "First build. Then moon. 🌕",
    ].join("\n");

    await ctx.reply(text, {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.url("Website", LINKS.website)],
        [
          Markup.button.url("Telegram", LINKS.telegram),
          Markup.button.url("X", LINKS.twitter),
        ],
      ]),
    });
  });
}
