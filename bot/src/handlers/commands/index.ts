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

export function registerCommands(bot: Telegraf): void {
  registerHelp(bot);
  registerPlay(bot);
  registerWebsite(bot);
  registerSocials(bot);
  registerCommunity(bot);
  registerMeme(bot);
  registerNews(bot);
  registerLeaderboard(bot);
  registerGiveaway(bot);
  registerAirdrop(bot);
  registerCountdown(bot);
  registerLaunch(bot);
  registerBuy(bot);
  registerPrice(bot);
  registerRoadmap(bot);
}
