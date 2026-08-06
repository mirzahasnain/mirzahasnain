import type { Metadata } from "next";
import type { ReactNode } from "react";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/news-bias/utils/theme";

export const metadata: Metadata = {
  title: "Economic Calendar",
  description: "Upcoming high-impact economic releases for news traders.",
};

export default function CalendarLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      <div className="min-h-[100dvh] bg-nb-bg text-nb-text-soft selection:bg-nb-accent/30">
        {children}
      </div>
    </>
  );
}
