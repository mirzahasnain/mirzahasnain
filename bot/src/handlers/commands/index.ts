import type { Telegraf } from "telegraf";
import { registerHelp } from "./help.js";
import { registerPlay } from "./play.js";
import { registerWebsite } from "./website.js";
import { registerSocials } from "./socials.js";
import { registerMeme } from "./meme.js";
import { registerNews } from "./news.js";
import { registerLeaderboard } from "./leaderboard.js";
import { registerGiveaway } from "./giveaway.js";
import { registerPrice } from "./price.js";
import { registerRoadmap } from "./roadmap.js";

export function registerCommands(bot: Telegraf): void {
  registerHelp(bot);
  registerPlay(bot);
  registerWebsite(bot);
  registerSocials(bot);
  registerMeme(bot);
  registerNews(bot);
  registerLeaderboard(bot);
  registerGiveaway(bot);
  registerPrice(bot);
  registerRoadmap(bot);
}
