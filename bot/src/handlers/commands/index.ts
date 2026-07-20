import type { Telegraf } from "telegraf";
import { registerHelp } from "./help.js";
import { registerPlay } from "./play.js";
import { registerWebsite } from "./website.js";
import { registerSocials } from "./socials.js";
import { registerCommunity } from "./community.js";
import { registerMeme } from "./meme.js";
import { registerNews } from "./news.js";
import { registerLeaderboard } from "./leaderboard.js";
import { registerGiveaway } from "./giveaway.js";
import { registerAirdrop } from "./airdrop.js";
import { registerCountdown } from "./countdown.js";
import { registerLaunch } from "./launch.js";
import { registerBuy } from "./buy.js";
import { registerPrice } from "./price.js";
import { registerRoadmap } from "./roadmap.js";

/**
 * Every slash command the bot understands.
 * If you add a command file, import + call it here.
 */
export function registerCommands(bot: Telegraf): void {
  registerHelp(bot); // /help /start
  registerPlay(bot); // /play
  registerWebsite(bot); // /website
  registerSocials(bot); // /socials
  registerCommunity(bot); // /community
  registerMeme(bot); // /meme
  registerNews(bot); // /news
  registerLeaderboard(bot); // /leaderboard
  registerGiveaway(bot); // /giveaway
  registerAirdrop(bot); // /airdrop
  registerCountdown(bot); // /countdown
  registerLaunch(bot); // /launch
  registerBuy(bot); // /buy
  registerPrice(bot); // /price
  registerRoadmap(bot); // /roadmap
}

/** Runtime checklist used by startup verification */
export const REQUIRED_COMMAND_HANDLERS = [
  "help",
  "play",
  "website",
  "socials",
  "community",
  "meme",
  "news",
  "leaderboard",
  "giveaway",
  "airdrop",
  "countdown",
  "launch",
  "buy",
  "price",
  "roadmap",
] as const;
