"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  score: number;
  timeLeft: number;
  visible: boolean;
  countdown?: number | null;
};

export function GameHUD({ score, timeLeft, visible, countdown }: Props) {
  const urgent = timeLeft <= 10;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pt-4 sm:px-6 sm:pt-5"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className={`glass-strong rounded-2xl px-4 py-2.5 ${urgent ? "border-neon-pink/40 shadow-[0_0_24px_rgba(255,107,203,0.25)]" : ""}`}>
              <p className="font-heading text-[10px] uppercase tracking-[0.25em] text-text-muted">
                Timer
              </p>
              <p className={`font-heading text-2xl font-bold tabular-nums ${urgent ? "text-neon-pink" : "text-neon-blue"}`}>
                ⏱ {timeLeft}s
              </p>
            </div>

            <div className="glass-strong rounded-2xl px-4 py-2.5 text-right">
              <p className="font-heading text-[10px] uppercase tracking-[0.25em] text-text-muted">
                Score
              </p>
              <p className="font-heading text-2xl font-bold tabular-nums text-white">
                ⭐ {score}
              </p>
            </div>
          </div>

          <AnimatePresence>
            {countdown != null && countdown > 0 ? (
              <motion.div
                key={countdown}
                className="pointer-events-none absolute left-1/2 top-[28vh] -translate-x-1/2 font-heading text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(62,203,255,0.8)] sm:text-8xl"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {countdown}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
