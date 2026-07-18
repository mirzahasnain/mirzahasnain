"use client";

import { Button } from "@/components/ui/Button";
import { LINKS, SITE } from "@/lib/constants";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const mascotY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative z-10 flex min-h-[100svh] items-center pt-24 pb-16"
    >
      <div className="container-site grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <motion.div style={{ y: textY, opacity }} className="relative z-10">
          <motion.p
            className="mb-4 font-heading text-xs uppercase tracking-[0.4em] text-neon-blue"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            On Solana
          </motion.p>

          <motion.h1
            className="font-heading text-5xl font-bold leading-[1.05] tracking-wide text-white sm:text-6xl md:text-7xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="block text-gradient">NIBBO</span>
            <span className="mt-2 block text-2xl text-white/90 sm:text-3xl md:text-4xl">
              Meet NIBBO 👾
            </span>
          </motion.h1>

          <motion.p
            className="mt-5 font-heading text-lg uppercase tracking-[0.18em] sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <span className="text-white">Born Weird. </span>
            <span className="text-neon-pink">Built to Meme.</span>
          </motion.p>

          <motion.p
            className="mt-5 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            {SITE.description}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <Button href={LINKS.buy}>Buy on Pump.fun</Button>
            <Button href={LINKS.telegram} variant="outline">
              Join Community
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: mascotY, opacity }}
          className="relative mx-auto flex w-full max-w-[520px] items-center justify-center"
        >
          <div className="animate-pulse-glow absolute inset-[8%] rounded-full bg-neon-blue/25 blur-3xl" />
          <div className="absolute inset-[18%] rounded-full bg-neon-pink/15 blur-2xl" />

          <motion.div
            className="absolute -right-2 top-10 text-4xl opacity-80 sm:top-16 sm:text-5xl"
            animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            🚀
          </motion.div>
          <motion.div
            className="absolute -left-1 top-8 text-3xl opacity-70 sm:text-4xl"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            🌙
          </motion.div>

          <motion.div
            className="relative animate-float"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          >
            <Image
              src="/nibbo-mascot.png"
              alt="NIBBO mascot — cute fluffy blue creature on Solana"
              width={640}
              height={640}
              priority
              className="relative z-10 h-auto w-full drop-shadow-[0_0_50px_rgba(62,203,255,0.45)]"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
