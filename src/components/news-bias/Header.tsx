import { APP } from "@/lib/news-bias/constants";

export function Header() {
  return (
    <header className="text-center">
      <h1 className="text-4xl font-black tracking-tight text-slate-50 sm:text-5xl">
        {APP.title}
      </h1>
      <p className="mt-3 text-base text-slate-500">{APP.subtitle}</p>
    </header>
  );
}
