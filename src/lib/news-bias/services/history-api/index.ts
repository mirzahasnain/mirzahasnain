/**
 * History API seam — JSON today, database later.
 * UI and engines depend only on this interface.
 */
import type { NewsEventId } from "../../types/interfaces";
import type {
  HistoricalReleaseRecord,
  HistoryApi,
  SimilarMatch,
  SimilarityQuery,
} from "../../engine/historyTypes";
import { findSimilarReleases } from "../../engine/similarityEngine";
import { loadHistoryReleases, listHistoryNewsIds } from "../../engine/historyEngine";

export type { HistoryApi, HistoricalReleaseRecord, SimilarMatch, SimilarityQuery };

/** Default JSON-backed implementation. Swap for a remote client later. */
export function createJsonHistoryApi(): HistoryApi {
  return {
    async listNewsIds() {
      return listHistoryNewsIds();
    },
    async getReleases(newsId: NewsEventId) {
      return loadHistoryReleases(newsId);
    },
    async findSimilar(query: SimilarityQuery) {
      return findSimilarReleases(query);
    },
  };
}

/** Singleton used by the analysis composition root. */
export const historyApi: HistoryApi = createJsonHistoryApi();
