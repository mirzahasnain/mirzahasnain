"use client";

import { Check, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { DropdownOption } from "@/lib/news-bias/types/interfaces";

interface DropdownProps<TValue extends string> {
  label: string;
  placeholder: string;
  options: DropdownOption<TValue>[];
  value: TValue | null;
  onChange: (value: TValue) => void;
}

export function Dropdown<TValue extends string>({
  label,
  placeholder,
  options,
  value,
  onChange,
}: DropdownProps<TValue>) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selected = options.find((option) => option.value === value) ?? null;
  const selectedIndex = selected
    ? options.findIndex((option) => option.value === selected.value)
    : -1;

  const openList = useCallback(() => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }, [selectedIndex]);

  const close = useCallback(({ focusTrigger = false } = {}) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const select = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    close({ focusTrigger: true });
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openList();
    }
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        select(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        close({ focusTrigger: true });
        break;
      case "Tab":
        close();
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => (open ? close() : openList())}
        onKeyDown={handleTriggerKeyDown}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-[#0d131d] px-4 py-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 sm:py-3.5 ${
          open
            ? "border-sky-400/60 bg-[#101823]"
            : "border-white/10 hover:border-white/25"
        }`}
      >
        <span className="min-w-0">
          <span
            className={`block truncate text-base font-semibold tracking-tight ${
              selected ? "text-slate-50" : "text-slate-500"
            }`}
          >
            {selected ? selected.label : placeholder}
          </span>
          {selected?.description ? (
            <span className="mt-0.5 block truncate text-xs text-slate-500">
              {selected.description}
            </span>
          ) : null}
        </span>
        <ChevronDown
          aria-hidden
          className={`size-5 shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180 text-sky-400" : ""
          }`}
        />
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          aria-activedescendant={`${listboxId}-${activeIndex}`}
          onKeyDown={handleListKeyDown}
          className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#0b1119] p-1.5 shadow-2xl shadow-black/60 focus:outline-none"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <li
                key={option.value}
                id={`${listboxId}-${index}`}
                role="option"
                aria-selected={isSelected}
                data-active={isActive}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => select(index)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isActive ? "bg-sky-400/10" : ""
                }`}
              >
                <span className="min-w-0">
                  <span
                    className={`block truncate text-sm font-semibold ${
                      isSelected ? "text-sky-300" : "text-slate-100"
                    }`}
                  >
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="block truncate text-xs text-slate-500">
                      {option.description}
                    </span>
                  ) : null}
                </span>
                {isSelected ? (
                  <Check aria-hidden className="size-4 shrink-0 text-sky-400" />
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
