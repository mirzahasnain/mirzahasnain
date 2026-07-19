export const SITE = {
  name: "NIBBO",
  tagline: "Born Weird. Built to Meme.",
  description:
    "A mysterious little creature from another galaxy that landed on Solana to spread memes, fun, and community.",
  year: 2026,
} as const;

export const LINKS = {
  buy: "https://pump.fun",
  telegram: "https://t.me/nibboarmy",
  twitter: "https://x.com/realnibbo",
  instagram: "https://instagram.com/nibbocoin",
  pumpfun: "https://pump.fun",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Community", href: "#community" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
] as const;

export const TOKEN_INFO = [
  { label: "Name", value: "NIBBO" },
  { label: "Ticker", value: "NIBBO" },
  { label: "Chain", value: "Solana" },
  { label: "Tax", value: "0%" },
  { label: "Launch", value: "Fair Launch" },
  { label: "Supply", value: "TBA" },
] as const;

export const WHY_CARDS = [
  {
    icon: "Rocket",
    title: "Built on Solana",
    description: "Ultra-fast, low-fee transactions ready for meme culture at scale.",
  },
  {
    icon: "Zap",
    title: "Lightning Fast",
    description: "Instant vibes. Instant trades. Zero patience required.",
  },
  {
    icon: "Laugh",
    title: "Meme Powered",
    description: "Fueled by chaos, creativity, and internet weirdness.",
  },
  {
    icon: "Heart",
    title: "Community First",
    description: "Built by degens, for degens. The army runs the show.",
  },
] as const;

export const ROADMAP = [
  {
    phase: "Phase 1",
    title: "Ignition",
    items: ["Create Community", "Launch", "Memes"],
  },
  {
    phase: "Phase 2",
    title: "Orbit",
    items: ["Dex Screener", "CoinGecko", "10k Holders"],
  },
  {
    phase: "Phase 3",
    title: "Galaxy",
    items: ["Partnerships", "Listings", "Global Community"],
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "What is NIBBO?",
    answer:
      "NIBBO is a mysterious internet creature that landed on Solana to spread memes, fun, and community. Not a cat. Not a bear. Not an alien. Just pure meme energy.",
  },
  {
    question: "How to buy?",
    answer:
      "Get a Solana wallet, fund it with SOL, head to Pump.fun, search for NIBBO, and ape in. Always double-check the contract before buying.",
  },
  {
    question: "Why Solana?",
    answer:
      "Solana delivers lightning-fast transactions and near-zero fees — perfect for a meme coin built for speed, chaos, and community.",
  },
] as const;
