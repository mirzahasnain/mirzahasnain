import type { Telegraf } from "telegraf";

const REPLIES: Array<{ pattern: RegExp; reply: string }> = [
  {
    pattern: /^\s*gm\b[!?.]*\s*$/i,
    reply: "GM NIBBO Army! 💙",
  },
  {
    pattern: /^\s*gn\b[!?.]*\s*$/i,
    reply: "GN NIBBO Army — dream of green candles. 🌙💙",
  },
  {
    pattern: /^\s*hello\b[!?.]*\s*$/i,
    reply: "Meow! Welcome to NIBBO 🐾",
  },
  {
    pattern: /^\s*wen\s+moon\b[!?.]*\s*$/i,
    reply: "First build. Then moon. 🚀",
  },
  {
    pattern: /^\s*bullish\b[!?.]*\s*$/i,
    reply: "Bullish on vibes. Bullish on memes. Bullish on NIBBO. 📈💙",
  },
  {
    pattern: /^\s*lfg\b[!?.]*\s*$/i,
    reply: "LFG NIBBO Army!!! 🚀🐾",
  },
  {
    pattern: /^\s*nibbo\b[!?.]*\s*$/i,
    reply: "NIBBO. Born Weird. Built To Meme. 💙",
  },
];

export function registerFunReplies(bot: Telegraf): void {
  bot.on("text", async (ctx, next) => {
    const text = ctx.message.text?.trim() ?? "";

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
