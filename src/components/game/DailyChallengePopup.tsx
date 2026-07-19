"use client";

import { GAME } from "@/lib/game/constants";
import { markDailyChallengeSeen } from "@/lib/game/storage";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  open: boolean;
  score: number;
  onClose: () => void;
};

export function DailyChallengePopup({ open, score, onClose }: Props) {
  const hit = score >= GAME.dailyChallengeTarget;

  const close = () => {
    markDailyChallengeSeen();
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Daily Challenge"
        >
          <motion.div
            className="glass-strong relative z-10 w-full max-w-sm overflow-hidden rounded-3xl p-6 text-center shadow-[0_0_50px_rgba(168,85,247,0.25)]"
            initial={{ scale: 0.85, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon-pink/20 blur-3xl" />
            <p className="text-3xl">🎁</p>
            <h3 className="mt-2 font-heading text-xl font-bold tracking-[0.12em] text-white">
              Daily Challenge
            </h3>
            <p className="mt-3 text-sm text-text-muted">
              Score {GAME.dailyChallengeTarget}
            </p>
            <p className="mt-1 font-heading text-3xl font-black text-neon-blue">
              {Math.min(score, GAME.dailyChallengeTarget)} / {GAME.dailyChallengeTarget}
            </p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="font-heading text-[10px] uppercase tracking-[0.22em] text-text-muted">
                Reward
              </p>
              <p className="mt-1 text-sm font-semibold text-neon-pink">Coming Soon</p>
              {hit ? (
                <p className="mt-2 text-xs text-neon-blue-soft">
                  Challenge cleared! Rewards unlock soon.
                </p>
              ) : (
                <p className="mt-2 text-xs text-text-muted">
                  Keep catching — you&apos;re almost there.
                </p>
              )}
            </div>
            <button
              type="button"
              className="btn-gradient relative z-20 mt-5 w-full rounded-xl py-3 font-heading text-sm font-bold tracking-[0.16em]"
              onClick={close}
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
