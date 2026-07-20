/**
 * Force re-register the full Telegram command menu.
 * Deletes existing commands across scopes, then setMyCommands again.
 *
 * Usage: npx tsx src/scripts/syncCommands.ts
 */
import "../config/env.js";
import { Telegraf } from "telegraf";
import { env } from "../config/env.js";
import { getBotCommands } from "../commands/menu.js";
import { logger } from "../utils/logger.js";

type Scope =
  | { type: "default" }
  | { type: "all_private_chats" }
  | { type: "all_group_chats" };

const SCOPES: Scope[] = [
  { type: "default" },
  { type: "all_private_chats" },
  { type: "all_group_chats" },
];

async function forceReregister(bot: Telegraf): Promise<void> {
  const commands = getBotCommands();

  logger.info(
    `Force re-registering ${commands.length} commands: ${commands.map((c) => c.command).join(", ")}`,
  );

  // 1) Clear webhook so BotFather / clients talk to polling cleanly
  await bot.telegram.deleteWebhook({ drop_pending_updates: true });
  logger.info("Webhook cleared");

  // 2) Delete existing menus on every scope
  for (const scope of SCOPES) {
    await bot.telegram.deleteMyCommands({ scope });
    logger.info(`deleteMyCommands OK (${scope.type})`);
  }

  // Brief pause so Telegram clients drop the old cached menu
  await new Promise((r) => setTimeout(r, 1500));

  // 3) Push the full menu again
  for (const scope of SCOPES) {
    await bot.telegram.setMyCommands(commands, { scope });
    logger.info(
      `setMyCommands OK (${scope.type}): ${commands.map((c) => `/${c.command}`).join(" ")}`,
    );
  }

  // 4) Verify required commands are present
  const required = ["community", "launch", "buy", "countdown", "airdrop"];
  const verified = await bot.telegram.getMyCommands();
  const names = verified.map((c) => c.command);
  const missing = required.filter((name) => !names.includes(name));

  if (missing.length > 0) {
    throw new Error(`Missing after force sync: ${missing.join(", ")}`);
  }

  logger.info(
    `Verified (${verified.length}): ${verified.map((c) => `/${c.command}`).join(" ")}`,
  );
}

async function main(): Promise<void> {
  const bot = new Telegraf(env.telegramBotToken);
  await forceReregister(bot);
  logger.info("Force command re-registration complete");
}

main().catch((error) => {
  logger.error("syncCommands failed", error);
  process.exit(1);
});
