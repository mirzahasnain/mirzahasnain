import type { Context, MiddlewareFn } from "telegraf";
import { logger } from "../utils/logger.js";

export const errorHandler: MiddlewareFn<Context> = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    logger.error("Update handler failed", {
      updateType: ctx.updateType,
      error: error instanceof Error ? error.message : String(error),
    });

    try {
      await ctx.reply(
        "Oops — NIBBO tripped on a cosmic cable 🐾\nTry again in a sec, Army!",
      );
    } catch (replyError) {
      logger.error("Failed to send error reply", replyError);
    }
  }
};

export function setupBotErrorCatcher(bot: {
  catch: (handler: (err: unknown, ctx: Context) => void) => void;
}): void {
  bot.catch((err, ctx) => {
    logger.error("Unhandled bot error", {
      updateType: ctx.updateType,
      error: err instanceof Error ? err.stack ?? err.message : String(err),
    });
  });
}
