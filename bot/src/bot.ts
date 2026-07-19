import { Telegraf } from "telegraf";
import { BOT_COMMANDS } from "./config/constants.js";
import { env } from "./config/env.js";
import { registerCommands } from "./handlers/commands/index.js";
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

  registerCommands(bot);
  registerWelcome(bot);
  registerFunReplies(bot);

  return bot;
}

export async function startBot(bot: Telegraf): Promise<void> {
  await bot.telegram.setMyCommands([...BOT_COMMANDS]);

  const me = await bot.telegram.getMe();
  logger.info(`Starting @${me.username} in ${env.nodeEnv} mode`);

  // Graceful shutdown for Railway / Render / Docker
  const stop = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down…`);
    bot.stop(signal);
    process.exit(0);
  };

  process.once("SIGINT", () => void stop("SIGINT"));
  process.once("SIGTERM", () => void stop("SIGTERM"));

  await bot.launch({
    dropPendingUpdates: true,
  });

  logger.info("NIBBO bot is online 💙");
}
