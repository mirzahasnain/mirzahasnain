import { SHARE } from "./constants";

export function buildShareText(score: number) {
  return SHARE.buildText(score);
}

export function shareOnX(score: number) {
  const text = buildShareText(score);
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
  return url;
}
