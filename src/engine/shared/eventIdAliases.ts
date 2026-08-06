/**
 * Canonical event id aliases — Rules Engine ↔ Brain ↔ legacy calendar.
 * MVP debt fix: one resolution path, no new product features.
 */

/** Rules Engine id → Brain newsRules.json id */
const RULES_TO_BRAIN: Record<string, string> = {
  fomc: "fomc-statement",
  "interest-rate": "interest-rate-decision",
  "ism-manufacturing": "ism-manufacturing-pmi",
  "ism-services": "ism-services-pmi",
};

/** Brain / legacy id → Rules Engine id */
const BRAIN_TO_RULES: Record<string, string> = {
  "fomc-statement": "fomc",
  "interest-rate-decision": "interest-rate",
  "ism-manufacturing-pmi": "ism-manufacturing",
  "ism-services-pmi": "ism-services",
};

/** Resolve an incoming id to the Brain newsRules key when possible. */
export function toBrainEventId(id: string): string {
  return RULES_TO_BRAIN[id] ?? id;
}

/** Resolve an incoming id to the Rules Engine JSON id when possible. */
export function toRulesEventId(id: string): string {
  return BRAIN_TO_RULES[id] ?? id;
}

export function listEventIdAliases(): {
  rulesToBrain: Record<string, string>;
  brainToRules: Record<string, string>;
} {
  return {
    rulesToBrain: { ...RULES_TO_BRAIN },
    brainToRules: { ...BRAIN_TO_RULES },
  };
}
