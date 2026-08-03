import { CandlestickChart } from "lucide-react";
import { APP } from "@/lib/news-bias/constants";

export function Header() {
  return (
    <header className="text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-sky-300">
        <CandlestickChart aria-hidden className="size-4" />
        Trading Bias
      </div>

      <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-50 sm:text-5xl">
        {APP.title}
      </h1>
      <p className="mt-3 text-sm text-slate-400 sm:text-base">{APP.subtitle}</p>
    </header>
  );
}
