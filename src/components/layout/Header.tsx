"use client";

import { Button } from "@/components/ui/Button";
import { LINKS, NAV_LINKS, SITE } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-space-950/70 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container-site flex h-16 items-center justify-between sm:h-20">
        <a href="#home" className="font-heading text-xl font-bold tracking-[0.2em] text-white">
          {SITE.name}
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-heading text-xs uppercase tracking-[0.22em] text-text-muted transition-colors hover:text-neon-blue"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href={LINKS.buy} className="!px-5 !py-2.5 !text-xs">
            Buy
          </Button>
          <Button href={LINKS.telegram} variant="outline" className="!px-5 !py-2.5 !text-xs">
            Join Telegram
          </Button>
        </div>

        <button
          type="button"
          className="rounded-lg border border-white/15 p-2 text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="border-t border-white/10 bg-space-950/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="container-site flex flex-col gap-4 py-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-heading text-sm uppercase tracking-[0.22em] text-text-muted"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-3">
                <Button href={LINKS.buy}>Buy</Button>
                <Button href={LINKS.telegram} variant="outline">
                  Join Telegram
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
