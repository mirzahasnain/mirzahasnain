"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/workspace", label: "Workspace" },
  { href: "/calendar", label: "Calendar" },
  { href: "/terminal", label: "Terminal" },
  { href: "/news-bias", label: "Analyze" },
] as const;

interface AppNavProps {
  className?: string;
  align?: "start" | "center";
}

/**
 * Shared primary navigation — consistent across workspace shells.
 * Accessibility: aria-current on the active route; focus-visible rings.
 */
export function AppNav({ className = "", align = "start" }: AppNavProps) {
  const pathname = usePathname() ?? "";

  return (
    <nav
      aria-label="Primary"
      className={[
        "mt-4 flex flex-wrap gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.16em]",
        align === "center" ? "justify-center" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {LINKS.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={[
              "min-h-9 inline-flex items-center rounded-md px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-nb-accent/70",
              active ? "text-nb-accent" : "text-nb-muted hover:text-nb-accent",
            ].join(" ")}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
