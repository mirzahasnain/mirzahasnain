import type { KeyboardEvent } from "react";

/** Marks a focusable option inside a picker group. */
export const OPTION_ATTRIBUTE = "data-nb-option";

const OPTION_SELECTOR = `[${OPTION_ATTRIBUTE}]`;

/**
 * Arrow keys walk the options, Home and End jump to the ends, Escape backs out.
 * Enter and Space need no handling: the options are real buttons.
 */
export function handleOptionKeyDown(
  event: KeyboardEvent<HTMLElement>,
  onCancel?: () => void,
): void {
  if (event.key === "Escape") {
    if (!onCancel) return;
    event.preventDefault();
    onCancel();
    return;
  }

  const step = STEPS[event.key];
  if (step === undefined) return;

  const options = [
    ...event.currentTarget.querySelectorAll<HTMLElement>(OPTION_SELECTOR),
  ];
  if (options.length === 0) return;

  event.preventDefault();
  const current = options.indexOf(document.activeElement as HTMLElement);
  options[nextIndex(current, step, options.length)]?.focus();
}

const STEPS: Record<string, number | undefined> = {
  ArrowDown: 1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
  Home: Number.NEGATIVE_INFINITY,
  End: Number.POSITIVE_INFINITY,
};

function nextIndex(current: number, step: number, count: number): number {
  if (step === Number.NEGATIVE_INFINITY) return 0;
  if (step === Number.POSITIVE_INFINITY) return count - 1;
  if (current < 0) return step > 0 ? 0 : count - 1;

  return (current + step + count) % count;
}

/** Moves focus into a picker, used when arrowing down out of the search box. */
export function focusFirstOption(container: HTMLElement | null): void {
  container?.querySelector<HTMLElement>(OPTION_SELECTOR)?.focus();
}
