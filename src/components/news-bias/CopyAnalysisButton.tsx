"use client";

import { Check, Copy, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CopyAnalysisButtonProps {
  text: string;
}

type CopyStatus = "idle" | "copied" | "failed";

const FEEDBACK_MS = 3000;

const STATE = {
  idle: {
    label: "Copy Analysis",
    icon: Copy,
    className:
      "border-sky-400/40 bg-sky-400/10 text-sky-200 hover:bg-sky-400/15",
  },
  copied: {
    label: "Copied",
    icon: Check,
    className: "border-emerald-400/50 bg-emerald-400/10 text-emerald-300",
  },
  failed: {
    label: "Copy Failed",
    icon: TriangleAlert,
    className: "border-red-400/50 bg-red-400/10 text-red-300",
  },
} as const;

export function CopyAnalysisButton({ text }: CopyAnalysisButtonProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setStatus("idle");
  }, [text]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleClick = async () => {
    setStatus((await writeToClipboard(text)) ? "copied" : "failed");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus("idle"), FEEDBACK_MS);
  };

  const { label, icon: Icon, className } = STATE[status];

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-4 text-sm font-bold uppercase tracking-[0.12em] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 ${className}`}
    >
      <Icon aria-hidden className="size-4" />
      {label}
      <span aria-live="polite" className="sr-only">
        {status === "copied" ? "Analysis copied to clipboard" : ""}
        {status === "failed" ? "Could not copy the analysis" : ""}
      </span>
    </button>
  );
}

async function writeToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Blocked by permissions or an unfocused document; try the fallback.
  }

  return copyWithTextarea(text);
}

/** Fallback for browsers or contexts where the async clipboard is unavailable. */
function copyWithTextarea(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(area);
  return copied;
}
