import type { Telegraf } from "telegraf";

const REPLIES: Array<{ pattern: RegExp; reply: string }> = [
  {
    pattern: /^\s*gm\b[!?.]*\s*$/i,
    reply: "GM NIBBO Army! 💙",
  },
  {
    pattern: /^\s*hello\b[!?.]*\s*$/i,
    reply: "Meow! Welcome to NIBBO 🐾",
  },
  {
    pattern: /^\s*wen\s+moon\b[!?.]*\s*$/i,
    reply: "First build. Then moon. 🚀",
  },
];

export function registerFunReplies(bot: Telegraf): void {
  bot.on("text", async (ctx, next) => {
    const text = ctx.message.text?.trim() ?? "";

    // Ignore commands — those are handled separately
    if (text.startsWith("/")) {
      return next();
    }

    for (const { pattern, reply } of REPLIES) {
      if (pattern.test(text)) {
        await ctx.reply(reply);
        return;
      }
    }

    return next();
  });
}
