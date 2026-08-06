/**
 * Spacing / radius / shadow guidance aligned to existing nb terminal look.
 * Prefer these constants over inventing new visual language.
 */
export const tiSpace = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
} as const;

export const tiRadius = {
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
} as const;

export const tiShadow = {
  none: "none",
  soft: "0 1px 2px rgba(0,0,0,0.24)",
} as const;
