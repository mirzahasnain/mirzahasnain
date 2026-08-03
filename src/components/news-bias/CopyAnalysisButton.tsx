"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CopyAnalysisButtonProps {
  text: string;
}

export function CopyAnalysisButton({ text }: CopyAnalysisButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCopied(false);
  }, [text]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleClick = async () => {
    if (!(await writeToClipboard(text))) return;

    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-4 text-sm font-bold uppercase tracking-[0.12em] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 ${
        copied
          ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
          : "border-sky-400/40 bg-sky-400/10 text-sky-200 hover:bg-sky-400/15"
      }`}
    >
      {copied ? (
        <Check aria-hidden className="size-4" />
      ) : (
        <Copy aria-hidden className="size-4" />
      )}
      {copied ? "Copied" : "Copy Analysis"}
      <span aria-live="polite" className="sr-only">
        {copied ? "Analysis copied to clipboard" : ""}
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
    // Clipboard API can be blocked by permissions; fall back below.
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
