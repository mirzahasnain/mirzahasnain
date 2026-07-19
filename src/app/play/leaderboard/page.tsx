import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard | NIBBO Catch!",
  description: "Daily, weekly, and all-time NIBBO Catch leaderboard.",
};

export default function LeaderboardPage() {
  return <LeaderboardView />;
}
