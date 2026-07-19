export type GamePhase = "start" | "countdown" | "playing" | "ended";

export type LeaderboardPeriod = "daily" | "weekly" | "all";

export type LeaderboardEntry = {
  id: string;
  username: string;
  score: number;
  rank: number;
  createdAt: number;
  period: LeaderboardPeriod;
};

export type GameHudState = {
  score: number;
  timeLeft: number;
  phase: GamePhase;
};

export type GameBridgeEvents = {
  onScore: (score: number) => void;
  onTime: (timeLeft: number) => void;
  onGameOver: (score: number) => void;
  onReady: () => void;
};

export type FutureFeatureHook = {
  walletConnect?: () => Promise<void>;
  claimRewards?: (score: number) => Promise<void>;
  completeMission?: (missionId: string) => Promise<void>;
  unlockAchievement?: (achievementId: string) => Promise<void>;
  trackReferral?: (code: string) => Promise<void>;
  mintNftReward?: (score: number) => Promise<void>;
  joinTournament?: (tournamentId: string) => Promise<void>;
};
