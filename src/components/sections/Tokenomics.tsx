"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TOKENOMICS } from "@/lib/constants";

export function Tokenomics() {
  return (
    <section id="tokenomics" className="relative z-10 section-pad">
      <div className="container-site">
        <SectionHeading
          eyebrow="Economics"
          title="Tokenomics"
          description="Clean, fair, and built for the community."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {TOKENOMICS.map((item, index) => (
            <GlassCard
              key={item.label}
              delay={index * 0.06}
              className="text-center"
            >
              <p className="font-heading text-[11px] uppercase tracking-[0.24em] text-text-muted">
                {item.label}
              </p>
              <p className="mt-3 font-heading text-2xl font-bold text-gradient sm:text-3xl">
                {item.value}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
