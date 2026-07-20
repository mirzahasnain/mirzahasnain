import { BRAND } from "../config/constants.js";

/** Escape text for Telegram HTML parse mode */
export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function mentionHtml(userId: number, name: string): string {
  return `<a href="tg://user?id=${userId}">${escapeHtml(name)}</a>`;
}

export function displayName(
  from: { first_name?: string; last_name?: string; username?: string } | undefined,
): string {
  if (!from) return "friend";
  const full = [from.first_name, from.last_name].filter(Boolean).join(" ").trim();
  if (full) return full;
  if (from.username) return `@${from.username}`;
  return "friend";
}

export const PARSE_HTML = { parse_mode: "HTML" as const };

export function brandedHeader(subtitle?: string): string {
  const line = subtitle ? `\n${subtitle}` : "";
  return `<b>${BRAND.name}</b> ${BRAND.emoji}${line}`;
}
