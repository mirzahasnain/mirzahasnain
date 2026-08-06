"use client";

import { useState } from "react";
import { WORKSPACE_COPY } from "@/lib/news-bias/modules/dashboard/workspaceCopy";
import type { JournalDraft } from "@/lib/news-bias/modules/journal";
import type {
  TradeJournalEntry,
  TradeJournalResult,
} from "@/lib/news-bias/modules/types";
import type { PairId } from "@/lib/news-bias/types/interfaces";

interface TradeJournalPanelProps {
  entries: TradeJournalEntry[];
  defaultPair: PairId;
  newsLabel: string | null;
  onAdd: (draft: JournalDraft) => void;
  onDelete: (id: string) => void;
}

const RESULTS: TradeJournalResult[] = ["open", "win", "loss", "breakeven"];

export function TradeJournalPanel({
  entries,
  defaultPair,
  newsLabel,
  onAdd,
  onDelete,
}: TradeJournalPanelProps) {
  const [pairId, setPairId] = useState<PairId>(defaultPair);
  const [entry, setEntry] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [result, setResult] = useState<TradeJournalResult>("open");
  const [profitLoss, setProfitLoss] = useState("");
  const [notes, setNotes] = useState("");

  const submit = () => {
    onAdd({
      pairId,
      newsLabel,
      entry: parseOptional(entry),
      stopLoss: parseOptional(stopLoss),
      takeProfit: parseOptional(takeProfit),
      result,
      profitLoss: parseOptional(profitLoss),
      notes,
    });
    setEntry("");
    setStopLoss("");
    setTakeProfit("");
    setProfitLoss("");
    setNotes("");
    setResult("open");
  };

  return (
    <section
      id="journal"
      className="rounded-2xl border border-nb-border bg-nb-surface px-4 py-4"
    >
      <h2 className="text-sm font-semibold text-nb-text">
        {WORKSPACE_COPY.sections.journal}
      </h2>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Field label="Pair">
          <select
            value={pairId}
            onChange={(e) => setPairId(e.target.value as PairId)}
            className="min-h-10 w-full rounded-xl border border-nb-border bg-nb-input px-3 text-sm text-nb-text"
          >
            {(
              [
                "XAUUSD",
                "XAGUSD",
                "BTCUSD",
                "EURUSD",
                "GBPUSD",
                "NAS100",
              ] as PairId[]
            ).map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </Field>
        <Field label={WORKSPACE_COPY.journal.result}>
          <select
            value={result}
            onChange={(e) => setResult(e.target.value as TradeJournalResult)}
            className="min-h-10 w-full rounded-xl border border-nb-border bg-nb-input px-3 text-sm text-nb-text"
          >
            {RESULTS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
        <Field label={WORKSPACE_COPY.journal.entry}>
          <NumberInput value={entry} onChange={setEntry} />
        </Field>
        <Field label={WORKSPACE_COPY.journal.sl}>
          <NumberInput value={stopLoss} onChange={setStopLoss} />
        </Field>
        <Field label={WORKSPACE_COPY.journal.tp}>
          <NumberInput value={takeProfit} onChange={setTakeProfit} />
        </Field>
        <Field label={WORKSPACE_COPY.journal.pl}>
          <NumberInput value={profitLoss} onChange={setProfitLoss} />
        </Field>
      </div>
      <Field label={WORKSPACE_COPY.journal.notes}>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-xl border border-nb-border bg-nb-input px-3 py-2 text-sm text-nb-text"
        />
      </Field>
      <button
        type="button"
        onClick={submit}
        className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full bg-nb-accent px-5 text-sm font-bold text-white"
      >
        {WORKSPACE_COPY.journal.save}
      </button>

      {entries.length === 0 ? (
        <p className="mt-4 text-sm text-nb-muted">{WORKSPACE_COPY.journal.empty}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {entries.map((row) => (
            <li
              key={row.id}
              className="rounded-xl bg-nb-elevated/50 px-3 py-3 text-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-nb-text">
                    {row.pairId} · {row.result}
                  </p>
                  <p className="mt-1 text-xs text-nb-muted">
                    E {fmt(row.entry)} · SL {fmt(row.stopLoss)} · TP{" "}
                    {fmt(row.takeProfit)} · P/L {fmt(row.profitLoss)}
                  </p>
                  {row.notes ? (
                    <p className="mt-1 text-xs text-nb-text-soft">{row.notes}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(row.id)}
                  className="text-xs font-semibold text-nb-muted hover:text-nb-down"
                >
                  {WORKSPACE_COPY.journal.delete}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-nb-faint">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function NumberInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-10 w-full rounded-xl border border-nb-border bg-nb-input px-3 text-sm text-nb-text"
    />
  );
}

function parseOptional(value: string): number | null {
  if (!value.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function fmt(value: number | null): string {
  return value === null ? "—" : String(value);
}
