import { describe, expect, it } from "vitest";
import { processPlaybook } from "../process";
import { mockSellPlaybook } from "../mocks/sample";

describe("playbookEngine", () => {
  it("builds structured playbook with phases", () => {
    const result = processPlaybook(mockSellPlaybook);
    expect(result.setup.decisionId).toBe("conservative-sell");
    expect(result.phases.length).toBe(3);
    expect(result.fakeSpikeWarning).toBeTruthy();
    expect(result.entries.length).toBeGreaterThan(0);
  });

  it("collapses entries on Avoid", () => {
    const result = processPlaybook({
      ...mockSellPlaybook,
      decisionId: "avoid",
    });
    expect(result.entries).toEqual([]);
  });
});
