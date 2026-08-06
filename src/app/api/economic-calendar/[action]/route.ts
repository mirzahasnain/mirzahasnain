import { NextRequest, NextResponse } from "next/server";
import { ProviderFactory } from "@/lib/news-bias/providers/ProviderFactory";
import { calendarLogger } from "@/lib/news-bias/utils/logger";

export const dynamic = "force-dynamic";

type Action =
  | "upcoming"
  | "today"
  | "historical"
  | "event"
  | "latest"
  | "search";

/**
 * Server-side economic calendar gateway.
 * Keeps API keys off the client; falls back to MockProvider on failure.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ action: string }> },
) {
  const { action: rawAction } = await context.params;
  const action = rawAction as Action;
  const { searchParams } = request.nextUrl;

  let provider = ProviderFactory.create();

  try {
    const data = await dispatch(provider, action, searchParams);
    return NextResponse.json({
      ok: true,
      provider: provider.config.id,
      data,
    });
  } catch (error) {
    calendarLogger.warn("API route provider failed — trying mock", {
      action,
      provider: provider.config.id,
      error: error instanceof Error ? error.message : String(error),
    });

    if (!provider.config.isMock) {
      try {
        provider = ProviderFactory.getMock();
        const data = await dispatch(provider, action, searchParams);
        return NextResponse.json({
          ok: true,
          provider: provider.config.id,
          fallback: true,
          data,
        });
      } catch (mockError) {
        calendarLogger.error("API route mock fallback failed", {
          action,
          error:
            mockError instanceof Error
              ? mockError.message
              : String(mockError),
        });
      }
    }

    return NextResponse.json(
      {
        ok: false,
        error: "Live data is temporarily unavailable.",
      },
      { status: 503 },
    );
  }
}

async function dispatch(
  provider: ReturnType<typeof ProviderFactory.create>,
  action: Action,
  searchParams: URLSearchParams,
) {
  switch (action) {
    case "upcoming":
      return provider.getUpcomingEvents();
    case "today":
      return provider.getTodayEvents();
    case "historical":
      return provider.getHistoricalEvents(searchParams.get("newsId") ?? "");
    case "event":
      return provider.getEvent(searchParams.get("eventId") ?? "");
    case "latest":
      return provider.getLatestResult(searchParams.get("newsId") ?? "");
    case "search":
      return provider.searchEvents(searchParams.get("q") ?? "");
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}
