export const GAME = {
  id: "nibbo-catch",
  title: "NIBBO CATCH!",
  tagline: "Catch NIBBO before time runs out!",
  durationSeconds: 30,
  chaosStartSeconds: 10,
  difficultyIntervalSeconds: 5,
  dailyChallengeTarget: 100,
  playUrl: "https://nibbo.fun/play",
  twitterHandle: "@RealNibbo",
  storageKeys: {
    username: "nibbo-catch-username",
    scores: "nibbo-catch-scores",
    dailyChallengeDate: "nibbo-catch-daily-date",
  },
} as const;

export const DIFFICULTY = {
  baseSpawnMs: 900,
  minSpawnMs: 280,
  spawnStepMs: 90,
  baseMoveSpeed: 40,
  moveSpeedStep: 28,
  chaosSpawnMs: 220,
  chaosMoveSpeed: 160,
  maxActiveNibbos: 8,
} as const;

export const SHARE = {
  buildText: (score: number) =>
    `I scored ${score} points in NIBBO Catch!\n\nCan you beat me?\n\n${GAME.playUrl}\n\n${GAME.twitterHandle}`,
} as const;
