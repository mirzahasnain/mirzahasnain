/** Country / currency → ISO flag code used for emoji flags. */
const COUNTRY_CODES: Record<string, string> = {
  "United States": "US",
  Eurozone: "EU",
  "United Kingdom": "GB",
  Japan: "JP",
  Australia: "AU",
  Canada: "CA",
  Switzerland: "CH",
  "New Zealand": "NZ",
};

export function countryToCode(country: string): string {
  return COUNTRY_CODES[country] ?? "UN";
}

/** Renders a flag emoji from an ISO 3166-1 alpha-2 code (or EU). */
export function flagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase();
  if (code === "EU") return "🇪🇺";
  if (code === "UN" || code.length !== 2) return "🏳️";
  const chars = [...code].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...chars);
}

export function formatCalendarNumber(
  value: number | null | undefined,
  unit?: string,
): string {
  if (value === null || value === undefined) return "—";
  const abs = Math.abs(value);
  const digits = abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
  const text = value.toFixed(digits);
  if (!unit) return text;
  return `${text}${unit === "%" || unit === "K" || unit === "M" ? unit : ` ${unit}`}`;
}
