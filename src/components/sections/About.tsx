"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";

const lines = [
  "Nibbo isn't a cat.",
  "Nibbo isn't a bear.",
  "Nibbo isn't an alien.",
];

export function About() {
  return (
    <section id="about" className="relative z-10 section-pad">
      <div className="container-site">
        <SectionHeading eyebrow="Origin Story" title="Who is NIBBO?" />

        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="space-y-4">
            {lines.map((line, index) => (
              <motion.p
                key={line}
                className="font-heading text-xl text-white/90 sm:text-2xl"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.5 }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          <motion.div
            className="glass-strong rounded-3xl p-6 sm:p-8"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg leading-relaxed text-text-muted sm:text-xl">
              Nibbo is a mysterious internet creature powered by memes and
              community — a weird little legend born in deep space and raised by
              the timeline.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
