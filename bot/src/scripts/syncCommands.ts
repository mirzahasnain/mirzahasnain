/**
 * One-shot: push the full command menu to Telegram without starting polling.
 * Usage: npx tsx src/scripts/syncCommands.ts
 */
import "../config/env.js";
import { Telegraf } from "telegraf";
import { env } from "../config/env.js";
import { syncTelegramCommandMenu } from "../commands/menu.js";
import { logger } from "../utils/logger.js";

async function main(): Promise<void> {
  const bot = new Telegraf(env.telegramBotToken);
  await syncTelegramCommandMenu(bot);
  logger.info("Command menu sync complete");
}

main().catch((error) => {
  logger.error("syncCommands failed", error);
  process.exit(1);
});
