"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WHY_CARDS } from "@/lib/constants";
import { Heart, Laugh, Rocket, Zap } from "lucide-react";

const icons = {
  Rocket,
  Zap,
  Laugh,
  Heart,
} as const;

export function WhyNibbo() {
  return (
    <section className="relative z-10 section-pad">
      <div className="container-site">
        <SectionHeading
          eyebrow="Why NIBBO"
          title="Built Different"
          description="Four reasons the galaxy keeps coming back for more."
        />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {WHY_CARDS.map((card, index) => {
            const Icon = icons[card.icon as keyof typeof icons];
            return (
              <GlassCard key={card.title} delay={index * 0.08} className="group">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neon-blue/10 text-neon-blue transition-colors group-hover:text-neon-pink">
                  <Icon size={24} />
                </div>
                <h3 className="font-heading text-lg font-semibold tracking-wide text-white">
                  {card.icon === "Rocket" && "🚀 "}
                  {card.icon === "Zap" && "⚡ "}
                  {card.icon === "Laugh" && "😂 "}
                  {card.icon === "Heart" && "💙 "}
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {card.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
