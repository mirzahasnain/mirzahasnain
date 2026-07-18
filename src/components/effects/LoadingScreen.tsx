"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-space-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              className="absolute h-40 w-40 rounded-full bg-neon-blue/20 blur-3xl"
              animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <motion.h1
              className="font-heading text-4xl font-bold tracking-[0.3em] text-gradient sm:text-5xl"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              NIBBO
            </motion.h1>
            <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
            </div>
            <p className="font-heading text-xs uppercase tracking-[0.35em] text-text-muted">
              Entering orbit...
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
