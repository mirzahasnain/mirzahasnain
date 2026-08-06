/**
 * Headline feed for the selected release. Wired up in Version 4; today it
 * resolves empty so the UI can call it without special casing.
 */
import type { NewsEventId } from "../types/interfaces";

export interface NewsHeadline {
  id: string;
  title: string;
  source: string;
  /** ISO timestamp of publication. */
  publishedAt: string;
  url: string;
}

export interface NewsService {
  listHeadlines(eventId: NewsEventId): Promise<NewsHeadline[]>;
}

export const newsService: NewsService = {
  listHeadlines: async () => [],
};
