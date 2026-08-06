import { APP } from "@/lib/news-bias/constants";

export function Footer() {
  return (
    <footer className="border-t border-nb-border pt-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-nb-muted">
        {APP.version}
      </p>
      <p className="mt-2 text-xs text-nb-faint">{APP.disclaimer}</p>
    </footer>
  );
}
