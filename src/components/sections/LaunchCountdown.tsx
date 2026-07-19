"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

/** Official launch: 26 July 2026, 9:00 PM UTC */
export const LAUNCH_AT_UTC = Date.UTC(2026, 6, 26, 21, 0, 0);

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

function getTimeLeft(now: number): TimeLeft {
  const total = Math.max(0, LAUNCH_AT_UTC - now);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { days, hours, minutes, seconds, total };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

export function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const isLive = timeLeft !== null && timeLeft.total <= 0;

  const units = useMemo(
    () =>
      UNITS.map((unit) => ({
        ...unit,
        value: timeLeft ? pad(timeLeft[unit.key]) : "--",
      })),
    [timeLeft]
  );

  return (
    <motion.div
      className="glass-strong relative mt-7 max-w-xl overflow-hidden rounded-2xl p-5 sm:p-6"
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, delay: 0.48, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-neon-blue/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-neon-purple/20 blur-3xl" />

      <div className="relative">
        <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.28em] text-neon-blue sm:text-xs">
          🚀 Official Token Launch
        </p>

        <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-4">
          <p className="font-heading text-2xl font-bold tracking-wide text-white sm:text-3xl">
            26 JULY 2026
          </p>
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-neon-pink sm:text-base">
            9:00 PM (UTC)
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isLive ? (
            <motion.div
              key="live"
              className="mt-5 rounded-xl border border-neon-pink/40 bg-neon-pink/10 px-4 py-5 text-center shadow-[0_0_30px_rgba(255,107,203,0.2)]"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-heading text-xl font-bold tracking-[0.12em] text-gradient sm:text-2xl">
                🚀 NIBBO IS LIVE!
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="countdown"
              className="mt-5 grid grid-cols-4 gap-2 sm:gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {units.map((unit, index) => (
                <motion.div
                  key={unit.key}
                  className="glass rounded-xl px-1 py-3 text-center sm:px-2 sm:py-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + index * 0.06, duration: 0.4 }}
                >
                  <motion.span
                    key={`${unit.key}-${unit.value}`}
                    className="block font-heading text-2xl font-bold tabular-nums text-white sm:text-3xl md:text-4xl"
                    initial={{ opacity: 0.55, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {unit.value}
                  </motion.span>
                  <span className="mt-1 block font-heading text-[9px] uppercase tracking-[0.18em] text-text-muted sm:text-[10px]">
                    {unit.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 space-y-1.5 border-t border-white/10 pt-4">
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-white sm:text-base">
            🐾 Born Weird. Built To Meme.
          </p>
          <p className="text-sm leading-relaxed text-text-muted sm:text-base">
            Be there from Day One.
            <br className="sm:hidden" /> Join the NIBBO Army before launch.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
