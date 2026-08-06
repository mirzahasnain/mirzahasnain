export async function writeToClipboard(text: string): Promise<boolean> {
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
