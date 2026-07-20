import type { Telegraf } from "telegraf";
import type { BotCommand } from "telegraf/types";
import { BOT_COMMANDS } from "../config/constants.js";
import {
  REQUIRED_COMMAND_HANDLERS,
  registerCommands as registerCommandHandlers,
} from "../handlers/commands/index.js";
import { logger } from "../utils/logger.js";

/** Canonical command menu sent to Telegram via setMyCommands */
export function getBotCommands(): BotCommand[] {
  return BOT_COMMANDS.map(({ command, description }) => ({
    command,
    description,
  }));
}

function assertHandlersCoverMenu(): void {
  const menu = BOT_COMMANDS.map((c) => c.command);
  const handlers = [...REQUIRED_COMMAND_HANDLERS];

  const missingHandlers = menu.filter((name) => !handlers.includes(name));
  const extraHandlers = handlers.filter(
    (name) => !(menu as readonly string[]).includes(name),
  );

  if (missingHandlers.length > 0 || extraHandlers.length > 0) {
    throw new Error(
      `Command menu/handler mismatch. Missing handlers: [${missingHandlers.join(", ")}] Extra handlers: [${extraHandlers.join(", ")}]`,
    );
  }
}

/**
 * Register every slash-command handler on the Telegraf instance.
 * Keep this as the single entry used by createBot().
 */
export function attachCommandHandlers(bot: Telegraf): void {
  assertHandlersCoverMenu();
  registerCommandHandlers(bot);

  const registered = getBotCommands()
    .map((c) => c.command)
    .join(", ");
  logger.info(`Command handlers attached: ${registered}`);
}

/**
 * Push the full command menu to Telegram (default + private + groups).
 * Deletes any previous menu first so BotFather / clients pick up new commands.
 * Call on every startup so menus stay in sync.
 */
export async function syncTelegramCommandMenu(bot: Telegraf): Promise<void> {
  assertHandlersCoverMenu();
  const commands = getBotCommands();

  const scopes: Array<
    | { type: "default" }
    | { type: "all_private_chats" }
    | { type: "all_group_chats" }
  > = [
    { type: "default" },
    { type: "all_private_chats" },
    { type: "all_group_chats" },
  ];

  for (const scope of scopes) {
    await bot.telegram.deleteMyCommands({ scope });
  }

  for (const scope of scopes) {
    await bot.telegram.setMyCommands(commands, { scope });
    logger.info(
      `setMyCommands OK (${scope.type}): ${commands.map((c) => c.command).join(", ")}`,
    );
  }

  const verified = await bot.telegram.getMyCommands();
  const required = ["community", "launch", "buy", "countdown", "airdrop"];
  const missing = required.filter(
    (name) => !verified.some((c) => c.command === name),
  );

  if (missing.length > 0) {
    throw new Error(
      `Telegram command menu missing after sync: ${missing.join(", ")}`,
    );
  }

  logger.info(
    `Telegram command menu verified (${verified.length}): ${verified.map((c) => c.command).join(", ")}`,
  );
}
