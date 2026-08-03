import { APP } from "@/lib/news-bias/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/5 pt-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
        {APP.version}
      </p>
      <p className="mt-2 text-xs text-slate-600">{APP.disclaimer}</p>
    </footer>
  );
}
