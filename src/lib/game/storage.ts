"use client";

import { GAME } from "./constants";
import type { LeaderboardEntry, LeaderboardPeriod } from "./types";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getUsername(): string {
  if (typeof window === "undefined") return "Player";
  return localStorage.getItem(GAME.storageKeys.username) || "Player";
}

export function setUsername(username: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GAME.storageKeys.username, username.trim() || "Player");
}

export function getAllScores(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];
  return safeParse<LeaderboardEntry[]>(
    localStorage.getItem(GAME.storageKeys.scores),
    []
  );
}

function startOfDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function startOfWeek(ts: number) {
  const d = new Date(ts);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function filterScores(
  entries: LeaderboardEntry[],
  period: LeaderboardPeriod,
  now = Date.now()
): LeaderboardEntry[] {
  const filtered = entries.filter((e) => {
    if (period === "all") return true;
    if (period === "daily") return e.createdAt >= startOfDay(now);
    return e.createdAt >= startOfWeek(now);
  });

  return filtered
    .sort((a, b) => b.score - a.score || a.createdAt - b.createdAt)
    .map((entry, index) => ({ ...entry, rank: index + 1, period }));
}

export function saveScore(score: number, username?: string): LeaderboardEntry {
  const entry: LeaderboardEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    username: (username || getUsername()).trim() || "Player",
    score,
    rank: 0,
    createdAt: Date.now(),
    period: "all",
  };

  const all = getAllScores();
  all.push(entry);
  localStorage.setItem(GAME.storageKeys.scores, JSON.stringify(all.slice(-500)));
  return entry;
}

export function shouldShowDailyChallenge(): boolean {
  if (typeof window === "undefined") return false;
  const today = new Date().toISOString().slice(0, 10);
  return localStorage.getItem(GAME.storageKeys.dailyChallengeDate) !== today;
}

export function markDailyChallengeSeen() {
  if (typeof window === "undefined") return;
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem(GAME.storageKeys.dailyChallengeDate, today);
}

/** Seed demo leaderboard so the page feels alive on first visit. */
export function ensureSeedLeaderboard() {
  if (typeof window === "undefined") return;
  const existing = getAllScores();
  if (existing.length > 0) return;

  const names = [
    "CosmicKitty",
    "SolDegen",
    "NibboArmy",
    "MemeLord",
    "BlueFluff",
    "NeonPaw",
    "WarpCat",
    "PumpKitten",
  ];
  const now = Date.now();
  const seeded: LeaderboardEntry[] = names.map((username, i) => ({
    id: `seed-${i}`,
    username,
    score: 140 - i * 12 + Math.floor(Math.random() * 8),
    rank: 0,
    createdAt: now - i * 36e5 * (i % 3 === 0 ? 1 : i % 2 === 0 ? 26 : 80),
    period: "all",
  }));
  localStorage.setItem(GAME.storageKeys.scores, JSON.stringify(seeded));
}
