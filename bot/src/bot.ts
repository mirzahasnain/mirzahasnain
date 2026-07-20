import { Telegraf } from "telegraf";
import { env } from "./config/env.js";
import {
  attachCommandHandlers,
  syncTelegramCommandMenu,
} from "./commands/menu.js";
import { registerWelcome } from "./handlers/events/welcome.js";
import { registerFunReplies } from "./handlers/text/funReplies.js";
import {
  errorHandler,
  setupBotErrorCatcher,
} from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";

export function createBot(): Telegraf {
  const bot = new Telegraf(env.telegramBotToken);

  setupBotErrorCatcher(bot);
  bot.use(errorHandler);

  // 1) Slash commands  2) Welcome event  3) Fun text replies
  attachCommandHandlers(bot);
  registerWelcome(bot);
  registerFunReplies(bot);

  return bot;
}

export async function startBot(bot: Telegraf): Promise<void> {
  // Always sync the BotFather / client command menu on boot
  await syncTelegramCommandMenu(bot);

  // Ensure webhook mode is off so long-polling can start cleanly
  await bot.telegram.deleteWebhook({ drop_pending_updates: true });

  const me = await bot.telegram.getMe();
  logger.info(`Starting @${me.username} in ${env.nodeEnv} mode`);

  const stop = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down…`);
    bot.stop(signal);
    process.exit(0);
  };

  process.once("SIGINT", () => void stop("SIGINT"));
  process.once("SIGTERM", () => void stop("SIGTERM"));

  // Retry launch if another instance briefly holds getUpdates
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await bot.launch({ dropPendingUpdates: true });
      break;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const conflict = message.includes("409") || message.includes("Conflict");
      if (!conflict || attempt === maxAttempts) {
        throw error;
      }
      const waitMs = attempt * 2000;
      logger.warn(
        `getUpdates conflict (attempt ${attempt}/${maxAttempts}) — retrying in ${waitMs}ms. Stop other bot instances (local / Railway / Render).`,
      );
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    }
  }

  logger.info("NIBBO bot is online 💙");
}
