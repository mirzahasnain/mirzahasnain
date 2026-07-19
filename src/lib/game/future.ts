/**
 * Future-ready hooks for wallet, rewards, missions, achievements,
 * referrals, NFT drops, and tournament mode. Wire these into real
 * backends without restructuring the game loop.
 */
import type { FutureFeatureHook } from "./types";

export const futureFeatures: FutureFeatureHook = {
  walletConnect: async () => {
    console.info("[NIBBO] Wallet Connect coming soon");
  },
  claimRewards: async (score) => {
    console.info("[NIBBO] Claim rewards stub", score);
  },
  completeMission: async (missionId) => {
    console.info("[NIBBO] Mission complete stub", missionId);
  },
  unlockAchievement: async (achievementId) => {
    console.info("[NIBBO] Achievement stub", achievementId);
  },
  trackReferral: async (code) => {
    console.info("[NIBBO] Referral stub", code);
  },
  mintNftReward: async (score) => {
    console.info("[NIBBO] NFT reward stub", score);
  },
  joinTournament: async (tournamentId) => {
    console.info("[NIBBO] Tournament stub", tournamentId);
  },
};

export const FUTURE_ROADMAP = [
  "Wallet Connect",
  "NIBBO rewards",
  "Daily missions",
  "Achievements",
  "Referral system",
  "NFT rewards",
  "Tournament mode",
] as const;
