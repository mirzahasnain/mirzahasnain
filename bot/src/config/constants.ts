const DEFAULT_WEBSITE = "https://nibbo.fun";

function websiteBase(): string {
  return (process.env.WEBSITE_URL?.trim() || DEFAULT_WEBSITE).replace(/\/$/, "");
}

export const BRAND = {
  name: "NIBBO",
  tagline: "Born Weird. Built To Meme.",
  description:
    "A mysterious little blue kitten from another galaxy who landed on Solana to spread memes, fun, and community.",
  emoji: "💙",
  army: "NIBBO Army",
} as const;

/** Official launch window (UTC) */
export const LAUNCH = {
  label: "26 July 2026 · 9:00 PM UTC",
  /** ISO timestamp used by /countdown */
  atIso: "2026-07-26T21:00:00.000Z",
  launchpad: "Pump.fun",
  network: "Solana",
} as const;

export const LINKS = {
  get website() {
    return websiteBase();
  },
  get play() {
    return `${websiteBase()}/play`;
  },
  get leaderboard() {
    return `${websiteBase()}/play/leaderboard`;
  },
  telegram: "https://t.me/nibbocommunity",
  twitter: "https://x.com/RealNibbo",
  instagram: "https://instagram.com/nibbocoin",
  pumpfun: "https://pump.fun",
  email: "hello@nibbo.fun",
};

export const ROADMAP = [
  {
    phase: "Phase 1",
    title: "Foundation",
    items: ["Website", "Social Media", "Community"],
  },
  {
    phase: "Phase 2",
    title: "Launch",
    items: ["Token Launch", "Pump.fun", "1000 Holders"],
  },
  {
    phase: "Phase 3",
    title: "Expansion",
    items: ["CoinGecko", "CoinMarketCap", "Partnerships"],
  },
  {
    phase: "Phase 4",
    title: "Galaxy",
    items: ["Meme Expansion", "NFT Collection", "Global Community"],
  },
] as const;

export const MEMES = [
  "NIBBO sees chart. NIBBO becomes chart. 📈💙",
  "First build. Then moon. Then nap. 😴🚀",
  "Meow means buy. Hiss means… still buy. 🐾",
  "Wen moon? Wen NIBBO says so. 🌕",
  "Born Weird. Built To Meme. Wired for chaos. ⚡",
  "Paper hands get cat stares. Diamond paws only. 💎🐾",
  "Solana speed. Kitten energy. Unstoppable vibes. ⚡💙",
  "NIBBO didn't fall from the sky. NIBBO *chose* this timeline. 👽",
  "Touch grass? Nah. Touch NIBBO. 🌱→💙",
  "If lost, return to the NIBBO Army. Reward: vibes. 🫡",
] as const;

export const NEWS_UPDATES = [
  {
    title: "Website is live",
    body: "The mothership has landed — check nibbo.fun for the full NIBBO experience.",
  },
  {
    title: "Play NIBBO",
    body: "Jump into the mini-game and climb the leaderboard. High scores = high vibes.",
  },
  {
    title: "Launch window",
    body: `Token launch is set for ${LAUNCH.label} on Pump.fun. Stay ready, Army.`,
  },
  {
    title: "Community growing",
    body: "Telegram + X are buzzing. Bring your memes. Bring your friends.",
  },
] as const;

export const GIVEAWAY_INFO = {
  status: "Watch this space",
  howToEnter: [
    "Join the NIBBO Telegram",
    "Follow @RealNibbo on X",
    "Drop your best NIBBO meme in chat",
    "Stay active — the Army rewards vibes",
  ],
  note: "Official giveaways are announced only by NIBBO mods. Beware of scammers!",
} as const;

export const AIRDROP_INFO = {
  status: "Coming Soon",
  howToQualify: [
    "Join https://t.me/nibbocommunity",
    "Follow https://x.com/RealNibbo",
    "Stay active — memes & vibes count",
    "Watch for official announcements only",
  ],
  note: "NIBBO never DMs first asking for seeds, SOL, or wallet connect links.",
} as const;

/** BotFather command list for setMyCommands */
export const BOT_COMMANDS = [
  { command: "help", description: "Show all commands & vibes" },
  { command: "play", description: "Play the NIBBO mini-game" },
  { command: "website", description: "Visit nibbo.fun" },
  { command: "socials", description: "Follow NIBBO everywhere" },
  { command: "community", description: "Join the NIBBO community" },
  { command: "meme", description: "Get a random NIBBO meme" },
  { command: "news", description: "Latest NIBBO updates" },
  { command: "leaderboard", description: "Game high scores" },
  { command: "giveaway", description: "Giveaway info" },
  { command: "airdrop", description: "Airdrop status & tips" },
  { command: "countdown", description: "Time until NIBBO launch" },
  { command: "launch", description: "Launch details" },
  { command: "buy", description: "How to buy NIBBO" },
  { command: "price", description: "NIBBO token price" },
  { command: "roadmap", description: "The path to the galaxy" },
] as const;

export const FUN_REPLY_HINTS = [
  "GM",
  "GN",
  "Hello",
  "Wen Moon",
  "Bullish",
  "LFG",
  "NIBBO",
] as const;
