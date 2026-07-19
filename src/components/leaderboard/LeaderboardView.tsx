"use client";

import {
  ensureSeedLeaderboard,
  filterScores,
  getAllScores,
} from "@/lib/game/storage";
import type { LeaderboardEntry, LeaderboardPeriod } from "@/lib/game/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const TABS: { id: LeaderboardPeriod; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "all", label: "All Time" },
];

export function LeaderboardView() {
  const [period, setPeriod] = useState<LeaderboardPeriod>("daily");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    ensureSeedLeaderboard();
    setEntries(getAllScores());
  }, []);

  const rows = useMemo(() => filterScores(entries, period), [entries, period]);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-space-950 px-4 pb-16 pt-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(62,203,255,0.14),transparent_45%),radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.16),transparent_40%)]" />

      <div className="relative mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="font-heading text-[10px] uppercase tracking-[0.28em] text-neon-blue">
              NIBBO Catch
            </p>
            <h1 className="mt-1 font-heading text-3xl font-black tracking-[0.08em] text-white">
              Leaderboard
            </h1>
          </div>
          <Link
            href="/play"
            className="btn-gradient rounded-xl px-4 py-2.5 font-heading text-xs font-bold tracking-[0.14em]"
          >
            Play
          </Link>
        </div>

        <div className="glass-strong mb-5 grid grid-cols-3 gap-1 rounded-2xl p-1.5">
          {TABS.map((tab) => {
            const active = period === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPeriod(tab.id)}
                className={`relative rounded-xl py-2.5 font-heading text-xs uppercase tracking-[0.16em] transition ${
                  active ? "text-white" : "text-text-muted hover:text-white"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="lb-tab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-blue/30 via-neon-purple/25 to-neon-pink/25"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="glass overflow-hidden rounded-3xl">
          <div className="grid grid-cols-[56px_1fr_72px] gap-2 border-b border-white/10 px-4 py-3 font-heading text-[10px] uppercase tracking-[0.2em] text-text-muted sm:px-5">
            <span>Rank</span>
            <span>Username</span>
            <span className="text-right">Score</span>
          </div>

          {rows.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-text-muted">
              No scores yet for this period. Be the first!
            </p>
          ) : (
            <ul>
              {rows.slice(0, 50).map((row, i) => (
                <motion.li
                  key={row.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-[56px_1fr_72px] items-center gap-2 border-b border-white/5 px-4 py-3.5 sm:px-5"
                >
                  <span
                    className={`font-heading text-sm font-bold ${
                      row.rank === 1
                        ? "text-neon-blue"
                        : row.rank === 2
                          ? "text-neon-pink"
                          : row.rank === 3
                            ? "text-neon-purple"
                            : "text-text-muted"
                    }`}
                  >
                    #{row.rank}
                  </span>
                  <span className="truncate text-sm font-medium text-white">
                    {row.username}
                  </span>
                  <span className="text-right font-heading text-sm font-bold tabular-nums text-neon-blue-soft">
                    {row.score}
                  </span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-text-muted">
          Scores are saved locally for now. Global leaderboards coming with Wallet Connect.
        </p>
      </div>
    </div>
  );
}
