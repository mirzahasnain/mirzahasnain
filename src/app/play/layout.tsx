import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "NIBBO Catch! | Play",
  description:
    "Catch NIBBO in 30 seconds. Tap fast, score big, and share your run on X.",
  openGraph: {
    title: "NIBBO Catch!",
    description: "Catch NIBBO before time runs out!",
    images: ["/game/nibbo-hero.webp"],
  },
  robots: { index: true, follow: true },
};

export default function PlayLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-space-950 text-text selection:bg-neon-blue/30">
      {children}
    </div>
  );
}
