"use client";

import { Button } from "@/components/ui/Button";
import { LINKS, NAV_LINKS, SITE } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

const headerBtnClass = "!rounded-full !px-5 !py-2.5 !text-xs";
const headerIconBtnClass = "!rounded-full !px-3.5 !py-2.5 !text-xs";

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
          <Button href={LINKS.buy} className={headerBtnClass} aria-label="Buy NIBBO">
            Buy
          </Button>
          <Button
            href={LINKS.twitter}
            variant="outline"
            className={headerIconBtnClass}
            aria-label="Follow NIBBO on X"
          >
            <X size={14} />
            X
          </Button>
          <Button
            href={LINKS.instagram}
            variant="outline"
            className={headerIconBtnClass}
            aria-label="Follow NIBBO on Instagram"
          >
            <InstagramIcon size={14} />
            Instagram
          </Button>
          <Button
            href={LINKS.telegram}
            variant="outline"
            className={headerBtnClass}
            aria-label="Join NIBBO Telegram"
          >
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
                <Button href={LINKS.buy} className="!rounded-full" aria-label="Buy NIBBO">
                  Buy
                </Button>
                <Button
                  href={LINKS.twitter}
                  variant="outline"
                  className="!rounded-full"
                  aria-label="Follow NIBBO on X"
                >
                  <X size={16} />
                  X
                </Button>
                <Button
                  href={LINKS.instagram}
                  variant="outline"
                  className="!rounded-full"
                  aria-label="Follow NIBBO on Instagram"
                >
                  <InstagramIcon size={16} />
                  Instagram
                </Button>
                <Button
                  href={LINKS.telegram}
                  variant="outline"
                  className="!rounded-full"
                  aria-label="Join NIBBO Telegram"
                >
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
