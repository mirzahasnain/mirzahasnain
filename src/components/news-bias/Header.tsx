import Link from "next/link";
import { ThemeToggle } from "@/components/news-bias/ThemeToggle";
import { APP } from "@/lib/news-bias/constants";

export function Header() {
  return (
    <header className="relative text-center">
      <div className="absolute right-0 top-0">
        <ThemeToggle />
      </div>

      <h1 className="text-3xl font-black tracking-tight text-nb-text sm:text-5xl">
        {APP.title}
      </h1>
      <p className="mt-2 text-sm text-nb-muted sm:text-base">{APP.subtitle}</p>
      <nav className="mt-4 flex justify-center gap-4 text-xs font-semibold uppercase tracking-[0.18em]">
        <Link href="/calendar" className="text-nb-muted hover:text-nb-accent">
          Calendar
        </Link>
        <Link href="/news-bias" className="text-nb-accent hover:underline">
          Analysis
        </Link>
      </nav>
    </header>
  );
}
