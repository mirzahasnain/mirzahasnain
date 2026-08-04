"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import type { ReactNode } from "react";

interface DisclosureProps {
  title: string;
  children: ReactNode;
}

export function Disclosure({ title, children }: DisclosureProps) {
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1119]/70">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 sm:px-6"
      >
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
          {title}
        </span>
        <ChevronDown
          aria-hidden
          className={`size-5 shrink-0 text-slate-400 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div
          id={panelId}
          className="space-y-8 border-t border-white/5 px-5 pb-8 pt-6 sm:px-6"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
