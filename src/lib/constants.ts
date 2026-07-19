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
  email: "mailto:hello@nibbo.fun",
  github: "https://github.com/mirzahasnain/mirzahasnain",
} as const;

/** Replace this string with the live contract address on launch day. */
export const CONTRACT_ADDRESS = "COMING ON LAUNCH DAY";

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Community", href: "#community" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
] as const;

export const HERO_CTAS = [
  { label: "Buy on Pump.fun", href: LINKS.pumpfun, emoji: "🟣", variant: "gradient" as const },
  { label: "Follow on X", href: LINKS.twitter, emoji: "❌", variant: "outline" as const },
  { label: "Instagram", href: LINKS.instagram, emoji: "📸", variant: "outline" as const },
  { label: "Join Telegram", href: LINKS.telegram, emoji: "✈️", variant: "outline" as const },
] as const;

export const TOKEN_INFO = [
  { label: "Network", value: "Solana" },
  { label: "Launch Date", value: "26 July 2026" },
  { label: "Launch Time", value: "9:00 PM UTC" },
  { label: "Launchpad", value: "Pump.fun" },
  { label: "Status", value: "Launching Soon" },
] as const;

export const TOKENOMICS = [
  { label: "Total Supply", value: "100%" },
  { label: "Taxes", value: "0%" },
  { label: "Mint", value: "Revoked" },
  { label: "Freeze", value: "Disabled" },
  { label: "Liquidity", value: "Locked" },
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

export const FAQ_ITEMS = [
  {
    question: "What is NIBBO?",
    answer:
      "NIBBO is a mysterious blue kitten from another galaxy who landed on Solana to spread memes, fun, and community across the crypto universe.",
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
