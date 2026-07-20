import type { Telegraf } from "telegraf";
import { ROADMAP } from "../../config/constants.js";
import { PARSE_HTML } from "../../utils/messages.js";

export function registerRoadmap(bot: Telegraf): void {
  bot.command("roadmap", async (ctx) => {
    const phases = ROADMAP.map((phase) => {
      const items = phase.items.map((item) => `  • ${item}`).join("\n");
      return `<b>${phase.phase} — ${phase.title}</b>\n${items}`;
    }).join("\n\n");

    const text = [
      "🗺️ <b>NIBBO Roadmap</b>",
      "",
      "From foundation to galaxy. No filler. All vibes.",
      "",
      phases,
      "",
      "First build. Then moon. 🚀💙",
    ].join("\n");

    await ctx.reply(text, PARSE_HTML);
  });
}
