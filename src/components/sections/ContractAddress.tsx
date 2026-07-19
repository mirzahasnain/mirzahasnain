"use client";

import { CopyButton } from "@/components/ui/CopyButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONTRACT_ADDRESS } from "@/lib/constants";
import { motion } from "framer-motion";

export function ContractAddress() {
  return (
    <section id="contract" className="relative z-10 section-pad">
      <div className="container-site">
        <SectionHeading
          eyebrow="Security"
          title="Official Contract Address"
          description="Always verify the official CA before buying. Updated on launch day."
        />

        <motion.div
          className="glass-strong relative mx-auto max-w-3xl overflow-hidden rounded-3xl p-6 sm:p-8"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-neon-purple/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-8 h-36 w-36 rounded-full bg-neon-blue/20 blur-3xl" />

          <div className="relative flex flex-col items-center gap-5 text-center">
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-neon-blue">
              Contract Address
            </p>
            <p className="break-all font-heading text-lg font-bold tracking-wide text-white sm:text-2xl md:text-3xl">
              {CONTRACT_ADDRESS}
            </p>
            <CopyButton value={CONTRACT_ADDRESS} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
