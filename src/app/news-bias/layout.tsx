import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "News Bias Tool",
  description:
    "Select a news event, trading pair and result to get the expected bullish or bearish bias after a high-impact economic release.",
  openGraph: {
    title: "News Bias Tool",
    description:
      "Instant directional bias for high-impact USD economic releases.",
  },
  robots: { index: true, follow: true },
};

export default function NewsBiasLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-[#070b12] text-slate-200 selection:bg-sky-400/30">
      {children}
    </div>
  );
}
