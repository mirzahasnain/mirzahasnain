import type { Metadata } from "next";
import type { ReactNode } from "react";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/news-bias/utils/theme";

export const metadata: Metadata = {
  title: "Event Details",
  description: "Economic event details for news trading.",
};

export default function EventLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      <div className="min-h-[100dvh] bg-nb-bg text-nb-text-soft selection:bg-nb-accent/30">
        {children}
      </div>
    </>
  );
}
