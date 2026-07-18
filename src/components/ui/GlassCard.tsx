"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  hoverGlow?: boolean;
  delay?: number;
};

export function GlassCard({
  children,
  className = "",
  hoverGlow = true,
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      className={`glass rounded-2xl p-6 ${className}`}
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      whileHover={
        hoverGlow
          ? {
              y: -6,
              boxShadow:
                "0 0 0 1px rgba(62,203,255,0.35), 0 0 40px rgba(62,203,255,0.25), 0 0 60px rgba(168,85,247,0.15)",
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
