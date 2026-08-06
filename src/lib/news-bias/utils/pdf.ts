/**
 * Minimal PDF writer for plain text documents. Writing the few hundred bytes of
 * PDF structure by hand keeps the export dependency-free; it only needs the two
 * standard Helvetica faces, which every reader ships with.
 */

export interface PdfTextLine {
  text: string;
  bold?: boolean;
  size?: number;
  /** Extra vertical gap before the line, in points. */
  spaceBefore?: number;
}

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 56;
const DEFAULT_SIZE = 11;
const LEADING_RATIO = 1.35;
/** Helvetica averages close to half the font size per character. */
const CHAR_WIDTH_RATIO = { regular: 0.5, bold: 0.545 };
const PDF_MIME = "application/pdf";
/** Object numbers 1-4 are the catalog, page tree and two fonts. */
const FIRST_PAGE_OBJECT = 5;

interface PlacedLine {
  text: string;
  bold: boolean;
  size: number;
  y: number;
}

export function createTextPdf(lines: PdfTextLine[]): Blob {
  const pages = paginate(lines);
  return new Blob([serialize(pages)], { type: PDF_MIME });
}

function paginate(lines: PdfTextLine[]): PlacedLine[][] {
  const pages: PlacedLine[][] = [];
  let page: PlacedLine[] = [];
  let y = PAGE_HEIGHT - MARGIN;

  for (const line of lines) {
    const size = line.size ?? DEFAULT_SIZE;
    const bold = line.bold ?? false;
    const leading = size * LEADING_RATIO;
    y -= line.spaceBefore ?? 0;

    for (const text of wrap(line.text, size, bold)) {
      if (y - leading < MARGIN) {
        pages.push(page);
        page = [];
        y = PAGE_HEIGHT - MARGIN;
      }

      y -= leading;
      page.push({ text, bold, size, y });
    }
  }

  pages.push(page);
  return pages;
}

function wrap(text: string, size: number, bold: boolean): string[] {
  const ratio = bold ? CHAR_WIDTH_RATIO.bold : CHAR_WIDTH_RATIO.regular;
  const maxChars = Math.max(8, Math.floor((PAGE_WIDTH - MARGIN * 2) / (size * ratio)));
  const words = text.split(/\s+/).filter(Boolean).flatMap((word) => splitLongWord(word, maxChars));

  if (words.length === 0) return [""];

  const wrapped: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      wrapped.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) wrapped.push(current);
  return wrapped;
}

function splitLongWord(word: string, maxChars: number): string[] {
  if (word.length <= maxChars) return [word];

  const parts: string[] = [];
  for (let index = 0; index < word.length; index += maxChars) {
    parts.push(word.slice(index, index + maxChars));
  }
  return parts;
}

function serialize(pages: PlacedLine[][]): string {
  const pageObjectId = (index: number) => FIRST_PAGE_OBJECT + index * 2;
  const contentObjectId = (index: number) => pageObjectId(index) + 1;

  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${pages
      .map((_, index) => `${pageObjectId(index)} 0 R`)
      .join(" ")}] /Count ${pages.length} >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  ];

  pages.forEach((page, index) => {
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}]` +
        ` /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjectId(index)} 0 R >>`,
    );

    const stream = buildContentStream(page);
    objects.push(
      `<< /Length ${byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    );
  });

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  objects.forEach((body, index) => {
    offsets.push(byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const startXref = byteLength(pdf);
  const size = objects.length + 1;

  pdf += `xref\n0 ${size}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${size} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;

  return pdf;
}

function buildContentStream(lines: PlacedLine[]): string {
  return lines
    .map(
      (line) =>
        `BT /${line.bold ? "F2" : "F1"} ${line.size} Tf 1 0 0 1 ${MARGIN} ${line.y.toFixed(2)} Tm (${escapeText(line.text)}) Tj ET`,
    )
    .join("\n");
}

/** Keeps the stream inside ASCII and escapes the delimiters PDF reserves. */
function escapeText(text: string): string {
  return toAscii(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

const CHARACTER_REPLACEMENTS: Record<string, string> = {
  "\u2018": "'",
  "\u2019": "'",
  "\u201c": '"',
  "\u201d": '"',
  "\u2013": "-",
  "\u2014": "-",
  "\u2192": "->",
  "\u00a0": " ",
};

/**
 * Staying inside ASCII keeps one byte per character, so the file is identical
 * whether it is measured as a string or written out as UTF-8.
 */
function toAscii(text: string): string {
  return [...text]
    .map((character) => {
      const replacement = CHARACTER_REPLACEMENTS[character];
      if (replacement !== undefined) return replacement;
      return character.charCodeAt(0) <= 126 ? character : "?";
    })
    .join("");
}

function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}
