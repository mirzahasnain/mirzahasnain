"use client";

import { SolanaParticles } from "@/components/game/SolanaParticles";
import { GAME } from "@/lib/game/constants";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type Props = {
  onPlay: () => void;
  ready: boolean;
};

export function StartScreen({ onPlay, ready }: Props) {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center px-5 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
    >
      <SolanaParticles />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(62,203,255,0.14),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.18),transparent_50%)]" />

      <motion.div
        className="relative mb-4"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 scale-125 rounded-full bg-neon-blue/20 blur-3xl" />
        <Image
          src="/game/nibbo-hero.webp"
          alt="NIBBO mascot"
          width={220}
          height={220}
          priority
          className="relative drop-shadow-[0_0_35px_rgba(62,203,255,0.45)]"
        />
      </motion.div>

      <motion.h1
        className="font-heading text-4xl font-black tracking-[0.08em] text-gradient sm:text-6xl"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {GAME.title}
      </motion.h1>

      <motion.p
        className="mt-3 max-w-sm text-sm text-text-muted sm:text-base"
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {GAME.tagline}
      </motion.p>

      <motion.button
        type="button"
        disabled={!ready}
        onClick={onPlay}
        className="btn-gradient relative mt-8 rounded-2xl px-12 py-4 font-heading text-lg font-bold tracking-[0.2em] disabled:cursor-wait disabled:opacity-60"
        whileHover={{ scale: ready ? 1.05 : 1 }}
        whileTap={{ scale: ready ? 0.96 : 1 }}
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.28 }}
      >
        {ready ? "PLAY" : "LOADING..."}
      </motion.button>

      <motion.div
        className="mt-6 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Link href="/play/leaderboard" className="transition hover:text-neon-blue">
          Leaderboard
        </Link>
        <span className="opacity-40">•</span>
        <Link href="/" className="transition hover:text-neon-pink">
          Home
        </Link>
      </motion.div>
    </motion.div>
  );
}
