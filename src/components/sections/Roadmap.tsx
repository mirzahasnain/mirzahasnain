"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { ROADMAP } from "@/lib/constants";
import { motion } from "framer-motion";

const phaseGlow = [
  "bg-neon-blue shadow-[0_0_16px_rgba(62,203,255,0.8)]",
  "bg-neon-purple shadow-[0_0_16px_rgba(168,85,247,0.8)]",
  "bg-neon-pink shadow-[0_0_16px_rgba(255,107,203,0.8)]",
  "bg-neon-blue-soft shadow-[0_0_16px_rgba(106,216,255,0.8)]",
];

export function Roadmap() {
  return (
    <section id="roadmap" className="relative z-10 section-pad">
      <div className="container-site">
        <SectionHeading
          eyebrow="Timeline"
          title="Roadmap"
          description="From first meme to global orbit."
        />

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-neon-blue via-neon-purple to-neon-pink md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-10">
            {ROADMAP.map((phase, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={phase.phase}
                  className={`relative pl-12 md:grid md:grid-cols-2 md:gap-10 md:pl-0 ${
                    isLeft ? "" : "md:[&>*:first-child]:col-start-2"
                  }`}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                >
                  <div
                    className={`absolute left-2.5 top-3 h-3 w-3 rounded-full md:left-1/2 md:-translate-x-1/2 ${
                      phaseGlow[index % phaseGlow.length]
                    }`}
                  />

                  <div
                    className={`glass rounded-2xl p-6 ${
                      isLeft ? "md:mr-8 md:text-right" : "md:ml-8"
                    }`}
                  >
                    <p className="font-heading text-xs uppercase tracking-[0.3em] text-neon-blue">
                      {phase.phase}
                    </p>
                    <h3 className="mt-2 font-heading text-2xl font-semibold text-white">
                      {phase.title}
                    </h3>
                    <ul
                      className={`mt-4 space-y-2 text-text-muted ${
                        isLeft ? "md:ml-auto md:inline-block md:text-right" : ""
                      }`}
                    >
                      {phase.items.map((item) => (
                        <li key={item} className="text-sm sm:text-base">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
