import type { Telegraf } from "telegraf";
import { MEMES } from "../../config/constants.js";

function pickMeme(): string {
  const index = Math.floor(Math.random() * MEMES.length);
  return MEMES[index] ?? MEMES[0];
}

export function registerMeme(bot: Telegraf): void {
  bot.command("meme", async (ctx) => {
    await ctx.reply(`😹 ${pickMeme()}`);
  });
}
