"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { TOKEN_INFO } from "@/lib/constants";
import { motion } from "framer-motion";

export function TokenInfo() {
  return (
    <section className="relative z-10 section-pad">
      <div className="container-site">
        <SectionHeading
          eyebrow="Tokenomics"
          title="Token Info"
          description="Clean launch. Zero tax. Pure Solana energy."
        />

        <motion.div
          className="glass-strong relative mx-auto max-w-4xl overflow-hidden rounded-3xl p-6 sm:p-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neon-blue/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-neon-pink/15 blur-3xl" />

          <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOKEN_INFO.map((item, index) => (
              <motion.div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
                whileHover={{
                  borderColor: "rgba(62,203,255,0.45)",
                  boxShadow: "0 0 24px rgba(62,203,255,0.15)",
                }}
              >
                <p className="font-heading text-[11px] uppercase tracking-[0.28em] text-text-muted">
                  {item.label}
                </p>
                <p className="mt-2 font-heading text-xl font-semibold text-white">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
