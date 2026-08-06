import type { MarketSessionRow, SessionId, SessionStatus } from "../types";

const SESSION_ROWS: { id: SessionId; label: string }[] = [
  { id: "asian", label: "Asian" },
  { id: "london", label: "London" },
  { id: "newyork", label: "New York" },
  { id: "overlap", label: "Overlap" },
];

/** All major sessions with active / open flags for the workspace strip. */
export function buildMarketStatus(session: SessionStatus): {
  rows: MarketSessionRow[];
  marketOpen: boolean;
  activeLabel: string;
} {
  const rows: MarketSessionRow[] = SESSION_ROWS.map((row) => ({
    id: row.id,
    label: row.label,
    active: session.session === row.id,
    open: session.session === row.id,
  }));

  const marketOpen = session.session !== "off";
  return {
    rows,
    marketOpen,
    activeLabel: marketOpen ? session.label : "Market Closed",
  };
}
