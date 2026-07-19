"use client";

import { motion } from "framer-motion";

export function SolanaParticles({ count = 18 }: { count?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 37) % 100;
        const delay = (i % 8) * 0.45;
        const duration = 8 + (i % 5);
        const size = 10 + (i % 4) * 4;
        return (
          <motion.span
            key={i}
            className="absolute rounded-sm opacity-40"
            style={{
              left: `${left}%`,
              bottom: "-8%",
              width: size,
              height: size * 0.55,
              background:
                i % 3 === 0
                  ? "linear-gradient(120deg,#00ffa3,#03e1ff)"
                  : i % 3 === 1
                    ? "linear-gradient(120deg,#03e1ff,#dc1fff)"
                    : "linear-gradient(120deg,#dc1fff,#3ecbff)",
              boxShadow: "0 0 12px rgba(3,225,255,0.35)",
            }}
            animate={{ y: [0, -900], x: [0, ((i % 2) * 2 - 1) * 40], opacity: [0, 0.55, 0], rotate: [0, 180] }}
            transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
    </div>
  );
}
