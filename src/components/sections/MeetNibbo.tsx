"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import Image from "next/image";

export function MeetNibbo() {
  return (
    <section id="about" className="relative z-10 section-pad">
      <div className="container-site">
        <SectionHeading eyebrow="Origin" title="🐾 Meet NIBBO" />

        <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            className="relative order-1 mx-auto w-full max-w-md lg:order-2"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-[10%] rounded-full bg-neon-blue/20 blur-3xl" />
            <Image
              src="/nibbo-mascot.png"
              alt="NIBBO the mysterious blue kitten from another galaxy"
              width={520}
              height={520}
              loading="lazy"
              sizes="(max-width: 768px) 90vw, 420px"
              className="relative z-10 mx-auto h-auto w-full drop-shadow-[0_0_40px_rgba(62,203,255,0.35)]"
            />
          </motion.div>

          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55 }}
          >
            <div className="glass-strong rounded-3xl p-6 sm:p-8">
              <p className="text-base leading-relaxed text-text-muted sm:text-lg md:text-xl">
                NIBBO is a mysterious blue kitten from another galaxy who landed
                on Solana to spread memes, fun, and community across the crypto
                universe.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
