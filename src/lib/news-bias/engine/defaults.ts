import historicalMovesJson from "./data/historicalMoves.json";
import impactLevelsJson from "./data/impactLevels.json";
import newsRulesJson from "./data/newsRules.json";
import pairMappingsJson from "./data/pairMappings.json";
import type {
  EngineDeps,
  HistoricalMovesConfig,
  ImpactLevelsConfig,
  NewsRulesConfig,
  PairMappingsConfig,
} from "./types";

export const defaultNewsRules = newsRulesJson as NewsRulesConfig;
export const defaultPairMappings = pairMappingsJson as PairMappingsConfig;
export const defaultImpactLevels = impactLevelsJson as ImpactLevelsConfig;
export const defaultHistoricalMoves =
  historicalMovesJson as HistoricalMovesConfig;

export const defaultEngineDeps: EngineDeps = {
  newsRules: defaultNewsRules,
  pairMappings: defaultPairMappings,
  impactLevels: defaultImpactLevels,
  historicalMoves: defaultHistoricalMoves,
};
