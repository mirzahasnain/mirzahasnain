import { BRAND, LAUNCH, LINKS } from "../config/constants.js";
import { env } from "../config/env.js";

export function isTokenLive(): boolean {
  return Boolean(env.tokenMint);
}

/** Shared Coming Soon copy when TOKEN_MINT is not set */
export function comingSoonMessage(feature: "price" | "buy"): string {
  const title = feature === "price" ? "💰 NIBBO Price" : "🛒 Buy NIBBO";

  return [
    `<b>${title}</b>`,
    "",
    "<b>Coming Soon</b> 🌌",
    "",
    "The mint isn't live yet — charts and buy links unlock at launch.",
    "",
    `<b>Launch:</b> ${LAUNCH.label}`,
    `<b>Launchpad:</b> ${LAUNCH.launchpad}`,
    `<b>Network:</b> ${LAUNCH.network}`,
    "",
    `<i>${BRAND.tagline}</i>`,
    "",
    `Stay ready → ${LINKS.website}`,
    "First build. Then moon. 🚀",
  ].join("\n");
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "0d 0h 0m 0s";

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export function msUntilLaunch(now = Date.now()): number {
  return new Date(LAUNCH.atIso).getTime() - now;
}

export function buyUrl(): string {
  if (env.tokenMint) {
    return `${LINKS.pumpfun}/${env.tokenMint}`;
  }
  return LINKS.pumpfun;
}
