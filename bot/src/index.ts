import "./config/env.js";
import { createBot, startBot } from "./bot.js";
import { logger } from "./utils/logger.js";

async function main(): Promise<void> {
  const bot = createBot();
  await startBot(bot);
}

main().catch((error) => {
  logger.error("Fatal startup error", error);
  process.exit(1);
});
