"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo } from "react";

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function SpaceBackground() {
  const { scrollY } = useScroll();
  const starsY = useTransform(scrollY, [0, 1200], [0, 180]);
  const planetsY = useTransform(scrollY, [0, 1200], [0, 90]);
  const nebulaY = useTransform(scrollY, [0, 1200], [0, 40]);

  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: `${seededRandom(i + 1) * 100}%`,
        top: `${seededRandom(i + 40) * 100}%`,
        size: 1 + seededRandom(i + 80) * 2.2,
        delay: seededRandom(i + 120) * 4,
        duration: 2 + seededRandom(i + 160) * 3,
      })),
    []
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: `${seededRandom(i + 200) * 100}%`,
        top: `${seededRandom(i + 240) * 100}%`,
        size: 3 + seededRandom(i + 280) * 5,
        duration: 8 + seededRandom(i + 320) * 10,
        delay: seededRandom(i + 360) * 5,
        color:
          i % 3 === 0
            ? "rgba(62,203,255,0.55)"
            : i % 3 === 1
              ? "rgba(255,107,203,0.45)"
              : "rgba(168,85,247,0.45)",
      })),
    []
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(62,203,255,0.12),_transparent_45%),radial-gradient(ellipse_at_bottom_right,_rgba(168,85,247,0.16),_transparent_40%),radial-gradient(ellipse_at_bottom_left,_rgba(255,107,203,0.1),_transparent_35%),linear-gradient(180deg,#030014_0%,#07061a_45%,#030014_100%)]" />

      <motion.div className="absolute inset-0" style={{ y: nebulaY }}>
        <div className="absolute left-[-10%] top-[12%] h-72 w-72 rounded-full bg-neon-purple/20 blur-[100px]" />
        <div className="absolute right-[-8%] top-[30%] h-80 w-80 rounded-full bg-neon-blue/15 blur-[110px]" />
        <div className="absolute bottom-[10%] left-[30%] h-64 w-64 rounded-full bg-neon-pink/10 blur-[90px]" />
      </motion.div>

      <motion.div className="absolute inset-0" style={{ y: starsY }}>
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        ))}
      </motion.div>

      <motion.div className="absolute inset-0" style={{ y: planetsY }}>
        <motion.div
          className="absolute right-[8%] top-[18%] h-20 w-20 rounded-full bg-gradient-to-br from-slate-300 via-slate-500 to-slate-700 opacity-70 shadow-[inset_-8px_-6px_16px_rgba(0,0,0,0.45),0_0_30px_rgba(62,203,255,0.2)] sm:h-28 sm:w-28"
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[6%] top-[55%] h-14 w-14 rounded-full bg-gradient-to-br from-neon-purple/80 to-indigo-900 opacity-60 blur-[1px] sm:h-20 sm:w-20"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[18%] right-[18%] h-10 w-10 rounded-full bg-gradient-to-br from-neon-blue to-cyan-700 opacity-50 sm:h-14 sm:w-14"
          animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            background: particle.color,
            boxShadow: `0 0 12px ${particle.color}`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
