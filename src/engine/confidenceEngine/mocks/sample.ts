import { getNewsRule } from "../../shared/newsRules";
import type { ConfidenceInput } from "../types";

export const mockConfidenceInput: ConfidenceInput = {
  rule: getNewsRule("cpi"),
  strength: "strong",
  isEstimate: false,
};
