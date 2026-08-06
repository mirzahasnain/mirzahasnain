/**
 * Input sanitization helpers (Security — Sprint 1 foundation).
 */
export function stripControlChars(input: string): string {
  return input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

export function sanitizePlainText(input: string, maxLength = 2_000): string {
  return stripControlChars(input).trim().slice(0, maxLength);
}

export function sanitizeSearchQuery(input: string): string {
  return sanitizePlainText(input, 120).replace(/[<>]/g, "");
}

/** Escape text for safe HTML text-node insertion (not attributes). */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
