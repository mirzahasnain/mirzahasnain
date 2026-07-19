"use client";

import { useEffect, useRef } from "react";

type Props = {
  onReady: () => void;
  className?: string;
};

export function GameCanvas({ onReady, className = "" }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<{ destroy: (removeCanvas: boolean) => void; scale: { resize: (w: number, h: number) => void } } | null>(null);

  useEffect(() => {
    let destroyed = false;
    let unbindReady: (() => void) | undefined;

    async function boot() {
      if (!hostRef.current || gameRef.current) return;

      const [{ default: Phaser }, { createGameConfig }, { gameBus }] =
        await Promise.all([
          import("phaser"),
          import("@/game/config"),
          import("@/game/events"),
        ]);

      if (destroyed || !hostRef.current) return;

      const rect = hostRef.current.getBoundingClientRect();
      const width = Math.max(320, Math.floor(rect.width || window.innerWidth));
      const height = Math.max(480, Math.floor(rect.height || window.innerHeight));

      const config = createGameConfig(hostRef.current, width, height);
      gameRef.current = new Phaser.Game(config);

      unbindReady = gameBus.onReady(() => onReady());
    }

    void boot();

    return () => {
      destroyed = true;
      unbindReady?.();
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [onReady]);

  useEffect(() => {
    const onResize = () => {
      const game = gameRef.current;
      const host = hostRef.current;
      if (!game || !host) return;
      const rect = host.getBoundingClientRect();
      game.scale.resize(Math.floor(rect.width), Math.floor(rect.height));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      ref={hostRef}
      className={`absolute inset-0 touch-none ${className}`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    />
  );
}
