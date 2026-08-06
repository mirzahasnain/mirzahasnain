"use client";

import {
  Check,
  Copy,
  FileDown,
  FileText,
  Share2,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  EXPORT_FEEDBACK,
  EXPORT_LABELS,
  FEEDBACK_MS,
} from "@/lib/news-bias/constants";
import { buildAiTradePlaybook } from "@/lib/news-bias/modules/playbook";
import type { AiTradePlaybook } from "@/lib/news-bias/modules/playbook/types";
import type { Analysis } from "@/lib/news-bias/types/interfaces";
import {
  copyPlaybook,
  downloadPlaybookPdf,
  downloadPlaybookTxt,
  sharePlaybook,
} from "@/lib/news-bias/utils/exportPlaybook";

const PLAYBOOK_COPY = {
  setup: "Trade Setup",
  asset: "Asset",
  bias: "Bias",
  confidence: "Confidence",
  risk: "Risk",
  plan: "Trading Plan",
  entries: "Entry Strategy",
  riskMgmt: "Risk Management",
  recommended: "Recommended Risk",
  takeProfit: "Take Profit Strategy",
  stopLoss: "Stop Loss Guide",
  historical: "Historical Behaviour",
  previous: "Previous similar releases",
  aiNotes: "AI Notes",
  export: "Export playbook",
  share: "Share summary",
} as const;

interface AiTradePlaybookCardProps {
  analysis: Analysis;
}

export function AiTradePlaybookCard({ analysis }: AiTradePlaybookCardProps) {
  const playbook = useMemo(() => buildAiTradePlaybook(analysis), [analysis]);

  return <PlaybookCardView playbook={playbook} />;
}

export function PlaybookCardView({ playbook }: { playbook: AiTradePlaybook }) {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-nb-border bg-nb-elevated/40 px-4 py-4">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nb-faint">
          {PLAYBOOK_COPY.setup}
        </h3>
        <dl className="mt-3 grid grid-cols-2 gap-3">
          <SetupField label={PLAYBOOK_COPY.asset} value={playbook.setup.pairId} />
          <SetupField
            label={PLAYBOOK_COPY.bias}
            value={playbook.setup.bias}
            strong
          />
          <SetupField
            label={PLAYBOOK_COPY.confidence}
            value={`${playbook.setup.confidence}%`}
          />
          <SetupField label={PLAYBOOK_COPY.risk} value={playbook.setup.risk} />
        </dl>
      </section>

      <Section title={PLAYBOOK_COPY.plan}>
        <ul className="space-y-2">
          {playbook.plan.map((phase) => (
            <li
              key={phase.id}
              className="rounded-xl bg-nb-elevated/50 px-3 py-2.5"
            >
              <p className="text-xs font-semibold text-nb-text">{phase.title}</p>
              <p className="mt-0.5 text-sm text-nb-text-soft">{phase.action}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={PLAYBOOK_COPY.entries}>
        <ul className="space-y-2">
          {playbook.entries.map((entry) => (
            <li key={entry.id} className="rounded-xl bg-nb-elevated/50 px-3 py-2.5">
              <p className="text-xs font-semibold text-nb-text">{entry.label}</p>
              <p className="mt-0.5 text-sm text-nb-text-soft">
                {entry.explanation}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={PLAYBOOK_COPY.riskMgmt}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-nb-faint">
          {PLAYBOOK_COPY.recommended}
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {playbook.risk.options.map((option) => (
            <li
              key={option.id}
              className={[
                "rounded-full border px-3 py-1.5 text-xs font-semibold",
                option.id === playbook.risk.recommendedId
                  ? "border-nb-accent/50 bg-nb-accent/10 text-nb-text"
                  : "border-nb-border text-nb-muted",
              ].join(" ")}
            >
              {option.label}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-nb-text-soft">
          {playbook.risk.positionSizingReminder}
        </p>
      </Section>

      <Section title={PLAYBOOK_COPY.takeProfit}>
        <ul className="space-y-2">
          {playbook.takeProfit.levels.map((level) => (
            <li
              key={level.id}
              className="flex items-start justify-between gap-3 rounded-xl bg-nb-elevated/50 px-3 py-2.5"
            >
              <span className="text-xs font-bold text-nb-text">{level.label}</span>
              <span className="text-right text-sm text-nb-muted">
                {level.placeholder}
              </span>
            </li>
          ))}
          <li className="rounded-xl bg-nb-elevated/50 px-3 py-2.5">
            <p className="text-xs font-bold text-nb-text">
              {playbook.takeProfit.trailStop.label}
            </p>
            <p className="mt-0.5 text-sm text-nb-muted">
              {playbook.takeProfit.trailStop.placeholder}
            </p>
          </li>
        </ul>
      </Section>

      <Section title={PLAYBOOK_COPY.stopLoss}>
        <ul className="space-y-2">
          {playbook.stopLoss.placements.map((row) => (
            <li key={row.id} className="rounded-xl bg-nb-elevated/50 px-3 py-2.5">
              <p className="text-xs font-semibold text-nb-text">{row.label}</p>
              <p className="mt-0.5 text-sm text-nb-text-soft">{row.hint}</p>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-nb-faint">{playbook.stopLoss.note}</p>
      </Section>

      {playbook.fakeSpike ? (
        <section className="rounded-2xl border border-nb-wait/40 bg-nb-wait/10 px-4 py-4">
          <h3 className="text-sm font-bold text-nb-wait">
            {playbook.fakeSpike.title}
          </h3>
          <p className="mt-1 text-sm text-nb-text-soft">
            {playbook.fakeSpike.message}
          </p>
          <p className="mt-1 text-xs text-nb-muted">{playbook.fakeSpike.hint}</p>
        </section>
      ) : null}

      {playbook.historical ? (
        <Section title={PLAYBOOK_COPY.historical}>
          <p className="text-xs text-nb-faint">
            {PLAYBOOK_COPY.previous} ({playbook.historical.total})
          </p>
          <p className="mt-2 text-sm font-semibold text-nb-text">
            {playbook.historical.summaryLine}
          </p>
          <p className="mt-1 text-sm text-nb-text-soft">
            {playbook.historical.averageMoveLabel}
          </p>
        </Section>
      ) : null}

      <Section title={playbook.volatility.title}>
        <VolatilityBar
          band={playbook.volatility.band}
          label={playbook.volatility.label}
        />
      </Section>

      <Section title={PLAYBOOK_COPY.aiNotes}>
        <ul className="space-y-2">
          {playbook.aiNotes.map((note) => (
            <li
              key={note}
              className="rounded-xl bg-nb-elevated/50 px-3 py-2.5 text-sm text-nb-text-soft"
            >
              {note}
            </li>
          ))}
        </ul>
      </Section>

      <Section title={PLAYBOOK_COPY.export}>
        <PlaybookExportActions playbook={playbook} />
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nb-faint">
        {title}
      </h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function SetupField({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-nb-faint">
        {label}
      </dt>
      <dd
        className={[
          "mt-1 text-sm text-nb-text",
          strong ? "font-bold uppercase" : "font-semibold",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}

function VolatilityBar({
  band,
  label,
}: {
  band: AiTradePlaybook["volatility"]["band"];
  label: string;
}) {
  const order = ["low", "medium", "high", "extreme"] as const;
  return (
    <div>
      <p className="text-sm font-bold text-nb-text">{label}</p>
      <ul className="mt-2 grid grid-cols-4 gap-1.5">
        {order.map((id) => (
          <li
            key={id}
            className={[
              "rounded-lg px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wider",
              id === band
                ? "bg-nb-accent/20 text-nb-text ring-1 ring-nb-accent/40"
                : "bg-nb-elevated/50 text-nb-faint",
            ].join(" ")}
          >
            {id}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlaybookExportActions({ playbook }: { playbook: AiTradePlaybook }) {
  const [feedback, setFeedback] = useState<{
    id: string;
    label: string;
    failed: boolean;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = (id: string, label: string, ok: boolean) => {
    setFeedback({ id, label, failed: !ok });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setFeedback(null), FEEDBACK_MS);
  };

  const actions = [
    {
      id: "copy",
      label: EXPORT_LABELS.copy,
      icon: Copy,
      run: async () =>
        flash("copy", EXPORT_FEEDBACK.copy, await copyPlaybook(playbook)),
    },
    {
      id: "pdf",
      label: EXPORT_LABELS.pdf,
      icon: FileDown,
      run: async () =>
        flash("pdf", EXPORT_FEEDBACK.pdf, downloadPlaybookPdf(playbook)),
    },
    {
      id: "txt",
      label: EXPORT_LABELS.txt,
      icon: FileText,
      run: async () =>
        flash("txt", EXPORT_FEEDBACK.txt, downloadPlaybookTxt(playbook)),
    },
    {
      id: "share",
      label: PLAYBOOK_COPY.share,
      icon: Share2,
      run: async () => {
        const result = await sharePlaybook(playbook);
        if (result === "dismissed") return;
        if (result === "failed") flash("share", EXPORT_FEEDBACK.failed, false);
        else
          flash(
            "share",
            result === "shared" ? EXPORT_FEEDBACK.share : EXPORT_FEEDBACK.copy,
            true,
          );
      },
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action) => {
        const active = feedback?.id === action.id ? feedback : null;
        const Icon = active
          ? active.failed
            ? TriangleAlert
            : Check
          : action.icon;
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => void action.run()}
            className={[
              "flex items-center justify-center gap-2 rounded-xl border px-3 py-3.5 text-xs font-bold uppercase tracking-[0.1em] focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70",
              !active
                ? "border-nb-accent/40 bg-nb-accent/10 text-nb-accent hover:bg-nb-accent/15"
                : active.failed
                  ? "border-nb-down/50 bg-nb-down/10 text-nb-down"
                  : "border-nb-up/50 bg-nb-up/10 text-nb-up",
            ].join(" ")}
          >
            <Icon aria-hidden className="size-4 shrink-0" />
            <span className="truncate">{active?.label ?? action.label}</span>
          </button>
        );
      })}
    </div>
  );
}
