"use client";

import dynamic from "next/dynamic";

const GameShell = dynamic(
  () => import("@/components/game/GameShell").then((m) => m.GameShell),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-space-950">
        <div className="text-center">
          <div className="mx-auto mb-3 h-14 w-14 animate-pulse rounded-full bg-gradient-to-br from-neon-blue/40 to-neon-purple/40 blur-[1px]" />
          <p className="font-heading text-sm tracking-[0.22em] text-text-muted">
            LOADING NIBBO...
          </p>
        </div>
      </div>
    ),
  }
);

export default function PlayPage() {
  return <GameShell />;
}
