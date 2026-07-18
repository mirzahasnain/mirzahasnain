"use client";

import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LINKS } from "@/lib/constants";
import { motion } from "framer-motion";

export function Community() {
  return (
    <section id="community" className="relative z-10 section-pad">
      <div className="container-site">
        <motion.div
          className="glass-strong relative overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-10 sm:py-16"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(62,203,255,0.18),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(255,107,203,0.14),_transparent_40%)]" />

          <div className="relative">
            <SectionHeading
              eyebrow="Community"
              title="Join the NIBBO Army"
              description="Weirdos welcome. Degens preferred. Memes mandatory."
            />

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={LINKS.telegram}>Telegram</Button>
              <Button href={LINKS.twitter} variant="outline">
                X
              </Button>
              <Button href={LINKS.pumpfun}>Pump.fun</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
