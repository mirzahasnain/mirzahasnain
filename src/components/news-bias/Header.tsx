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
    </header>
  );
}
