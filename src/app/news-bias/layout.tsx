import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppProviders } from "@/components/system";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/news-bias/utils/theme";

export const metadata: Metadata = {
  title: "News Bias Tool",
  description:
    "Three taps to a trading bias: pick a high-impact economic release, a trading pair and how the actual landed against the forecast.",
  openGraph: {
    title: "News Bias Tool",
    description: "Three taps to a trading bias.",
  },
  robots: { index: true, follow: true },
};

export default function NewsBiasLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Applies the saved theme before first paint so there is no flash. */}
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      <div className="min-h-[100dvh] bg-nb-bg text-nb-text-soft selection:bg-nb-accent/30">
        <AppProviders>{children}</AppProviders>
      </div>
    </>
  );
}
