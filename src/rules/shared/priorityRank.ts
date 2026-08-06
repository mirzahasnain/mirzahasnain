import type { RulePriority } from "../types";

const RANK: Record<RulePriority, number> = {
  Critical: 100,
  High: 75,
  Medium: 50,
  Low: 25,
};

export function priorityRank(priority: RulePriority): number {
  return RANK[priority];
}

export function comparePriority(a: RulePriority, b: RulePriority): number {
  return priorityRank(b) - priorityRank(a);
}
