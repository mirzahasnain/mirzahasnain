import { config as loadEnv } from "dotenv";

loadEnv();

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Copy .env.example to .env and fill it in.`,
    );
  }
  return value;
}

function optional(name: string, fallback = ""): string {
  return process.env[name]?.trim() || fallback;
}

export const env = {
  telegramBotToken: required("TELEGRAM_BOT_TOKEN"),
  websiteUrl: optional("WEBSITE_URL", "https://nibbo.fun").replace(/\/$/, ""),
  tokenMint: optional("TOKEN_MINT"),
  priceApiUrl: optional(
    "PRICE_API_URL",
    "https://api.dexscreener.com/latest/dex/tokens",
  ),
  nodeEnv: optional("NODE_ENV", "development"),
  isProduction: optional("NODE_ENV", "development") === "production",
} as const;
