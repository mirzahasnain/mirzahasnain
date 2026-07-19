"use client";

import { DailyChallengePopup } from "@/components/game/DailyChallengePopup";
import { EndScreen } from "@/components/game/EndScreen";
import { GameCanvas } from "@/components/game/GameCanvas";
import { GameHUD } from "@/components/game/GameHUD";
import { StartScreen } from "@/components/game/StartScreen";
import { gameBus } from "@/game/events";
import { GAME } from "@/lib/game/constants";
import { futureFeatures } from "@/lib/game/future";
import {
  saveScore,
  setUsername,
  shouldShowDailyChallenge,
  getUsername,
} from "@/lib/game/storage";
import type { GamePhase } from "@/lib/game/types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export function GameShell() {
  const [phase, setPhase] = useState<GamePhase>("start");
  const [ready, setReady] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME.durationSeconds);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [dailyOpen, setDailyOpen] = useState(false);

  useEffect(() => {
    const offScore = gameBus.onScore(setScore);
    const offTime = gameBus.onTime(setTimeLeft);
    const offOver = gameBus.onGameOver((finalScore) => {
      setScore(finalScore);
      setPhase("ended");
      saveScore(finalScore, getUsername());
      void futureFeatures.completeMission?.("daily-catch");
      if (finalScore >= GAME.dailyChallengeTarget) {
        void futureFeatures.unlockAchievement?.("score-100");
      }
    });
    return () => {
      offScore();
      offTime();
      offOver();
    };
  }, []);

  const handleReady = useCallback(() => setReady(true), []);

  const startWithCountdown = useCallback(async () => {
    setUsername(getUsername());
    setScore(0);
    setTimeLeft(GAME.durationSeconds);
    setPhase("countdown");
    for (let n = 3; n >= 1; n -= 1) {
      setCountdown(n);
      await new Promise((r) => setTimeout(r, 700));
    }
    setCountdown(null);
    setPhase("playing");
    gameBus.requestStart();
  }, []);

  const playAgain = useCallback(() => {
    setDailyOpen(false);
    void startWithCountdown();
  }, [startWithCountdown]);

  const showDaily = useCallback(() => {
    if (shouldShowDailyChallenge()) setDailyOpen(true);
  }, []);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-space-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(62,203,255,0.12),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.16),transparent_40%),linear-gradient(180deg,#030014_0%,#07061a_50%,#030014_100%)]" />

      <GameCanvas onReady={handleReady} interactive={phase === "playing"} />

      {/* Soft center mascot watermark while playing */}
      {phase === "playing" ? (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[12%] z-10 -translate-x-1/2 opacity-25"
          animate={{ y: [0, -8, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/game/nibbo-sm.webp"
            alt=""
            width={96}
            height={96}
            className="drop-shadow-[0_0_20px_rgba(62,203,255,0.5)]"
          />
        </motion.div>
      ) : null}

      <GameHUD
        score={score}
        timeLeft={timeLeft}
        visible={phase === "playing" || phase === "countdown"}
        countdown={countdown}
      />

      <AnimatePresence mode="wait">
        {phase === "start" ? (
          <StartScreen key="start" onPlay={startWithCountdown} ready={ready} />
        ) : null}
        {phase === "ended" ? (
          <EndScreen
            key="end"
            score={score}
            onPlayAgain={playAgain}
            onShowDaily={showDaily}
          />
        ) : null}
      </AnimatePresence>

      <DailyChallengePopup
        open={dailyOpen}
        score={score}
        onClose={() => setDailyOpen(false)}
      />
    </div>
  );
}
