"use client";

import { SolanaParticles } from "@/components/game/SolanaParticles";
import { GAME } from "@/lib/game/constants";
import { shareOnX } from "@/lib/game/share";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Props = {
  score: number;
  onPlayAgain: () => void;
  onShowDaily: () => void;
};

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: `${(i * 17) % 100}%`,
        delay: (i % 10) * 0.08,
        color:
          i % 4 === 0
            ? "#3ecbff"
            : i % 4 === 1
              ? "#a855f7"
              : i % 4 === 2
                ? "#ff6bcb"
                : "#00ffa3",
        rotate: (i * 47) % 360,
      })),
    []
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-[-10%] h-2.5 w-2.5 rounded-sm"
          style={{ left: p.left, background: p.color }}
          initial={{ y: 0, opacity: 1, rotate: p.rotate }}
          animate={{ y: 900, opacity: [1, 1, 0], rotate: p.rotate + 420 }}
          transition={{ duration: 2.4, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function EndScreen({ score, onPlayAgain, onShowDaily }: Props) {
  const [username, setUsername] = useState("Player");

  useEffect(() => {
    const t = window.setTimeout(() => onShowDaily(), 700);
    return () => window.clearTimeout(t);
  }, [onShowDaily]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GAME.storageKeys.username);
      if (stored) setUsername(stored);
    } catch {
      // ignore
    }
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center overflow-hidden px-5 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Confetti />
      <SolanaParticles count={10} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.2),transparent_50%),rgba(3,0,20,0.72)]" />

      <motion.div
        animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-2"
      >
        <Image
          src="/game/nibbo-hero.webp"
          alt="Happy NIBBO"
          width={180}
          height={180}
          className="drop-shadow-[0_0_40px_rgba(255,107,203,0.45)]"
        />
      </motion.div>

      <motion.h2
        className="font-heading text-3xl font-black tracking-[0.12em] text-gradient sm:text-5xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        TIME&apos;S UP!
      </motion.h2>

      <p className="mt-4 font-heading text-xs uppercase tracking-[0.28em] text-text-muted">
        Your Score
      </p>
      <motion.p
        className="font-heading text-6xl font-black tabular-nums text-white sm:text-7xl"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
      >
        {score}
      </motion.p>

      <label className="mt-5 flex w-full max-w-xs flex-col gap-1.5 text-left">
        <span className="font-heading text-[10px] uppercase tracking-[0.22em] text-text-muted">
          Username
        </span>
        <input
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            try {
              localStorage.setItem(GAME.storageKeys.username, e.target.value);
            } catch {
              // ignore
            }
          }}
          maxLength={16}
          className="glass rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none ring-neon-blue/40 focus:ring-2"
          placeholder="Your name"
        />
      </label>

      <div className="mt-6 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
        <motion.button
          type="button"
          onClick={onPlayAgain}
          className="btn-gradient flex-1 rounded-2xl px-6 py-3.5 font-heading text-sm font-bold tracking-[0.16em]"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Play Again
        </motion.button>
        <motion.button
          type="button"
          onClick={() => shareOnX(score)}
          className="btn-outline-glow flex-1 rounded-2xl px-6 py-3.5 font-heading text-sm font-bold tracking-[0.16em]"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Share on X
        </motion.button>
      </div>

      <Link
        href="/play/leaderboard"
        className="mt-5 font-heading text-xs uppercase tracking-[0.22em] text-neon-blue transition hover:text-neon-pink"
      >
        View Leaderboard →
      </Link>
    </motion.div>
  );
}
